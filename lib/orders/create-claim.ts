import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const ClaimSchema = z.object({
  email: z.string().trim().email(),
  instagramHandle: z.string().trim().max(80).optional().default(''),
  tiktokHandle: z.string().trim().max(80).optional().default(''),
  preferredContactPlatform: z.enum(['instagram','tiktok']),
  marketingOptIn: z.boolean().default(false),
  notes: z.string().trim().max(1000).optional().default(''),
  items: z.array(z.object({ product_id:z.string().min(1), quantity:z.number().int().min(1).max(10) })).min(1)
}).superRefine((data,ctx)=>{
  if(!data.instagramHandle && !data.tiktokHandle) ctx.addIssue({code:'custom',path:['instagramHandle'],message:'Add at least one Instagram or TikTok handle.'});
  if(data.preferredContactPlatform==='instagram'&&!data.instagramHandle)ctx.addIssue({code:'custom',path:['instagramHandle'],message:'Add your Instagram handle or choose TikTok.'});
  if(data.preferredContactPlatform==='tiktok'&&!data.tiktokHandle)ctx.addIssue({code:'custom',path:['tiktokHandle'],message:'Add your TikTok handle or choose Instagram.'});
});

export async function createClaim(input: unknown){
  const parsed=ClaimSchema.safeParse(input);
  if(!parsed.success) return {ok:false as const,status:400,error:'Please check your claim details.',issues:parsed.error.flatten()};
  const data=parsed.data;
  const supabase=await createServerSupabaseClient();
  const {data:result,error}=await supabase.rpc('create_claim_atomic',{
    p_email:data.email,
    p_instagram_handle:data.instagramHandle||null,
    p_tiktok_handle:data.tiktokHandle||null,
    p_preferred_contact_platform:data.preferredContactPlatform,
    p_marketing_opt_in:data.marketingOptIn,
    p_notes:data.notes||null,
    p_items:data.items
  });
  if(error){
    const inventory=/INVENTORY/i.test(error.message);
    return {ok:false as const,status:inventory?409:400,error:inventory?'One of your picks was just claimed or is no longer available. Please refresh your basket.':error.message.replace(/^.*VALIDATION:\s*/i,'')};
  }
  return {ok:true as const,data:result as {order_id:string;order_number:string;public_token:string;subtotal:number}};
}
