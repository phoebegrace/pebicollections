import type { OrderView } from '@/types';
import { createServiceClient } from '@/lib/supabase/server';

export async function getOrderForPublicView(orderNumber: string, token: string): Promise<OrderView | null> {
  if (!token) return null;
  const supabase = createServiceClient();
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, customers(first_name,email,instagram_handle,tiktok_handle,preferred_contact_platform), order_items(*)')
    .eq('order_number', orderNumber)
    .eq('public_token', token)
    .maybeSingle();
  if (error || !order) return null;
  const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers;
  const preferred = customer?.preferred_contact_platform ?? 'instagram';
  const socialHandle = preferred === 'instagram' ? customer?.instagram_handle : customer?.tiktok_handle;
  return {
    id: order.id,
    order_number: order.order_number,
    public_token: order.public_token,
    status: order.status,
    first_name: customer?.first_name ?? '',
    email: customer?.email ?? '',
    social_handle: socialHandle ?? '',
    instagram_handle: customer?.instagram_handle ?? null,
    tiktok_handle: customer?.tiktok_handle ?? null,
    preferred_contact_platform: preferred,
    subtotal: Number(order.subtotal ?? 0),
    shipping_cost: order.shipping_cost == null ? null : Number(order.shipping_cost),
    total: Number(order.total ?? 0),
    courier: order.courier,
    tracking_number: order.tracking_number,
    tracking_url: order.tracking_url,
    created_at: order.created_at,
    items: (order.order_items ?? []).map((item: any) => ({
      id: item.id,
      product_id: item.product_id,
      product_title_snapshot: item.product_title_snapshot,
      member_name_snapshot: item.member_name_snapshot,
      price_snapshot: item.price_snapshot == null ? null : Number(item.price_snapshot),
      quantity: item.quantity,
      barcode_snapshot: item.barcode_snapshot,
      front_image_snapshot: item.front_image_snapshot
    }))
  };
}
