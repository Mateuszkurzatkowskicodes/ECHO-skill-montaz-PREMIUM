import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const FIRE = 'linear-gradient(150deg,#FFB13D,#FF4A2D 55%,#E0290F)';
const HEAVY = "'Bahnschrift','Arial Black','Segoe UI',sans-serif";
const BODY = "'Inter','Segoe UI',sans-serif";

const DarkBg: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(140deg,#12161f 0%,#0b0e14 55%,#161b26 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(700px 520px at 78% 52%, rgba(255,74,45,.34) 0%, transparent 62%),radial-gradient(620px 480px at 8% 88%, rgba(255,140,60,.16) 0%, transparent 60%)'}} />
    {/* delikatna siatka */}
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)', backgroundSize: '54px 54px', opacity: 0.5}} />
  </AbsoluteFill>
);

// zdjecie po prawej, wtopione w tlo maska
const Face: React.FC<{src: string; scale?: number; x?: number; y?: number}> = ({src, scale = 1, x = 0, y = 0}) => (
  <div
    style={{
      position: 'absolute',
      right: -40 + x,
      bottom: -30 + y,
      width: 760,
      height: 760,
      WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 52%, rgba(0,0,0,0) 100%), linear-gradient(to top, rgba(0,0,0,1) 78%, rgba(0,0,0,0) 100%)',
      WebkitMaskComposite: 'source-in',
      maskComposite: 'intersect',
      transform: `scale(${scale})`,
      transformOrigin: 'bottom right',
    }}
  >
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.08) saturate(1.06) brightness(1.03)'}} />
  </div>
);

const Glow: React.FC = () => (
  <div style={{position: 'absolute', right: 130, bottom: 40, width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,120,60,.38) 0%, transparent 66%)', filter: 'blur(10px)'}} />
);

const EchoMark: React.FC = () => (
  <div style={{position: 'absolute', left: 54, bottom: 42, display: 'flex', alignItems: 'center', gap: 14}}>
    <div style={{display: 'flex', flexDirection: 'column', gap: 5}}>
      <div style={{width: 46, height: 11, borderRadius: 6, background: FIRE}} />
      <div style={{width: 30, height: 11, borderRadius: 6, background: FIRE, opacity: 0.85}} />
      <div style={{width: 46, height: 11, borderRadius: 6, background: FIRE, opacity: 0.7}} />
    </div>
    <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 40, color: '#fff', letterSpacing: -1}}>echo</div>
  </div>
);

const Badge: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{display: 'inline-block', background: FIRE, color: '#fff', fontFamily: HEAVY, fontWeight: 900, fontSize: 44, padding: '14px 30px', borderRadius: 16, boxShadow: '0 18px 44px rgba(255,74,45,.5)', transform: 'rotate(-2deg)'}}>
    {children}
  </div>
);

const Wrap: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{fontFamily: BODY, overflow: 'hidden'}}>
    <DarkBg />
    <Glow />
    {children}
  </AbsoluteFill>
);

const TXT: React.CSSProperties = {fontFamily: HEAVY, fontWeight: 900, letterSpacing: -2, lineHeight: 0.98, color: '#fff', textShadow: '0 8px 30px rgba(0,0,0,.55)'};
const FIRETXT: React.CSSProperties = {...TXT, background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none'};

// A: AI ZMONTUJE TWOJE ROLKI
export const ThumbA: React.FC = () => (
  <Wrap>
    <Face src="face_85.png" scale={1.05} />
    <div style={{position: 'absolute', left: 54, top: 96, width: 720}}>
      <div style={{...TXT, fontSize: 96}}>AI ZMONTUJE</div>
      <div style={{...FIRETXT, fontSize: 116, marginTop: 4}}>TWOJE ROLKI</div>
      <div style={{marginTop: 34}}>
        <Badge>w 4 MINUTY</Badge>
      </div>
    </div>
    <EchoMark />
  </Wrap>
);

// B: 4 MIN zamiast 4 GODZIN
export const ThumbB: React.FC = () => (
  <Wrap>
    <Face src="face_85.png" scale={1.05} />
    <div style={{position: 'absolute', left: 54, top: 92, width: 730}}>
      <div style={{...TXT, fontSize: 62, opacity: 0.9}}>MONTAŻ ROLKI</div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 8}}>
        <div style={{...FIRETXT, fontSize: 150}}>4 MIN</div>
      </div>
      <div style={{...TXT, fontSize: 58, marginTop: 6, color: '#cbd5e1'}}>
        zamiast <span style={{color: '#ff6b4a', textDecoration: 'line-through'}}>4 godzin</span>
      </div>
      <div style={{marginTop: 26}}>
        <Badge>BEZ MONTAŻYSTY</Badge>
      </div>
    </div>
    <EchoMark />
  </Wrap>
);

// C: NIE MONTUJ WIECEJ
export const ThumbC: React.FC = () => (
  <Wrap>
    <Face src="face_85.png" scale={1.05} />
    <div style={{position: 'absolute', left: 54, top: 110, width: 720}}>
      <div style={{...TXT, fontSize: 104}}>NIE MONTUJ</div>
      <div style={{...FIRETXT, fontSize: 132, marginTop: 2}}>WIĘCEJ</div>
      <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 46, color: '#cbd5e1', marginTop: 22}}>
        AI zrobi to za Ciebie
      </div>
    </div>
    <EchoMark />
  </Wrap>
);
