'use client';
import Link from 'next/link';
import { useBasket } from './BasketProvider';
import { Price } from '@/components/ui/Price';
export function BasketPageClient(){
 const {items,subtotal,remove}=useBasket();
 if(!items.length)return <div className="empty-state large"><span>your basket is still waiting for its first pull.</span><p>Start with the latest cards in the binder.</p><Link className="button button-primary" href="/photocards">browse photocards</Link></div>;
 return <div className="basket-layout"><div className="basket-items">{items.map(({product})=><article className="basket-item" key={product.id}><img src={product.front_image} alt={product.title}/><div><span className="eyebrow">{product.group_name} · {product.era}</span><h3>{product.member_name ? `${product.member_name} · `:''}{product.title}</h3><code>{product.barcode}</code><Price value={product.price}/></div><button onClick={()=>remove(product.id)} className="text-button">remove</button></article>)}</div><aside className="basket-summary"><div className="eyebrow">claim basket</div><h2>{items.length} {items.length===1?'pick':'picks'}</h2><div className="summary-row"><span>Items subtotal</span><strong>{new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP'}).format(subtotal)}</strong></div><div className="summary-row muted"><span>Shipping</span><span>after confirmation</span></div><Link href="/claim" className="button button-primary button-block">continue to claim</Link><p>Nothing is reserved until the claim is successfully submitted and confirmed.</p></aside></div>;
}
