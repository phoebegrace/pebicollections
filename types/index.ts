export type ProductStatus = 'available' | 'pending' | 'reserved' | 'sold';
export type ProductCategory = 'photocards' | 'albums' | 'bundles';
export type OrderStatus = 'pending_confirmation' | 'confirmed' | 'awaiting_payment' | 'payment_received' | 'packing' | 'shipped' | 'completed' | 'cancelled';

export interface Product {
  id: string;
  slug: string;
  sku: string;
  barcode: string;
  title: string;
  group_name: string;
  member_name: string | null;
  era: string | null;
  collection_name: string | null;
  category: ProductCategory;
  subcategory: string | null;
  price: number | null;
  original_price: number | null;
  condition: string;
  sealed: boolean;
  is_pob: boolean;
  is_vce: boolean;
  description: string | null;
  front_image: string;
  back_image: string | null;
  quantity: number;
  status: ProductStatus;
  featured: boolean;
  new_arrival: boolean;
  created_at: string;
  updated_at: string;
}

export interface BasketItem { product: Product; quantity: number; }

export interface OrderItemSnapshot {
  id?: string;
  product_id: string;
  product_title_snapshot: string;
  member_name_snapshot?: string | null;
  price_snapshot: number | null;
  quantity: number;
  barcode_snapshot: string;
  front_image_snapshot?: string | null;
}

export interface OrderView {
  id: string;
  order_number: string;
  public_token: string;
  status: OrderStatus;
  first_name: string;
  email: string;
  social_handle: string;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  preferred_contact_platform: 'instagram' | 'tiktok';
  subtotal: number;
  shipping_cost: number | null;
  total: number;
  courier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  created_at: string;
  items: OrderItemSnapshot[];
}
