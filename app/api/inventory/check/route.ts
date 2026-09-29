import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/products/repository';
export async function POST(req:NextRequest){const body=await req.json().catch(()=>({}));const ids=Array.isArray(body.productIds)?body.productIds:[];const products=await getProducts();const map=new Map(products.map(p=>[p.id,p]));return NextResponse.json({items:ids.map((id:string)=>{const p=map.get(id);return {id,available:Boolean(p&&p.status==='available'&&p.quantity>0),status:p?.status??'missing'}})});}
