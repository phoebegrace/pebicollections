import { PageHero } from '@/components/ui/PageHero';import { ClaimForm } from '@/components/basket/ClaimForm';
export default function Claim(){return <><PageHero eyebrow="claim checkout" title="send your picks" copy="No payment yet. First, let me confirm everything is still yours."/><section className="section shell narrow"><ClaimForm/></section></>}
