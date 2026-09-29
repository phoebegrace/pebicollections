import bwipjs from 'bwip-js';

export function makeSku(group: string, era: string, member: string, sequence = 1) {
  const clean = (value: string, len: number) => value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, len);
  const eraCode = era.trim().split(/\s+/).filter(Boolean).map(part => part[0]).join('').toUpperCase().slice(0, 3) || clean(era, 2);
  return `PEBI-PC-${eraCode}-${clean(member,3)}-${String(sequence).padStart(3,'0')}`;
}

export async function barcodePng(value: string): Promise<Buffer> {
  return bwipjs.toBuffer({ bcid: 'code128', text: value, scale: 3, height: 10, includetext: true, textxalign: 'center', backgroundcolor: 'FFFFFF' });
}
