'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export function PhotocardFlip({ front, back, alt, priority=false }:{front:string;back?:string|null;alt:string;priority?:boolean}){
  const [flipped,setFlipped]=useState(false);
  const [hint,setHint]=useState(true);
  const startX=useRef<number|null>(null);
  useEffect(()=>{ try { if(localStorage.getItem('pebi-flip-seen')) setHint(false); } catch{} },[]);
  const flip=()=>{ setFlipped(v=>!v); setHint(false); try{ localStorage.setItem('pebi-flip-seen','1'); }catch{} };
  return <div className="photocard-stage">
    <button
      type="button"
      className={`photocard ${flipped?'is-flipped':''}`}
      aria-label={`${flipped?'Show front of':'Show back of'} ${alt}`}
      aria-pressed={flipped}
      onClick={flip}
      onTouchStart={e=>{startX.current=e.touches[0]?.clientX ?? null;}}
      onTouchEnd={e=>{const end=e.changedTouches[0]?.clientX; if(startX.current!=null && end!=null && Math.abs(end-startX.current)>45) flip(); startX.current=null;}}
    >
      <span className="photocard-inner">
        <span className="photocard-face photocard-front"><Image src={front} alt={alt} fill sizes="(max-width: 700px) 70vw, 320px" priority={priority}/></span>
        <span className="photocard-face photocard-back">{back ? <Image src={back} alt={`${alt} back`} fill sizes="(max-width: 700px) 70vw, 320px"/> : <span className="generic-card-back">pebi</span>}</span>
      </span>
    </button>
    {hint && <span className="flip-hint">swipe or tap to flip</span>}
  </div>;
}
