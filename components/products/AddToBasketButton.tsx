'use client';
import type { Product } from '@/types';
import { useBasket } from '@/components/basket/BasketProvider';
export function AddToBasketButton({product}:{product:Product}){
  const {items,add}=useBasket();
  const inBasket=items.some(i=>i.product.id===product.id);
  const unavailable=product.status!=='available'||product.quantity<1;
  return <button className="button button-primary" disabled={unavailable||inBasket} onClick={()=>add(product)}>{unavailable?'Unavailable':inBasket?'In basket':'Add to basket'}</button>;
}
