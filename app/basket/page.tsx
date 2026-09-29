import { PageHero } from '@/components/ui/PageHero';import { BasketPageClient } from '@/components/basket/BasketPageClient';
export default function Basket(){return <><PageHero eyebrow="your picks" title="basket" copy="Keep everything together before you send your claim."/><section className="section shell"><BasketPageClient/></section></>}
