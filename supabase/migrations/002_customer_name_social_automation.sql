alter table customers add column if not exists first_name text;

drop function if exists create_claim_atomic(text,text,text,contact_platform,boolean,text,jsonb);

create or replace function create_claim_atomic(
  p_first_name text,
  p_email text,
  p_social_handle text,
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
  v_handle text;
begin
  if coalesce(trim(p_first_name),'') = '' then
    raise exception 'VALIDATION: first name is required';
  end if;
  if p_email is null or position('@' in p_email) < 2 then
    raise exception 'VALIDATION: invalid email';
  end if;
  v_handle := trim(coalesce(p_social_handle,''));
  if v_handle = '' then
    raise exception 'VALIDATION: social username is required';
  end if;
  if jsonb_array_length(p_items) = 0 then
    raise exception 'VALIDATION: basket is empty';
  end if;

  insert into customers(
    first_name,
    email,
    instagram_handle,
    tiktok_handle,
    preferred_contact_platform,
    marketing_opt_in,
    marketing_opt_in_at
  ) values(
    trim(p_first_name),
    lower(trim(p_email)),
    case when p_preferred_contact_platform = 'instagram' then v_handle else null end,
    case when p_preferred_contact_platform = 'tiktok' then v_handle else null end,
    p_preferred_contact_platform,
    p_marketing_opt_in,
    case when p_marketing_opt_in then now() else null end
  ) returning id into v_customer_id;

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

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'public_token', v_public_token,
    'subtotal', v_subtotal,
    'first_name', trim(p_first_name),
    'email', lower(trim(p_email)),
    'preferred_contact_platform', p_preferred_contact_platform,
    'social_handle', v_handle,
    'marketing_opt_in', p_marketing_opt_in
  );
end;
$$;

grant execute on function create_claim_atomic(text,text,text,contact_platform,boolean,text,jsonb) to anon, authenticated;
