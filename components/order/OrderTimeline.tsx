import type { OrderStatus } from '@/types';
const flow: {key:OrderStatus;label:string}[]=[
  {key:'pending_confirmation',label:'Claim received'},
  {key:'confirmed',label:'Confirmed'},
  {key:'awaiting_payment',label:'Awaiting payment'},
  {key:'payment_received',label:'Payment received'},
  {key:'packing',label:'Packing'},
  {key:'shipped',label:'Shipped'},
  {key:'completed',label:'Completed'}
];
export function OrderTimeline({status}:{status:OrderStatus}){
 if(status==='cancelled')return <div className="cancelled-state">This claim was cancelled.</div>;
 const active=Math.max(0,flow.findIndex(s=>s.key===status));
 return <ol className="order-timeline">{flow.map((s,i)=><li key={s.key} className={i<active?'complete':i===active?'current':''}><span className="timeline-dot"/><div><small>{String(i+1).padStart(2,'0')}</small><strong>{s.label}</strong></div></li>)}</ol>;
}
