import { expect,it } from 'vitest';
import { ClaimSchema } from '@/lib/orders/create-claim';

it('requires first name, a valid email and one username for the selected platform',()=>{
  expect(ClaimSchema.safeParse({firstName:'',email:'nope',socialHandle:'',preferredContactPlatform:'instagram',marketingOptIn:false,items:[{product_id:'x',quantity:1}]}).success).toBe(false);
});

it('accepts one username without duplicate Instagram and TikTok fields',()=>{
  expect(ClaimSchema.safeParse({firstName:'Phoebe',email:'buyer@example.com',socialHandle:'@buyer',preferredContactPlatform:'tiktok',marketingOptIn:true,items:[{product_id:'x',quantity:1}]}).success).toBe(true);
});
