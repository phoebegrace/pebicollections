import Link from 'next/link';
import type { Product } from '@/types';
import { PhotocardFlip } from './PhotocardFlip';
import { Price } from '@/components/ui/Price';
import { StatusPill } from '@/components/ui/StatusPill';
import { AddToBasketButton } from './AddToBasketButton';

export function ProductCard({product}:{product:Product}){
  return <article className={`product-card ${product.status==='sold'?'is-sold':''}`}>
    <div className="product-media">{product.category==='photocards' ? <PhotocardFlip front={product.front_image} back={product.back_image} alt={product.title}/> : <Link href={`/product/${product.slug}`} className="standard-product-image"><img src={product.front_image} alt={product.title}/></Link>}
      {product.status==='sold' && <div className="sold-stamp">SOLD</div>}
    </div>
    <div className="product-copy"><div className="product-meta"><span>{product.group_name}</span><StatusPill status={product.status}/></div>
      <Link href={`/product/${product.slug}`}><h3>{product.member_name ? `${product.member_name} · `:''}{product.title}</h3></Link>
      <p>{[product.era,product.condition].filter(Boolean).join(' · ')}</p>
      <div className="product-actions"><Price value={product.price}/><AddToBasketButton product={product}/></div>
    </div>
  </article>;
}
