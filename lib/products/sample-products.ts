import type { Product } from '@/types';

const back = '/assets/images/products/photocards/hot mess/hotmess b_cover.jpg';
const now = '2026-09-29T00:00:00.000Z';

export const sampleProducts: Product[] = [
  ['giselle-hot-mess-poster','PEBI-PC-HM-GIS-001','Giselle Poster Photocard','Giselle','/assets/images/products/photocards/hot mess/giselle poster.png'],
  ['karina-hot-mess-support-shop','PEBI-PC-HM-KAR-001','Karina Support Shop Photocard','Karina','/assets/images/products/photocards/hot mess/karina support shop.png'],
  ['ningning-hot-mess-poster','PEBI-PC-HM-NIN-001','Ningning Poster Photocard','Ningning','/assets/images/products/photocards/hot mess/ningning poster.png'],
  ['winter-hot-mess-poster','PEBI-PC-HM-WIN-001','Winter Poster Photocard','Winter','/assets/images/products/photocards/hot mess/winter poster.png']
].map(([slug, sku, title, member, front], i) => ({
  id: `sample-${i+1}`, slug, sku, barcode: sku, title, group_name:'aespa', member_name:member,
  era:'Hot Mess', collection_name:'Hot Mess', category:'photocards', subcategory:'photocard', price:null,
  original_price:null, condition:'Like new', sealed:false, is_pob:false, is_vce:false,
  description:'From my personal collection.', front_image:front, back_image:back, quantity:1,
  status:'available', featured:i<2, new_arrival:true, created_at:now, updated_at:now
}));
