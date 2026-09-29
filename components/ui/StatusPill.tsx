import type { ProductStatus } from '@/types';
export function StatusPill({ status }: { status: ProductStatus }) { return <span className={`status-pill status-${status}`}>{status}</span>; }
