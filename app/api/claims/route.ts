import { NextRequest, NextResponse } from 'next/server';
import { createClaim } from '@/lib/orders/create-claim';
import { fireOrderIntegrations } from '@/lib/integrations/webhooks';
export async function POST(req:NextRequest){
  try{const body=await req.json();const result=await createClaim(body);if(!result.ok)return NextResponse.json({error:result.error,issues:'issues'in result?result.issues:undefined},{status:result.status});
  void fireOrderIntegrations('claim.created',result.data);return NextResponse.json(result.data,{status:201});}
  catch(error){console.error(error);return NextResponse.json({error:'Pebicart could not submit this claim right now. Please try again.'},{status:500})}
}
