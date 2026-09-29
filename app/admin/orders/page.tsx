import { requireAdmin } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/supabase/server';
import { OrderAdminClient } from '@/components/admin/OrderAdminClient';
export default async function Page(){await requireAdmin();let orders:any[]=[];try{const supabase=createServiceClient();const {data}=await supabase.from('orders').select('*, customers(first_name,email,instagram_handle,tiktok_handle,preferred_contact_platform)').order('created_at',{ascending:false});orders=data??[];}catch{}return <section className="admin-content"><div className="eyebrow">claims</div><h1>orders</h1>{orders.length?<OrderAdminClient initial={orders}/>:<div className="empty-state"><span>no claims yet.</span><p>New claim submissions will appear here after Supabase is connected.</p></div>}</section>}
