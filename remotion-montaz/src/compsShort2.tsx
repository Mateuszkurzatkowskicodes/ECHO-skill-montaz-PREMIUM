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
    <svg width="0" height="0"><filter id="grainS2"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /><feColorMatrix type="saturate" values="0" /></filter></svg>
    <AbsoluteFill style={{filter: 'url(#grainS2)', opacity: 0.05, mixBlendMode: 'multiply'}} />
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

// ZERO ROBOTY (zero ciecia / efektow / pluginow)
export const Pains2Cut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows = [
    {icon: '✂️', label: 'ręcznego cięcia', at: 8},
    {icon: '🎬', label: 'robienia efektów', at: 30},
    {icon: '🧩', label: 'szukania pluginów', at: 52},
  ];
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 300, textAlign: 'center', width: 1080}}>
        <Kicker>ZERO ROBOTY</Kicker>
        <div style={{display: 'flex', flexDirection: 'column', gap: 40, marginTop: 90, alignItems: 'center'}}>
          {rows.map((r, i) => {
            const s = spring({frame: frame - r.at, fps, config: {damping: 13, mass: 0.7, stiffness: 120}});
            const x = interpolate(s, [0, 1], [-120, 0]);
            const strike = interpolate(frame - r.at - 8, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 30, opacity: s, transform: `translateX(${x}px)`, background: '#fff', borderRadius: 28, padding: '26px 42px', boxShadow: '0 18px 46px rgba(0,0,0,.1)'}}>
                <div style={{fontSize: 82}}>{r.icon}</div>
                <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 66, color: INK, position: 'relative'}}>
                  {r.label}
                  <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 8, background: '#e11d1d', borderRadius: 4, transform: `scaleX(${strike})`, transformOrigin: 'left'}} />
                </div>
                <div style={{fontSize: 66, opacity: strike}}>❌</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// RECZNY MONTAZ = strata czasu i pieniedzy
export const TimeMoneyCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const items = [
    {icon: '⏰', big: 'masa czasu', at: 12},
    {icon: '💸', big: 'dużo kasy', at: 40},
  ];
  const tag = spring({frame: frame - 105, fps, config: {damping: 14, stiffness: 110}});
  const tagY = interpolate(tag, [0, 1], [30, 0]);
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 280, textAlign: 'center', width: 1080}}>
        <Kicker>RĘCZNIE = STRATA</Kicker>
        <div style={{display: 'flex', justifyContent: 'center', gap: 40, marginTop: 90}}>
          {items.map((it, i) => {
            const s = spring({frame: frame - it.at, fps, config: {damping: 13, stiffness: 120}});
            const y = interpolate(s, [0, 1], [50, 0]);
            return (
              <div key={i} style={{width: 430, background: '#fff', borderRadius: 34, padding: '40px 20px', boxShadow: '0 20px 50px rgba(0,0,0,.1)', opacity: s, transform: `translateY(${y}px)`, border: '2px solid rgba(225,29,29,.25)'}}>
                <div style={{fontSize: 130}}>{it.icon}</div>
                <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 60, color: '#c81e1e', marginTop: 10}}>{it.big}</div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 60, opacity: tag, transform: `translateY(${tagY}px)`, fontFamily: HEAVY, fontWeight: 900, fontSize: 74, color: INK, letterSpacing: -1}}>
          z AI: <span style={{background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>lepiej i szybciej</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
