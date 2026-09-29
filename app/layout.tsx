import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { BasketProvider } from '@/components/basket/BasketProvider';
import { MusicDrawer } from '@/components/music/MusicDrawer';

const serif = Cormorant_Garamond({ subsets:['latin'], variable:'--font-display', weight:['500','600','700'] });
const sans = Inter({ subsets:['latin'], variable:'--font-sans' });

export const metadata: Metadata = {
  title: { default:'pebi collections | personal K-pop collection', template:'%s | pebi collections' },
  description:'Photocards, albums and little pieces of a fangirl era looking for a new home.',
  openGraph:{ title:'pebi collections', description:'from my collection, to yours.', type:'website' },
  twitter:{ card:'summary_large_image', title:'pebi collections', description:'from my collection, to yours.' }
};

export default function RootLayout({ children }:{children:React.ReactNode}){
  return <html lang="en" className={`${serif.variable} ${sans.variable}`}><body><BasketProvider><SiteHeader/><main>{children}</main><MusicDrawer/><SiteFooter/></BasketProvider></body></html>;
}
