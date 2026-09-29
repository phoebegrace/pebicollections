import { describe, expect, it } from 'vitest';
import { makeSku } from '@/lib/barcodes';

describe('makeSku',()=>{
  it('builds stable Pebicart photocard SKUs',()=>{expect(makeSku('aespa','Hot Mess','Karina',1)).toBe('PEBI-PC-HM-KAR-001')});
  it('changes with member or sequence',()=>{expect(makeSku('aespa','Hot Mess','Giselle',1)).not.toBe(makeSku('aespa','Hot Mess','Karina',1));expect(makeSku('aespa','Hot Mess','Karina',2)).toContain('002')});
});
