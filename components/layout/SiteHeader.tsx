'use client';

import Link from 'next/link';
import { useBasket } from '@/components/basket/BasketProvider';

const links = [
  { label: 'Shop', href: '/shop', icon: '/assets/images/icons/navigation/shop.png' },
  { label: 'Photocards', href: '/photocards', icon: '/assets/images/icons/navigation/photocards.png' },
  { label: 'Albums', href: '/albums', icon: '/assets/images/icons/navigation/albums.png' },
  { label: 'Bundles', href: '/bundles', icon: '/assets/images/icons/navigation/bundles.png' },
  { label: 'Sold', href: '/sold', icon: '/assets/images/icons/navigation/sold.png' },
  { label: 'FAQ', href: '/faq', icon: '/assets/images/icons/navigation/faqs.png' }
] as const;

export function SiteHeader() {
  const { count } = useBasket();

  return <>
    <header className="site-header">
      <div className="shell header-inner header-centered">
        <Link href="/" className="wordmark wordmark-centered" aria-label="Pebi home">
          <img src="/assets/images/branding/pebi-collections-logo.png" alt="pebi collections" />
        </Link>
      </div>
    </header>

    <nav className="nav-dock" aria-label="Main navigation">
      {links.map(item => (
        <Link key={item.href} href={item.href} className="dock-item" aria-label={item.label}>
          <img className="nav-icon-image" src={item.icon} alt="" aria-hidden="true" />
          <span>{item.label}</span>
        </Link>
      ))}
      <Link href="/basket" className="dock-item dock-basket" aria-label={`Basket with ${count} items`}>
        <span className="dock-icon-wrap">
          <img className="nav-icon-image" src="/assets/images/icons/navigation/basket.png" alt="" aria-hidden="true" />
          {count > 0 && <b className="dock-count">{count}</b>}
        </span>
        <span>Basket</span>
      </Link>
    </nav>
  </>;
}
