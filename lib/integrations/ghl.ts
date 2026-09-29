import { env } from '@/lib/config/env';import { fireWebhook, type OrderEventName } from './webhooks';
export function sendToGhl(event:OrderEventName,payload:unknown){return fireWebhook(env.ghlWebhookUrl,event,payload)}
