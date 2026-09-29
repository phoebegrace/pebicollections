import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
export function ProductGrid({products}:{products:Product[]}){ return products.length ? <div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div> : <div className="empty-state"><span>nothing in this binder pocket yet.</span><p>Try another collection or check back later.</p></div>; }
