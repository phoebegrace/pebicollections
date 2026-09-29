import { redirect } from 'next/navigation';
import { env } from '@/lib/config/env';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getAdminUser(){
  try{
    const supabase=await createServerSupabaseClient();
    const {data:{user}}=await supabase.auth.getUser();
    if(!user)return null;
    if(env.adminEmails.length && (!user.email || !env.adminEmails.includes(user.email.toLowerCase()))) return null;
    return user;
  }catch{return null;}
}
export async function requireAdmin(){const user=await getAdminUser();if(!user)redirect('/admin/login');return user;}
