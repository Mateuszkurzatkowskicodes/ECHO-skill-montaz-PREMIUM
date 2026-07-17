import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, random} from 'remotion';

const ORANGE = '#FF4D2D';
const GREEN = '#5CCB6A';
const RED = '#F03B3B';
const COLD = '#5AB0FF';
const WARM = '#FFB13D';
const SANS = "Montserrat, 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

const useSp = (d: number, damping = 12, stiffness = 130) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - d, fps, config: {damping, stiffness, mass: 0.9}});
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 37) % 100;
  const y = (frame * 61) % 100;
  return (
    <AbsoluteFill style={{opacity: 0.05, backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 1px)', backgroundSize: '7px 7px, 11px 11px', backgroundPosition: `${x}px ${y}px, ${-y}px ${x}px`}} />
  );
};

const ColdBg: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 50;
  return (
    <AbsoluteFill style={{backgroundColor: '#070d16'}}>
      <AbsoluteFill style={{background: `radial-gradient(1000px 1000px at ${300 + drift}px ${500}px, ${COLD}22 0%, transparent 68%), radial-gradient(800px 800px at ${800 - drift}px ${1500}px, #2d6dff18 0%, transparent 70%)`}} />
      {/* falling snow */}
      {Array.from({length: 40}).map((_, i) => {
        const sx = random(`sx${i}`) * 1080;
        const speed = 40 + random(`sp${i}`) * 90;
        const sy = ((frame * speed) / 60 + random(`so${i}`) * 1920) % 2000 - 40;
        const sz = 3 + random(`sz${i}`) * 6;
        const sway = Math.sin((frame / 30) + i) * 18;
        return <div key={i} style={{position: 'absolute', left: sx + sway, top: sy, width: sz, height: sz, borderRadius: sz, backgroundColor: '#dbeeff', opacity: 0.5}} />;
      })}
      <Grain />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 340px 120px rgba(0,0,0,0.82)'}} />
    </AbsoluteFill>
  );
};

const WarmBg: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 0.25;
  return (
    <AbsoluteFill style={{backgroundColor: '#140d05'}}>
      <AbsoluteFill style={{background: `radial-gradient(1100px 1100px at 540px 560px, ${WARM}26 0%, transparent 62%), radial-gradient(700px 700px at 850px 1500px, ${ORANGE}14 0%, transparent 70%)`}} />
      {/* sun rays */}
      <div style={{position: 'absolute', left: 540, top: 560, width: 0, height: 0, transform: `rotate(${rot}deg)`}}>
        {Array.from({length: 12}).map((_, i) => (
          <div key={i} style={{position: 'absolute', width: 6, height: 900, background: `linear-gradient(${WARM}22, transparent)`, transformOrigin: 'top center', transform: `rotate(${i * 30}deg)`, left: -3, top: 0}} />
        ))}
      </div>
      <Grain />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 340px 120px rgba(0,0,0,0.8)'}} />
    </AbsoluteFill>
  );
};

const Burst: React.FC<{t0: number; cx: number; cy: number; color: string}> = ({t0, cx, cy, color}) => {
  const frame = useCurrentFrame();
  const local = frame - t0;
  if (local < 0 || local > 26) return null;
  const p = local / 26;
  return (
    <>
      {Array.from({length: 10}).map((_, i) => {
        const ang = (i / 10) * Math.PI * 2 + 0.4;
        const dist = 40 + p * 190;
        const size = 13 * (1 - p);
        return <div key={i} style={{position: 'absolute', left: cx + Math.cos(ang) * dist, top: cy + Math.sin(ang) * dist * 0.75, width: size, height: size, borderRadius: size, backgroundColor: color, opacity: 1 - p}} />;
      })}
    </>
  );
};

// ---------- HOOK 3: REKLAMA PIECA -> NIE ZIMĄ -> TYLKO TERAZ ----------

export const Hook3: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w1Out = Math.round(1.62 * fps);
  const w2Out = Math.round(2.28 * fps);
  const s1 = useSp(0, 11, 190);
  const s2 = useSp(w1Out, 11, 190);
  const s3 = useSp(w2Out, 11, 190);
  const strikeP = interpolate(frame - w1Out - 12, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const base: React.CSSProperties = {position: 'absolute', width: '100%', top: 1080, textAlign: 'center', fontFamily: SANS, fontWeight: 900, letterSpacing: 2};
  return (
    <AbsoluteFill>
      {frame < w1Out && (
        <>
          <div style={{...base, fontSize: 104, color: '#fff', transform: `scale(${0.4 + s1 * 0.6}) rotate(${(1 - s1) * -6}deg)`, textShadow: '0 6px 0 #1c2735, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s1 * 2)}}>REKLAMA&nbsp;PIECA</div>
          <Burst t0={2} cx={540} cy={1140} color={ORANGE} />
        </>
      )}
      {frame >= w1Out && frame < w2Out && (
        <div style={{...base, fontSize: 118, color: COLD, transform: `scale(${0.4 + s2 * 0.6})`, textShadow: '0 6px 0 #0a2540, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s2 * 2)}}>
          <span style={{position: 'relative', display: 'inline-block'}}>
            NIE&nbsp;ZIMĄ&nbsp;❄️
            <span style={{position: 'absolute', left: '-3%', top: '48%', width: `${strikeP * 90}%`, height: 12, borderRadius: 8, backgroundColor: RED, boxShadow: '0 0 18px #F03B3Baa'}} />
          </span>
        </div>
      )}
      {frame >= w2Out && (
        <>
          <div style={{...base, fontSize: 122, color: WARM, transform: `scale(${0.4 + s3 * 0.6}) rotate(${(1 - s3) * 5}deg)`, textShadow: '0 6px 0 #3a2405, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s3 * 2)}}>TYLKO&nbsp;TERAZ&nbsp;☀️</div>
          <Burst t0={w2Out + 2} cx={540} cy={1140} color={WARM} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- list item ----------
const Item: React.FC<{delay: number; y: number; icon: string; text: string; mark: 'x' | 'v'; color: string}> = ({delay, y, icon, text, mark, color}) => {
  const s = useSp(delay, 13, 120);
  const frame = useCurrentFrame();
  const markP = interpolate(frame - delay - 12, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', top: y, left: 90, width: 900, display: 'flex', alignItems: 'center', gap: 26, transform: `translateX(${(1 - s) * -600}px)`, opacity: Math.min(1, s * 1.6)}}>
      <span style={{fontSize: 60}}>{icon}</span>
      <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: '#fff', flexGrow: 1, textShadow: '0 6px 24px rgba(0,0,0,0.7)'}}>{text}</span>
      <svg width={70} height={70} viewBox="0 0 70 70" style={{flexShrink: 0}}>
        {mark === 'x' ? (
          <>
            <path d="M 20 20 L 50 50" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={45} strokeDashoffset={45 * (1 - markP)} />
            <path d="M 50 20 L 20 50" stroke={color} strokeWidth={9} strokeLinecap="round" strokeDasharray={45} strokeDashoffset={45 * (1 - Math.max(0, markP * 2 - 1))} />
          </>
        ) : (
          <path d="M 18 38 L 32 52 L 54 22" stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={70} strokeDashoffset={70 * (1 - markP)} />
        )}
      </svg>
    </div>
  );
};

// ---------- WINTER PANEL (cons) ----------

export const WinterPanel: React.FC = () => {
  const sT = useSp(6, 12, 150);
  return (
    <AbsoluteFill>
      <ColdBg />
      <div style={{position: 'absolute', top: 360, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 130, color: COLD, letterSpacing: 4, transform: `scale(${0.6 + sT * 0.4})`, opacity: Math.min(1, sT * 2), textShadow: `0 0 50px ${COLD}66`}}>ZIMA ❄️</div>
      <Item delay={28} y={640} icon="👥" text="Tłum konkurencji" mark="x" color={RED} />
      <Item delay={62} y={820} icon="📞" text="Klient dzwoni do 5 firm" mark="x" color={RED} />
      <Item delay={96} y={1000} icon="💸" text="Wygrywa najtańszy" mark="x" color={RED} />
    </AbsoluteFill>
  );
};

// ---------- VS SPLIT (pivot) ----------

export const VsSplit: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sL = useSp(4, 13, 130);
  const sR = useSp(16, 13, 130);
  const sVs = useSp(30, 9, 200);
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  return (
    <AbsoluteFill style={{backgroundColor: '#05080d'}}>
      {/* left cold */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateX(${(1 - sL) * -540}px)`}}>
        <AbsoluteFill style={{background: `linear-gradient(160deg, #0a1a2e, #07101c)`}} />
        <AbsoluteFill style={{background: `radial-gradient(500px 500px at 270px 700px, ${COLD}26, transparent 70%)`}} />
        <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', fontSize: 130}}>❄️</div>
        <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 92, color: COLD, letterSpacing: 3}}>ZIMA</div>
        <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, color: '#c7d6e6', lineHeight: 1.4, padding: '0 40px'}}>tłum firm<br/>wojna cen</div>
        <div style={{position: 'absolute', top: 1130, width: '100%', textAlign: 'center', fontSize: 90, color: RED}}>✗</div>
      </div>
      {/* right warm */}
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateX(${(1 - sR) * 540}px)`}}>
        <AbsoluteFill style={{background: `linear-gradient(160deg, #2a1c08, #17100a)`}} />
        <AbsoluteFill style={{background: `radial-gradient(500px 500px at 270px 700px, ${WARM}2e, transparent 70%)`}} />
        <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', fontSize: 130}}>☀️</div>
        <div style={{position: 'absolute', top: 760, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 92, color: WARM, letterSpacing: 3}}>LATO</div>
        <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, color: '#f0e2cd', lineHeight: 1.4, padding: '0 40px'}}>zero rywali<br/>sensowny klient</div>
        <div style={{position: 'absolute', top: 1130, width: '100%', textAlign: 'center', fontSize: 90, color: GREEN}}>✓</div>
      </div>
      {/* VS badge center */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', transform: `scale(${0.4 + sVs * 0.6})`, opacity: Math.min(1, sVs * 2)}}>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 88, color: '#fff', backgroundColor: '#101722', border: '5px solid #fff', borderRadius: 999, padding: '12px 34px', boxShadow: `0 0 ${20 + pulse * 40}px rgba(255,255,255,0.5)`}}>VS</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA: YouTube / link w bio ----------

export const CtaYoutube: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(6, 13, 120);
  const arrowB = Math.sin(frame / 8) * 12;
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{position: 'absolute', top: 40, transform: `translateY(${arrowB}px) scale(${0.6 + Math.min(1, sCard) * 0.4})`, opacity: Math.min(1, sCard * 1.8)}}>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 58, color: '#fff', letterSpacing: 1, backgroundColor: '#e11', borderRadius: 999, padding: '14px 40px', boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 ${20 + pulse * 30}px rgba(255,0,0,0.5)`, whiteSpace: 'nowrap'}}>
          LINK W BIO ↑
        </span>
      </div>
      <div style={{position: 'absolute', top: 220, width: 900, backgroundColor: '#0f0f0f', borderRadius: 28, padding: '30px 34px', border: '1px solid #2a2a2a', boxShadow: `0 26px 80px rgba(0,0,0,0.6), 0 0 ${30 + pulse * 40}px rgba(255,0,0,0.25)`, transform: `translateY(${(1 - sCard) * 260}px)`, opacity: Math.min(1, sCard * 1.8), display: 'flex', alignItems: 'center', gap: 24}}>
        <div style={{width: 96, height: 96, borderRadius: 22, backgroundColor: '#FF0000', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0, boxShadow: `0 0 ${20 + pulse * 24}px rgba(255,0,0,0.5)`}}>
          <svg width={46} height={46} viewBox="0 0 24 24"><path d="M8 5 L19 12 L8 19 Z" fill="#fff" /></svg>
        </div>
        <div style={{flexGrow: 1}}>
          <div style={{fontFamily: SANS, color: '#fff', fontWeight: 900, fontSize: 40}}>Mój YouTube</div>
          <div style={{fontFamily: SANS, color: '#aaa', fontSize: 30, marginTop: 4}}>marketing dla firm grzewczych</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
