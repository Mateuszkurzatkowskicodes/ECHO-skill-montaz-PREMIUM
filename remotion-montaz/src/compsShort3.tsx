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
    <svg width="0" height="0"><filter id="grainS3"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /><feColorMatrix type="saturate" values="0" /></filter></svg>
    <AbsoluteFill style={{filter: 'url(#grainS3)', opacity: 0.05, mixBlendMode: 'multiply'}} />
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

// KLATKA PO KLATCE = STRATA CZASU
export const StrataCzasuCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const badge = spring({frame: frame - 6, fps, config: {damping: 13, stiffness: 120}});
  const l1 = spring({frame: frame - 16, fps, config: {damping: 15, stiffness: 100}});
  const l2 = spring({frame: frame - 40, fps, config: {damping: 13, stiffness: 120}});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 330, textAlign: 'center', width: 1080}}>
        <Kicker>PRAWDA JEST TAKA</Kicker>
        <div style={{marginTop: 70, display: 'flex', justifyContent: 'center', transform: `scale(${badge})`}}>
          <div style={{width: 210, height: 210, borderRadius: 52, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, boxShadow: '0 26px 60px rgba(255,74,45,.32)'}}>⏰</div>
        </div>
        <div style={{marginTop: 50, opacity: l1, transform: `translateY(${interpolate(l1,[0,1],[40,0])}px)`, fontFamily: HEAVY, fontWeight: 900, fontSize: 86, color: INK, letterSpacing: -2}}>Klatka po klatce</div>
        <div style={{marginTop: 8, opacity: l2, transform: `scale(${l2})`, fontFamily: HEAVY, fontWeight: 900, fontSize: 104, letterSpacing: -2, background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>= STRATA CZASU</div>
      </div>
    </AbsoluteFill>
  );
};

// WRZUCASZ NAGRANIA -> AI ROBI RESZTE
export const FolderCut: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = [
    {icon: '📁', title: 'Wrzucasz nagrania', sub: 'do folderu', at: 8},
    {icon: '🤖', title: 'AI robi resztę', sub: 'napisy, cięcia, muzyka', at: 44},
  ];
  const arrow = interpolate(frame - 30, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center'}}>
      <CreamBg />
      <div style={{marginTop: 300, textAlign: 'center', width: 1080}}>
        <Kicker>CAŁA TWOJA ROBOTA</Kicker>
        <div style={{display: 'flex', flexDirection: 'column', gap: 28, marginTop: 80, alignItems: 'center'}}>
          {steps.map((st, i) => {
            const s = spring({frame: frame - st.at, fps, config: {damping: 14, mass: 0.8, stiffness: 110}});
            const y = interpolate(s, [0, 1], [50, 0]);
            return (
              <React.Fragment key={i}>
                {i === 1 && <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 80, color: '#FF4A2D', opacity: arrow, transform: `rotate(90deg) scaleX(${arrow})`}}>→</div>}
                <div style={{display: 'flex', alignItems: 'center', gap: 34, opacity: s, transform: `translateY(${y}px)`, background: '#fff', borderRadius: 30, padding: '30px 46px', boxShadow: '0 18px 46px rgba(0,0,0,.1)'}}>
                  <div style={{width: 150, height: 150, borderRadius: 38, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 84}}>{st.icon}</div>
                  <div style={{textAlign: 'left'}}>
                    <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 58, color: INK}}>{st.title}</div>
                    <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 34, color: '#6b7280', marginTop: 4}}>{st.sub}</div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
