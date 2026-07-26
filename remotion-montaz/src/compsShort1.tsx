import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const FIRE = 'linear-gradient(150deg,#FFB13D,#FF4A2D 55%,#E0290F)';
const INK = '#141a24';
const HEAVY = "'Bahnschrift','Arial Black','Segoe UI',sans-serif";
const BODY = "'Inter','Segoe UI',sans-serif";

const CreamBg: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(165deg,#F5F2EC 0%,#ECE7DE 100%)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(900px 900px at 15% 88%, rgba(255,74,45,.16) 0%, transparent 60%),radial-gradient(820px 820px at 88% 10%, rgba(56,182,216,.12) 0%, transparent 60%)'}} />
    <svg width="0" height="0"><filter id="grainS"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /><feColorMatrix type="saturate" values="0" /></filter></svg>
    <AbsoluteFill style={{filter: 'url(#grainS)', opacity: 0.05, mixBlendMode: 'multiply'}} />
  </AbsoluteFill>
);

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 12], [-30, 0], {extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'inline-block', fontFamily: HEAVY, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: '#FF4A2D', padding: '14px 34px', border: '2px solid rgba(255,74,45,.45)', borderRadius: 999, opacity: op, transform: `translateY(${y}px)`}}>
      {children}
    </div>
  );
};

// ---- CUTAWAY: koniec z bólami (❌) ----
export const PainsCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows = [
    {icon: '✂️', label: 'ręczne cięcie', at: 10},
    {icon: '🧑‍💻', label: 'montażysta', at: 34},
    {icon: '⏰', label: 'godziny montażu', at: 58},
  ];
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 300, textAlign: 'center', width: 1080}}>
        <Kicker>KONIEC Z TYM</Kicker>
        <div style={{display: 'flex', flexDirection: 'column', gap: 40, marginTop: 90, alignItems: 'center'}}>
          {rows.map((r, i) => {
            const s = spring({frame: frame - r.at, fps, config: {damping: 13, mass: 0.7, stiffness: 120}});
            const x = interpolate(s, [0, 1], [-120, 0]);
            const strike = interpolate(frame - r.at - 8, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 34, opacity: s, transform: `translateX(${x}px)`, background: '#fff', borderRadius: 28, padding: '26px 44px', boxShadow: '0 18px 46px rgba(0,0,0,.1)', position: 'relative'}}>
                <div style={{fontSize: 86}}>{r.icon}</div>
                <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 72, color: INK, position: 'relative'}}>
                  {r.label}
                  <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 8, background: '#e11d1d', borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
                </div>
                <div style={{fontSize: 70, opacity: strike}}>❌</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- CUTAWAY: AI robi wszystko (funkcje) ----
export const FeaturesCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const feats = [{i: '📝', t: 'napisy'}, {i: '🎬', t: 'efekty'}, {i: '🎵', t: 'muzyka'}];
  const allS = spring({frame: frame - 40, fps, config: {damping: 12, stiffness: 130}});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 330, textAlign: 'center', width: 1080}}>
        <Kicker>AI ROBI TO ZA CIEBIE</Kicker>
        <div style={{display: 'flex', justifyContent: 'center', gap: 34, marginTop: 90}}>
          {feats.map((f, i) => {
            const s = spring({frame: frame - (8 + i * 12), fps, config: {damping: 13, stiffness: 120}});
            const y = interpolate(s, [0, 1], [50, 0]);
            return (
              <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: s, transform: `translateY(${y}px)`}}>
                <div style={{width: 190, height: 190, borderRadius: 46, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 96, boxShadow: '0 24px 56px rgba(255,74,45,.32)'}}>{f.i}</div>
                <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 48, color: INK}}>{f.t}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 70, fontFamily: HEAVY, fontWeight: 900, fontSize: 92, letterSpacing: -2, opacity: allS, transform: `scale(${allS})`, background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          WSZYSTKO
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- CUTAWAY: kawa ----
export const CoffeeCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 6, fps, config: {damping: 15, mass: 0.8, stiffness: 100}});
  const y = interpolate(s, [0, 1], [50, 0]);
  const cup = Math.sin(frame / 16) * 10;
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center', transform: `translateY(-120px)`}}>
        <div style={{fontSize: 240, transform: `translateY(${cup}px)`, marginBottom: 20}}>☕</div>
        <div style={{opacity: s, transform: `translateY(${y}px)`}}>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 96, color: INK, letterSpacing: -2}}>Ty pijesz kawę.</div>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 96, letterSpacing: -2, marginTop: 6, background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>AI montuje.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---- CTA koniec ----
export const CtaShort: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 4, fps, config: {damping: 15, mass: 0.8, stiffness: 100}});
  const y = interpolate(s, [0, 1], [50, 0]);
  const arrow = Math.sin(frame / 7) * 18;
  const btn = spring({frame: frame - 18, fps, config: {damping: 12, stiffness: 130}});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center', transform: `translateY(-140px)`}}>
        <div style={{opacity: s, transform: `translateY(${y}px)`}}>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 104, color: INK, letterSpacing: -3, lineHeight: 1.05}}>Chcesz <span style={{background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>tak samo?</span></div>
        </div>
        <div style={{marginTop: 60, opacity: btn, transform: `scale(${btn})`}}>
          <div style={{display: 'inline-block', background: FIRE, color: '#fff', fontFamily: HEAVY, fontWeight: 800, fontSize: 60, padding: '30px 70px', borderRadius: 26, boxShadow: '0 24px 60px rgba(255,74,45,.4)'}}>
            Dowiedz się więcej
          </div>
        </div>
        <div style={{marginTop: 50, fontSize: 150, transform: `translateY(${arrow}px)`}}>👇</div>
      </div>
    </AbsoluteFill>
  );
};
