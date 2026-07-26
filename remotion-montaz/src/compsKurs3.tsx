import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const FIRE = 'linear-gradient(150deg,#FFB13D,#FF4A2D 55%,#E0290F)';
const INK = '#141a24';
const HEAVY = "'Bahnschrift','Arial Black','Segoe UI',sans-serif";
const BODY = "'Inter','Segoe UI',sans-serif";

const CreamBg: React.FC = () => (
  <AbsoluteFill>
    <AbsoluteFill style={{background: 'linear-gradient(165deg,#F5F2EC 0%,#ECE7DE 100%)'}} />
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(900px 700px at 14% 90%, rgba(255,74,45,.14) 0%, transparent 58%),' +
          'radial-gradient(820px 640px at 88% 8%, rgba(56,182,216,.12) 0%, transparent 60%)',
      }}
    />
    <svg width="0" height="0">
      <filter id="grainK3"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} /><feColorMatrix type="saturate" values="0" /></filter>
    </svg>
    <AbsoluteFill style={{filter: 'url(#grainK3)', opacity: 0.05, mixBlendMode: 'multiply'}} />
  </AbsoluteFill>
);

const Kicker: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const y = interpolate(frame, [0, 12], [-24, 0], {extrapolateRight: 'clamp'});
  return (
    <div style={{display: 'inline-block', fontFamily: HEAVY, fontWeight: 700, fontSize: 24, letterSpacing: 6, color: '#FF4A2D', padding: '10px 24px', border: '1.5px solid rgba(255,74,45,.4)', borderRadius: 999, marginBottom: 26, opacity: op, transform: `translateY(${y}px)`}}>
      {children}
    </div>
  );
};

// ---------- KARTA: przepływ Surowe pliki -> AI -> Twój styl ----------
export const FlowCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = [
    {icon: '📁', title: 'Surowe pliki', sub: 'wrzucasz nagrania', at: 8},
    {icon: '🤖', title: 'AI montuje', sub: 'robi całą robotę', at: 40},
    {icon: '🎨', title: 'Twój styl', sub: 'uczysz go raz', at: 72},
  ];
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center'}}>
        <Kicker>JAK TO DZIAŁA</Kicker>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 40, marginTop: 20}}>
          {steps.map((st, i) => {
            const s = spring({frame: frame - st.at, fps, config: {damping: 14, mass: 0.8, stiffness: 110}});
            const y = interpolate(s, [0, 1], [50, 0]);
            const arrowOp = interpolate(frame - st.at, [-14, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 70, color: '#FF4A2D', marginTop: 40, opacity: arrowOp}}>→</div>
                )}
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, width: 300, opacity: s, transform: `translateY(${y}px)`}}>
                  <div style={{width: 150, height: 150, borderRadius: 40, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 74, boxShadow: '0 26px 60px rgba(255,74,45,.32), inset 0 2px 3px rgba(255,255,255,.4)'}}>{st.icon}</div>
                  <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 40, color: INK, letterSpacing: -1}}>{st.title}</div>
                  <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 25, color: '#6b7280'}}>{st.sub}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- KARTA: przykładowe komendy stylu ----------
export const StyleCommandsCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cmds = ['zmień napisy', 'inny kolor', 'więcej efektów', 'inny hook', 'zmień muzykę'];
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center'}}>
        <Kicker>POWIEDZ MU, CZEGO CHCESZ</Kicker>
        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 22, maxWidth: 1300, marginTop: 14}}>
          {cmds.map((c, i) => {
            const at = 10 + i * 14;
            const s = spring({frame: frame - at, fps, config: {damping: 13, mass: 0.7, stiffness: 120}});
            const y = interpolate(s, [0, 1], [30, 0]);
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: '2px solid rgba(255,74,45,.35)', borderRadius: 18, padding: '20px 34px', boxShadow: '0 16px 40px rgba(0,0,0,.08)', opacity: s, transform: `translateY(${y}px) scale(${s})`}}>
                <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 34, color: '#FF4A2D'}}>„</span>
                <span style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 40, color: INK}}>{c}</span>
              </div>
            );
          })}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 30, color: '#6b7280', marginTop: 40}}>
          on to zrobi i zapamięta na stałe
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- KARTA: payoff nagranie -> 4 min -> gotowe ----------
export const FastCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = [
    {t: 'Wrzucasz nagranie.', at: 6, fire: false},
    {t: 'Czekasz 4 minuty.', at: 30, fire: false},
    {t: 'Masz gotowy film.', at: 54, fire: true},
  ];
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center'}}>
        {lines.map((l, i) => {
          const s = spring({frame: frame - l.at, fps, config: {damping: 15, mass: 0.8, stiffness: 110}});
          const y = interpolate(s, [0, 1], [40, 0]);
          return (
            <div
              key={i}
              style={{
                fontFamily: HEAVY,
                fontWeight: 900,
                fontSize: 92,
                letterSpacing: -2,
                lineHeight: 1.15,
                color: l.fire ? undefined : INK,
                opacity: s,
                transform: `translateY(${y}px)`,
                ...(l.fire ? {background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'} : {}),
              }}
            >
              {l.t}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------- KARTA: tip zrzut ekranu ----------
export const ScreenshotTipCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - 8, fps, config: {damping: 15, mass: 0.8, stiffness: 100}});
  const y = interpolate(s, [0, 1], [40, 0]);
  const op = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const badge = spring({frame: frame - 6, fps, config: {damping: 13, mass: 0.7, stiffness: 120}});
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center'}}>
        <Kicker>COŚ SIĘ NIE PODOBA?</Kicker>
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: 22, transform: `scale(${badge})`}}>
          <div style={{width: 150, height: 150, borderRadius: 40, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 76, boxShadow: '0 26px 60px rgba(255,74,45,.32), inset 0 2px 3px rgba(255,255,255,.4)'}}>📸</div>
        </div>
        <div style={{opacity: op, transform: `translateY(${y}px)`}}>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 78, color: INK, letterSpacing: -2, lineHeight: 1.05}}>
            Zrzut ekranu <span style={{background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>→ wyślij AI</span>
          </div>
          <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 32, color: '#6b7280', marginTop: 16}}>
            jedno polecenie i poprawione
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- KARTA: zapytaj Claude o błąd ----------
export const AskClaudeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bub = spring({frame: frame - 10, fps, config: {damping: 14, mass: 0.8, stiffness: 110}});
  const by = interpolate(bub, [0, 1], [40, 0]);
  const rep = spring({frame: frame - 40, fps, config: {damping: 14, mass: 0.8, stiffness: 110}});
  const ry = interpolate(rep, [0, 1], [30, 0]);
  return (
    <AbsoluteFill style={{fontFamily: BODY, alignItems: 'center', justifyContent: 'center'}}>
      <CreamBg />
      <div style={{textAlign: 'center', width: 1200}}>
        <Kicker>COŚ NIE DZIAŁA?</Kicker>
        {/* dymek uzytkownika */}
        <div style={{display: 'flex', justifyContent: 'center', opacity: bub, transform: `translateY(${by}px)`}}>
          <div style={{maxWidth: 900, background: FIRE, color: '#fff', borderRadius: '28px 28px 8px 28px', padding: '28px 40px', boxShadow: '0 20px 50px rgba(255,74,45,.32)'}}>
            <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 46, lineHeight: 1.15}}>Napotkałem błąd, jak to naprawić?</div>
          </div>
        </div>
        {/* odpowiedz AI */}
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 22, opacity: rep, transform: `translateY(${ry}px)`}}>
          <div style={{maxWidth: 760, background: '#fff', color: INK, border: '2px solid rgba(0,0,0,.06)', borderRadius: '28px 28px 28px 8px', padding: '24px 36px', boxShadow: '0 16px 40px rgba(0,0,0,.1)'}}>
            <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 34, color: '#6b7280'}}>Jasne, już to ogarniam...</div>
          </div>
        </div>
        <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 30, color: '#6b7280', marginTop: 34}}>
          po prostu napisz do AI, pomoże Ci ze wszystkim
        </div>
      </div>
    </AbsoluteFill>
  );
};
