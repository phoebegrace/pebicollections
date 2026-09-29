'use client';
export default function Error({reset}:{reset:()=>void}){return <div className="shell error-screen"><div className="eyebrow">little snag</div><h1>this page slipped out of the binder.</h1><p>Try loading it one more time.</p><button className="button button-primary" onClick={reset}>try again</button></div>}
