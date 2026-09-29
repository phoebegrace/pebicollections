import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products/repository';
import { PhotocardFlip } from '@/components/products/PhotocardFlip';
import { AddToBasketButton } from '@/components/products/AddToBasketButton';
import { Price } from '@/components/ui/Price';
import { StatusPill } from '@/components/ui/StatusPill';

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const product=await getProductBySlug(slug); if(!product) notFound();
 return <section className="section shell product-detail"><div className="product-detail-media">{product.category==='photocards'?<PhotocardFlip front={product.front_image} back={product.back_image} alt={product.title} priority/>:<img src={product.front_image} alt={product.title}/>}</div><div className="product-detail-copy"><div className="eyebrow">{product.group_name} · {product.era}</div><h1>{product.member_name ? `${product.member_name} · `:''}{product.title}</h1><div className="detail-price"><Price value={product.price}/><StatusPill status={product.status}/></div><p>{product.description}</p><dl className="details-list"><div><dt>Collection</dt><dd>{product.collection_name||'—'}</dd></div><div><dt>Condition</dt><dd>{product.condition}</dd></div><div><dt>Type</dt><dd>{product.sealed?'Sealed':'Unsealed / loose'}</dd></div><div><dt>SKU / barcode</dt><dd>{product.barcode}</dd></div></dl><img className="barcode-preview" src={`/api/barcode?value=${encodeURIComponent(product.barcode)}`} alt={`Barcode ${product.barcode}`}/><AddToBasketButton product={product}/><p className="microcopy">Adding an item to your basket does not reserve it yet. Availability is checked again when you submit your claim.</p></div></section>;
}
