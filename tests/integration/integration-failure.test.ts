import { expect,it,vi } from 'vitest';import { fireWebhook } from '@/lib/integrations/webhooks';
it('turns integration network failure into a non-throwing result',async()=>{vi.stubGlobal('fetch',vi.fn().mockRejectedValue(new Error('offline')));await expect(fireWebhook('https://example.invalid','claim.created',{order:'PEBI-1'})).resolves.toEqual({ok:false});vi.unstubAllGlobals()});
