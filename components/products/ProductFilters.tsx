'use client';
import { useMemo, useState } from 'react';
import type { Product } from '@/types';
import { ProductGrid } from './ProductGrid';

export function ProductFilters({products}:{products:Product[]}){
  const [query,setQuery]=useState('');
  const [group,setGroup]=useState('all');
  const [member,setMember]=useState('all');
  const [era,setEra]=useState('all');
  const [availability,setAvailability]=useState<'all'|'available'>('all');
  const [format,setFormat]=useState<'all'|'sealed'|'unsealed'>('all');
  const [benefit,setBenefit]=useState<'all'|'pob'|'vce'>('all');
  const [sort,setSort]=useState<'newest'|'oldest'|'name'|'price-low'|'price-high'>('newest');
  const [filtersOpen,setFiltersOpen]=useState(false);

  const groups=Array.from(new Set(products.map(p=>p.group_name).filter(Boolean))).sort();
  const members=Array.from(new Set(products.map(p=>p.member_name).filter((v):v is string=>Boolean(v)))).sort();
  const eras=Array.from(new Set(products.map(p=>p.era).filter((v):v is string=>Boolean(v)))).sort();

  const filtered=useMemo(()=>{
    const result=products.filter(p=>{
      const hay=[p.title,p.group_name,p.member_name,p.era,p.collection_name,p.sku,p.barcode].filter(Boolean).join(' ').toLowerCase();
      if(query && !hay.includes(query.toLowerCase()))return false;
      if(group!=='all'&&p.group_name!==group)return false;
      if(member!=='all'&&p.member_name!==member)return false;
      if(era!=='all'&&p.era!==era)return false;
      if(availability==='available'&&p.status!=='available')return false;
      if(format==='sealed'&&!p.sealed)return false;
      if(format==='unsealed'&&p.sealed)return false;
      if(benefit==='pob'&&!p.is_pob)return false;
      if(benefit==='vce'&&!p.is_vce)return false;
      return true;
    });
    return result.sort((a,b)=>{
      if(sort==='name')return a.title.localeCompare(b.title);
      if(sort==='oldest')return new Date(a.created_at).getTime()-new Date(b.created_at).getTime();
      if(sort==='price-low')return (a.price??Number.POSITIVE_INFINITY)-(b.price??Number.POSITIVE_INFINITY);
      if(sort==='price-high')return (b.price??Number.NEGATIVE_INFINITY)-(a.price??Number.NEGATIVE_INFINITY);
      return new Date(b.created_at).getTime()-new Date(a.created_at).getTime();
    });
  },[products,query,group,member,era,availability,format,benefit,sort]);

  return <>
    <button className="filter-toggle button button-secondary" onClick={()=>setFiltersOpen(v=>!v)} aria-expanded={filtersOpen}>filters & sort</button>
    <div className={`filters ${filtersOpen?'is-open':''}`}>
      <label className="search-field"><span>Search</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="member, era, barcode..."/></label>
      <label><span>Group</span><select value={group} onChange={e=>setGroup(e.target.value)}><option value="all">All groups</option>{groups.map(g=><option key={g}>{g}</option>)}</select></label>
      <label><span>Member</span><select value={member} onChange={e=>setMember(e.target.value)}><option value="all">All members</option>{members.map(v=><option key={v}>{v}</option>)}</select></label>
      <label><span>Era</span><select value={era} onChange={e=>setEra(e.target.value)}><option value="all">All eras</option>{eras.map(v=><option key={v}>{v}</option>)}</select></label>
      <label><span>Format</span><select value={format} onChange={e=>setFormat(e.target.value as typeof format)}><option value="all">Any format</option><option value="sealed">Sealed</option><option value="unsealed">Unsealed</option></select></label>
      <label><span>Benefit</span><select value={benefit} onChange={e=>setBenefit(e.target.value as typeof benefit)}><option value="all">Any type</option><option value="pob">POB</option><option value="vce">VCE</option></select></label>
      <label><span>Availability</span><select value={availability} onChange={e=>setAvailability(e.target.value as typeof availability)}><option value="all">All statuses</option><option value="available">Available only</option></select></label>
      <label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value as typeof sort)}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="name">Name</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
    </div>
    <div className="results-meta"><span>{filtered.length} item{filtered.length===1?'':'s'}</span>{(query||group!=='all'||member!=='all'||era!=='all'||availability!=='all'||format!=='all'||benefit!=='all')&&<button className="text-button" onClick={()=>{setQuery('');setGroup('all');setMember('all');setEra('all');setAvailability('all');setFormat('all');setBenefit('all')}}>clear filters</button>}</div>
    <ProductGrid products={filtered}/>
  </>;
}
