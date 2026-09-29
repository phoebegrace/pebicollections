import { env } from '@/lib/config/env';import { fireWebhook, type OrderEventName } from '@/lib/integrations/webhooks';
export function sendTransactionalEvent(event:OrderEventName,payload:unknown){return fireWebhook(env.emailWebhookUrl,event,payload)}
