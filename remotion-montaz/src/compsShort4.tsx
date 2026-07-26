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
    <svg width="0" height="0"><filter id="grainS4"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /><feColorMatrix type="saturate" values="0" /></filter></svg>
    <AbsoluteFill style={{filter: 'url(#grainS4)', opacity: 0.05, mixBlendMode: 'multiply'}} />
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

// 4 MINUTY i gotowe
export const FourMinCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const num = spring({frame: frame - 12, fps, config: {damping: 12, stiffness: 130}});
  const sub = spring({frame: frame - 40, fps, config: {damping: 14, stiffness: 110}});
  const bolt = 1 + 0.06 * Math.sin(frame / 8);
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 340, textAlign: 'center', width: 1080}}>
        <Kicker>NAGRYWASZ → WYSYŁASZ</Kicker>
        <div style={{marginTop: 60, fontSize: 150, transform: `scale(${bolt})`}}>⚡</div>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 20, marginTop: 10, transform: `scale(${num})`, opacity: num}}>
          <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 260, letterSpacing: -8, lineHeight: 1, background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>4</span>
          <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 120, color: INK}}>MIN</span>
        </div>
        <div style={{marginTop: 20, opacity: sub, transform: `translateY(${interpolate(sub,[0,1],[30,0])}px)`, fontFamily: HEAVY, fontWeight: 800, fontSize: 62, color: INK}}>i masz gotowy materiał</div>
      </div>
    </AbsoluteFill>
  );
};

// SEKRET: narzedzia + umiejetnosci
export const ToolsSkillsCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [{i: '🛠️', t: 'narzędzia', at: 10}, {i: '🧠', t: 'umiejętności', at: 34}];
  const plus = spring({frame: frame - 24, fps, config: {damping: 12, stiffness: 130}});
  const tag = spring({frame: frame - 70, fps, config: {damping: 14, stiffness: 110}});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 320, textAlign: 'center', width: 1080}}>
        <Kicker>SEKRET AI</Kicker>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 44, marginTop: 80}}>
          {items.map((it, i) => {
            const s = spring({frame: frame - it.at, fps, config: {damping: 13, stiffness: 120}});
            const y = interpolate(s, [0, 1], [50, 0]);
            return (
              <React.Fragment key={i}>
                {i === 1 && <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 90, color: '#FF4A2D', transform: `scale(${plus})`, marginBottom: 60}}>+</div>}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, opacity: s, transform: `translateY(${y}px)`}}>
                  <div style={{width: 200, height: 200, borderRadius: 50, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 104, boxShadow: '0 24px 56px rgba(255,74,45,.32)'}}>{it.i}</div>
                  <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 52, color: INK}}>{it.t}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <div style={{marginTop: 70, opacity: tag, transform: `translateY(${interpolate(tag,[0,1],[30,0])}px)`, fontFamily: HEAVY, fontWeight: 900, fontSize: 76, letterSpacing: -1}}>
          = <span style={{background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>takie cuda</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// JA vs TY (godziny vs pare minut)
export const JaTyCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ja = spring({frame: frame - 10, fps, config: {damping: 14, stiffness: 110}});
  const ty = spring({frame: frame - 44, fps, config: {damping: 13, stiffness: 120}});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 340, textAlign: 'center', width: 1080}}>
        <Kicker>SKRÓT NA PÓŹNIEJ</Kicker>
        <div style={{display: 'flex', flexDirection: 'column', gap: 34, marginTop: 90, alignItems: 'center'}}>
          <div style={{width: 760, background: '#fff', borderRadius: 30, padding: '30px 40px', boxShadow: '0 18px 46px rgba(0,0,0,.1)', border: '2px solid rgba(225,29,29,.25)', opacity: ja, transform: `translateY(${interpolate(ja,[0,1],[40,0])}px)`}}>
            <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 46, color: '#c81e1e'}}>JA: godziny prób i błędów ⏳</div>
          </div>
          <div style={{width: 760, background: '#fff', borderRadius: 30, padding: '30px 40px', boxShadow: '0 22px 54px rgba(255,74,45,.28)', border: '2px solid rgba(255,74,45,.4)', opacity: ty, transform: `translateY(${interpolate(ty,[0,1],[40,0])}px) scale(${interpolate(ty,[0,1],[0.9,1])})`}}>
            <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 52, background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>TY: parę minut ⚡</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
