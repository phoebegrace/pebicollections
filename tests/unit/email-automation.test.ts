import { expect,it } from 'vitest';
import { feedbackRequestEmail, marketingSubscribedEmail } from '@/lib/email/templates';
it('builds marketing opt-in email copy with the Pebicart contact address',()=>{const email=marketingSubscribedEmail({email:'buyer@example.com',firstName:'Phoebe'});expect(email.to).toBe('buyer@example.com');expect(email.replyTo).toBe('info@pebicollections.com');expect(email.body).toContain('Phoebe')});
it('builds post-purchase feedback email copy',()=>{const email=feedbackRequestEmail({email:'buyer@example.com',firstName:'Phoebe',orderNumber:'PEBI-0042'});expect(email.subject).toMatch(/order/i);expect(email.body).toContain('PEBI-0042')});
