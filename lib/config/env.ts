export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  adminEmails: (process.env.ADMIN_EMAILS ?? '').split(',').map(v => v.trim().toLowerCase()).filter(Boolean),
  ghlWebhookUrl: process.env.GHL_WEBHOOK_URL ?? '',
  emailWebhookUrl: process.env.EMAIL_WEBHOOK_URL ?? ''
};

export const hasSupabase = Boolean(env.supabaseUrl && env.supabaseAnonKey);
