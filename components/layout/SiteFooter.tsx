import Link from 'next/link';
export function SiteFooter() {
  return <footer className="site-footer">
    <div className="shell footer-grid">
      <div><div className="footer-logo">pebi</div><p>from my collection, to yours.</p><p className="muted">Personal K-pop collection clearout by @pebicart.</p></div>
      <div><strong>Browse</strong><Link href="/photocards">Photocards</Link><Link href="/albums">Albums</Link><Link href="/bundles">Bundles</Link><Link href="/sold">Sold archive</Link></div>
      <div><strong>Info</strong><Link href="/faq">FAQ</Link><Link href="/shipping-claims">Shipping & Claims</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><a href="mailto:info@pebicollections.com">info@pebicollections.com</a></div>
      <div><strong>Find pebi</strong><a href="https://instagram.com/pebicart" target="_blank" rel="noreferrer">Instagram</a><a href="https://tiktok.com/@pebicart" target="_blank" rel="noreferrer">TikTok</a><a href="https://x.com/pebicart" target="_blank" rel="noreferrer">X</a></div>
    </div>
    <div className="shell footer-bottom">© {new Date().getFullYear()} Pebicart. Personal collection archive.</div>
  </footer>;
}
