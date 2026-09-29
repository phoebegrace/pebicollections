import { expect,it } from 'vitest';import { addProduct,basketCount,basketSubtotal,removeProduct } from '@/lib/basket/store';import { sampleProducts } from '@/lib/products/sample-products';
it('adds each available one-of-one product once',()=>{let items=addProduct([],sampleProducts[0]);items=addProduct(items,sampleProducts[0]);expect(basketCount(items)).toBe(1);expect(removeProduct(items,sampleProducts[0].id)).toEqual([])});
it('treats unknown prices as zero subtotal until pricing is set',()=>{expect(basketSubtotal(addProduct([],sampleProducts[0]))).toBe(0)});
