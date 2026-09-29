create extension if not exists pgcrypto;

create type product_status as enum ('available','pending','reserved','sold');
create type product_category as enum ('photocards','albums','bundles');
create type order_status as enum ('pending_confirmation','confirmed','awaiting_payment','payment_received','packing','shipped','completed','cancelled');
create type contact_platform as enum ('instagram','tiktok');

create sequence if not exists order_number_seq start 1;

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  sku text not null unique,
  barcode text not null unique,
  title text not null,
  group_name text not null,
  member_name text,
  era text,
  collection_name text,
  category product_category not null,
  subcategory text,
  price numeric(12,2),
  original_price numeric(12,2),
  condition text not null default 'Good',
  sealed boolean not null default false,
  is_pob boolean not null default false,
  is_vce boolean not null default false,
  description text,
  front_image text not null,
  back_image text,
  quantity integer not null default 1 check (quantity >= 0),
  status product_status not null default 'available',
  featured boolean not null default false,
  new_arrival boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  instagram_handle text,
  tiktok_handle text,
  preferred_contact_platform contact_platform not null,
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  public_token uuid not null default gen_random_uuid() unique,
  customer_id uuid not null references customers(id) on delete restrict,
  status order_status not null default 'pending_confirmation',
  subtotal numeric(12,2) not null default 0,
  shipping_cost numeric(12,2),
  total numeric(12,2) not null default 0,
  notes text,
  internal_notes text,
  payment_reference text,
  courier text,
  tracking_number text,
  tracking_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  product_title_snapshot text not null,
  member_name_snapshot text,
  price_snapshot numeric(12,2),
  quantity integer not null check (quantity > 0),
  barcode_snapshot text not null,
  front_image_snapshot text,
  created_at timestamptz not null default now()
);

create table if not exists order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status order_status not null,
  note text,
  created_at timestamptz not null default now()
);

create index if not exists products_status_idx on products(status);
create index if not exists products_category_idx on products(category);
create index if not exists products_group_idx on products(group_name);
create index if not exists orders_status_idx on orders(status);
create index if not exists order_items_order_idx on order_items(order_id);

alter table products enable row level security;
alter table customers enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_status_history enable row level security;

create policy "public can browse products" on products for select using (true);
grant select on products to anon, authenticated;
revoke all on customers, orders, order_items, order_status_history from anon, authenticated;

create or replace function create_claim_atomic(
  p_email text,
  p_instagram_handle text,
  p_tiktok_handle text,
  p_preferred_contact_platform contact_platform,
  p_marketing_opt_in boolean,
  p_notes text,
  p_items jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_order_id uuid;
  v_order_number text;
  v_public_token uuid;
  v_subtotal numeric(12,2) := 0;
  v_item jsonb;
  v_product products%rowtype;
  v_qty integer;
begin
  if p_email is null or position('@' in p_email) < 2 then
    raise exception 'VALIDATION: invalid email';
  end if;
  if coalesce(trim(p_instagram_handle),'') = '' and coalesce(trim(p_tiktok_handle),'') = '' then
    raise exception 'VALIDATION: at least one social handle is required';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'VALIDATION: basket is empty';
  end if;

  insert into customers(email, instagram_handle, tiktok_handle, preferred_contact_platform, marketing_opt_in, marketing_opt_in_at)
  values(lower(trim(p_email)), nullif(trim(p_instagram_handle),''), nullif(trim(p_tiktok_handle),''), p_preferred_contact_platform, p_marketing_opt_in, case when p_marketing_opt_in then now() else null end)
  returning id into v_customer_id;

  v_order_number := 'PEBI-' || lpad(nextval('order_number_seq')::text, 4, '0');
  insert into orders(order_number, customer_id, notes) values(v_order_number, v_customer_id, p_notes)
  returning id, public_token into v_order_id, v_public_token;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := greatest(1, coalesce((v_item->>'quantity')::integer,1));
    select * into v_product from products where id = (v_item->>'product_id')::uuid for update;
    if not found then raise exception 'INVENTORY: product not found'; end if;
    if v_product.status <> 'available' or v_product.quantity < v_qty then
      raise exception 'INVENTORY: % is no longer available', v_product.title;
    end if;

    update products
      set quantity = quantity - v_qty,
          status = case when quantity - v_qty <= 0 then 'pending'::product_status else status end,
          updated_at = now()
      where id = v_product.id;

    insert into order_items(order_id, product_id, product_title_snapshot, member_name_snapshot, price_snapshot, quantity, barcode_snapshot, front_image_snapshot)
    values(v_order_id, v_product.id, v_product.title, v_product.member_name, v_product.price, v_qty, v_product.barcode, v_product.front_image);

    v_subtotal := v_subtotal + coalesce(v_product.price, 0) * v_qty;
  end loop;

  update orders set subtotal = v_subtotal, total = v_subtotal, updated_at = now() where id = v_order_id;
  insert into order_status_history(order_id, to_status, note) values(v_order_id, 'pending_confirmation', 'Claim submitted');

  return jsonb_build_object('order_id', v_order_id, 'order_number', v_order_number, 'public_token', v_public_token, 'subtotal', v_subtotal);
exception when others then
  raise;
end;
$$;

grant execute on function create_claim_atomic(text,text,text,contact_platform,boolean,text,jsonb) to anon, authenticated;
