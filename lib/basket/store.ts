import type { BasketItem, Product } from '@/types';
export const BASKET_KEY = 'pebicart-basket-v1';

export function addProduct(items: BasketItem[], product: Product): BasketItem[] {
  if (product.status !== 'available' || product.quantity < 1) return items;
  if (items.some(i => i.product.id === product.id)) return items;
  return [...items, { product, quantity: 1 }];
}
export function removeProduct(items: BasketItem[], productId: string) { return items.filter(i => i.product.id !== productId); }
export function basketCount(items: BasketItem[]) { return items.reduce((sum, item) => sum + item.quantity, 0); }
export function basketSubtotal(items: BasketItem[]) { return items.reduce((sum,item) => sum + (item.product.price ?? 0) * item.quantity, 0); }
