import Link from 'next/link';
const tiles=[['Photocards','/photocards','binder pocket','PC'],['Albums','/albums','shelf archive','AL'],['Bundles','/bundles','little sets','BD'],['Sold archive','/sold','new shelves found','SD']];
export function CategoryTiles(){return <div className="category-grid">{tiles.map(([name,href,copy,mark])=><Link href={href} key={href} className="category-tile"><span className="category-mark">{mark}</span><div><small>{copy}</small><h3>{name}</h3></div><span className="tile-arrow">↗</span></Link>)}</div>}
