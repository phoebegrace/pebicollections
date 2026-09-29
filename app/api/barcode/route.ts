import { NextRequest, NextResponse } from 'next/server';
import { barcodePng } from '@/lib/barcodes';
export const runtime='nodejs';
export async function GET(req:NextRequest){const value=req.nextUrl.searchParams.get('value')?.trim(); if(!value)return NextResponse.json({error:'Missing barcode value'},{status:400}); try{const png=await barcodePng(value);return new NextResponse(new Uint8Array(png),{headers:{'content-type':'image/png','cache-control':'public, max-age=31536000, immutable'}})}catch{return NextResponse.json({error:'Invalid barcode value'},{status:400})}}
