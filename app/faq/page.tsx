import { PageHero } from '@/components/ui/PageHero';
const faqs=[
 ['Is Pebicart a regular K-pop store?','Not really. Pebicart is primarily a personal collection clearout and archive. Most pieces came from my own years of collecting.'],
 ['Does adding something to my basket reserve it?','No. A basket is only a list of your picks. The site checks availability again when you submit your claim.'],
 ['When do I pay?','After your claim is reviewed and confirmed. Payment instructions can be sent through your preferred social account and email.'],
 ['Why do you ask for my email?','It is used for claim confirmations, order-status updates and shipping information. Marketing emails are a separate optional choice.'],
 ['Can I flip photocards on the site?','Yes. Tap or swipe a photocard to see its back. Some cards may temporarily share a reference back image until their exact scan is uploaded.'],
 ['What happens to sold items?','They stay visible in the sold archive, but they can no longer be added to a basket.']
];
export default function FAQ(){return <><PageHero eyebrow="before you claim" title="FAQ" copy="The little things worth knowing first."/><section className="section shell faq-list">{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</section></>}
