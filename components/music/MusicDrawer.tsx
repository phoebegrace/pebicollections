'use client';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
const tracks={ aespa:'https://open.spotify.com/embed/track/3Fse9qXqMNey4TL5mLy8IF?utm_source=generator&si=d59249aada78479a', blackpink:'https://open.spotify.com/embed/track/1cdbkpZ3q1KYZDNSrOpdkb?utm_source=generator&si=b5d20ddc71994cfe' };
export function MusicDrawer(){
 const pathname=usePathname(); const [open,setOpen]=useState(false); const [artist,setArtist]=useState<'aespa'|'blackpink'>(pathname.toLowerCase().includes('blackpink')?'blackpink':'aespa');
 return <aside className={`music-drawer ${open?'is-open':''}`}><button className="music-toggle" onClick={()=>setOpen(v=>!v)} aria-expanded={open}>music <span>{open?'−':'+'}</span></button>{open&&<div className="music-panel"><div className="music-tabs"><button className={artist==='aespa'?'active':''} onClick={()=>setArtist('aespa')}>aespa</button><button className={artist==='blackpink'?'active':''} onClick={()=>setArtist('blackpink')}>BLACKPINK</button></div><iframe data-testid="embed-iframe" src={tracks[artist]} width="100%" height="152" allowFullScreen allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title={`${artist} Spotify track`}/><p>Tap play when you want the soundtrack. Browsers may block automatic audio.</p></div>}</aside>;
}
