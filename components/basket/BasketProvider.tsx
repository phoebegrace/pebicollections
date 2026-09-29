'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { BasketItem, Product } from '@/types';
import { addProduct, basketCount, basketSubtotal, BASKET_KEY, removeProduct } from '@/lib/basket/store';

type BasketContextValue = {
  items: BasketItem[]; count: number; subtotal: number;
  add: (product: Product) => void; remove: (id: string) => void; clear: () => void;
};
const BasketContext = createContext<BasketContextValue | null>(null);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [items,setItems] = useState<BasketItem[]>([]);
  const [hydrated,setHydrated] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(BASKET_KEY); if (raw) setItems(JSON.parse(raw)); } catch {}
    setHydrated(true);
  },[]);
  useEffect(() => { if (hydrated) localStorage.setItem(BASKET_KEY, JSON.stringify(items)); },[items,hydrated]);
  const value = useMemo(() => ({
    items, count:basketCount(items), subtotal:basketSubtotal(items),
    add:(p:Product)=>setItems(prev=>addProduct(prev,p)),
    remove:(id:string)=>setItems(prev=>removeProduct(prev,id)),
    clear:()=>setItems([])
  }),[items]);
  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useBasket(){ const value=useContext(BasketContext); if(!value) throw new Error('useBasket must be used inside BasketProvider'); return value; }
