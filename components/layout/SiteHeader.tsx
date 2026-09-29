'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useBasket } from '@/components/basket/BasketProvider';

const links = [
  ['Shop','/shop'],['Photocards','/photocards'],['Albums','/albums'],['Bundles','/bundles'],['Sold','/sold'],['FAQ','/faq']
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useBasket();
  return <header className="site-header">
    <div className="shell header-inner">
      <Link href="/" className="wordmark" aria-label="Pebi home"><img src="/assets/images/branding/pebi-collections-logo.png" alt="pebi collections" /></Link>
      <button className="menu-button" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(v=>!v)}>
        <span/><span/><span/>
      </button>
      <nav className={`main-nav ${open ? 'is-open' : ''}`} aria-label="Main navigation">
        {links.map(([label,href]) => <Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
      </nav>
      <Link href="/basket" className="basket-link" aria-label={`Basket with ${count} items`}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9h14l-1 11H6L5 9Zm3 0 1-5h6l1 5"/></svg><span>{count}</span>
      </Link>
    </div>
  </header>;
}
