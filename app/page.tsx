import Link from 'next/link';
import { getProducts } from '@/lib/products/repository';
import { Hero } from '@/components/home/Hero';
import { CategoryTiles } from '@/components/home/CategoryTiles';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SectionTitle } from '@/components/ui/SectionTitle';

export default async function Home(){
 const products=await getProducts(); const newItems=products.filter(p=>p.new_arrival).slice(0,4); const sold=products.filter(p=>p.status==='sold').slice(0,4);
 return <>
  <Hero products={products}/>
  <section className="section shell"><SectionTitle eyebrow="browse the binder" title="pick your corner" copy="Start with photocards, albums, bundles, or peek at what already found a new shelf."/><CategoryTiles/></section>
  <section className="section section-tint"><div className="shell"><SectionTitle eyebrow="just added" title="new in the binder" copy="Freshly listed from my personal collection."/><ProductGrid products={newItems}/><div className="section-cta"><Link className="text-link" href="/shop">view everything →</Link></div></div></section>
  <section className="collector-note"><div className="shell collector-grid"><div><div className="eyebrow">a collector note</div><h2>these were once part of my shelf too.</h2></div><div><p>Most pieces here came from years of collecting: album pulls, VCEs, benefits, duplicates, and eras I loved enough to keep way too much of.</p><p>I’m letting some of them go slowly, carefully, and hopefully to someone who’ll be just as excited to pull them out of the mail.</p></div></div></section>
  <section className="section shell"><SectionTitle eyebrow="how claiming works" title="simple, soft, no rush"/><div className="steps"><div><span>01</span><h3>add your picks</h3><p>Build a claim basket from anything currently available.</p></div><div><span>02</span><h3>send your claim</h3><p>Leave your email and IG or TikTok handle.</p></div><div><span>03</span><h3>wait for confirmation</h3><p>I’ll confirm availability before payment.</p></div><div><span>04</span><h3>payment + shipping</h3><p>Once confirmed, you’ll get the next steps by email.</p></div></div></section>
  <section className="social-band"><div className="shell"><span>@pebicart</span><h2>more than a shop,<br/>it’s my fangirl archive.</h2><div className="social-links"><a href="https://instagram.com/pebicart">Instagram</a><a href="https://tiktok.com/@pebicart">TikTok</a><a href="https://x.com/pebicart">X</a></div></div></section>
  {sold.length>0&&<section className="section shell"><SectionTitle eyebrow="archive" title="already found a new shelf"/><ProductGrid products={sold}/></section>}
 </>;
}
