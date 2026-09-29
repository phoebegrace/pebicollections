import type { Product } from '@/types';
import { sampleProducts } from './sample-products';
import { hasSupabase } from '@/lib/config/env';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabase) return sampleProducts;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabase) return sampleProducts.find(p => p.slug === slug) ?? null;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data as Product | null;
}
