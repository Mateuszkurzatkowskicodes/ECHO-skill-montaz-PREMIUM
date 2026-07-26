import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing, random} from 'remotion';

const ORANGE = '#FF4D2D';
const GREEN = '#5CCB6A';
const RED = '#F03B3B';
const BLUE = '#5AB0FF';
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
    <AbsoluteFill
      style={{
        opacity: 0.05,
        backgroundImage:
          'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 1px)',
        backgroundSize: '7px 7px, 11px 11px',
        backgroundPosition: `${x}px ${y}px, ${-y}px ${x}px`,
      }}
    />
  );
};

const DarkBg: React.FC<{glow?: string}> = ({glow = ORANGE}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 60;
  return (
    <AbsoluteFill style={{backgroundColor: '#0b0f16'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at ${240 + drift}px ${1500 - drift}px, ${glow}26 0%, transparent 70%), radial-gradient(700px 700px at ${880 - drift}px ${350 + drift}px, #2d4dff1f 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `0px ${(frame * 0.15) % 90}px`,
        }}
      />
      <Grain />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 340px 120px rgba(0,0,0,0.85)'}} />
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
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx + Math.cos(ang) * dist,
              top: cy + Math.sin(ang) * dist * 0.75,
              width: size,
              height: size,
              borderRadius: size,
              backgroundColor: color,
              opacity: 1 - p,
            }}
          />
        );
      })}
    </>
  );
};

// ---------- HOOK 5: SOCIAL MEDIA? -> PO CO? ----------

export const Hook5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w1Out = Math.round(1.15 * fps);
  const s1 = useSp(0, 11, 190);
  const s2 = useSp(w1Out, 11, 190);
  const base: React.CSSProperties = {position: 'absolute', width: '100%', top: 1060, textAlign: 'center', fontFamily: SANS, fontWeight: 900, letterSpacing: 1};
  return (
    <AbsoluteFill>
      {frame < w1Out ? (
        <>
          <div style={{...base, fontSize: 112, color: '#fff', transform: `scale(${0.4 + s1 * 0.6}) rotate(${(1 - s1) * -6}deg)`, textShadow: '0 6px 0 #1c2735, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s1 * 2)}}>
            SOCIAL&nbsp;MEDIA?
          </div>
          <Burst t0={2} cx={540} cy={1130} color={ORANGE} />
        </>
      ) : (
        <>
          <div style={{...base, fontSize: 132, color: ORANGE, transform: `scale(${0.4 + s2 * 0.6}) rotate(${(1 - s2) * 5}deg)`, textShadow: '0 6px 0 #40130a, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s2 * 2)}}>
            PO&nbsp;CO?
          </div>
          <Burst t0={w1Out + 2} cx={540} cy={1130} color={'#ffffff'} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- INTERLUDE STORM: "A JEŚLI COŚ SIĘ STANIE?" ----------

const Row: React.FC<{delay: number; text: string; icon: string; y: number}> = ({delay, text, icon, y}) => {
  const s = useSp(delay, 13, 120);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 28,
        transform: `translateX(${(1 - s) * -700}px)`,
        opacity: Math.min(1, s * 1.6),
      }}
    >
      <span style={{fontSize: 66}}>{icon}</span>
      <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 66, color: '#fff', letterSpacing: 1, textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>{text}</span>
    </div>
  );
};

export const InterludeStorm: React.FC = () => {
  const frame = useCurrentFrame();
  const sTitle = useSp(4, 12, 140);
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  return (
    <AbsoluteFill>
      <DarkBg glow={RED} />
      <div
        style={{
          position: 'absolute',
          top: 420,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 60,
          color: '#c7ced9',
          opacity: Math.min(1, sTitle * 1.6),
          transform: `translateY(${(1 - sTitle) * -40}px)`,
        }}
      >
        a jeśli...
      </div>
      <div
        style={{
          position: 'absolute',
          top: 500,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 100,
          color: RED,
          letterSpacing: 2,
          transform: `scale(${0.6 + Math.min(1, sTitle) * 0.4})`,
          opacity: Math.min(1, sTitle * 2),
          textShadow: `0 0 ${30 + pulse * 40}px ${RED}88, 0 10px 50px rgba(0,0,0,0.7)`,
        }}
      >
        COŚ&nbsp;SIĘ&nbsp;STANIE?
      </div>
      <Row delay={40} icon="🦠" text="pandemia" y={860} />
      <Row delay={78} icon="📉" text="kryzys" y={990} />
      <Row delay={116} icon="🚪" text="biznes zamknięty" y={1120} />
    </AbsoluteFill>
  );
};

// ---------- INTERLUDE PAYOFF: DARMOWA REKLAMA ----------

const UpChart: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 100], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const path = 'M 60 1500 L 280 1420 L 480 1460 L 700 1260 L 900 1300 L 1020 1120';
  const len = 1300;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.45}}>
      <path d={path} stroke={GREEN} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {p > 0.97 && <circle cx={1020} cy={1120} r={13} fill={GREEN} />}
    </svg>
  );
};

export const InterludePayoff: React.FC = () => {
  const frame = useCurrentFrame();
  const sSerif = useSp(6, 14, 110);
  const sWord = useSp(30, 10, 150);
  const glowPulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill>
      <DarkBg glow={GREEN} />
      <UpChart delay={20} />
      <div
        style={{
          position: 'absolute',
          top: 640,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 60,
          color: '#e8e8e8',
          opacity: Math.min(1, sSerif * 1.5),
          transform: `translateY(${(1 - sSerif) * 60}px)`,
        }}
      >
        to po prostu
      </div>
      <div
        style={{
          position: 'absolute',
          top: 740,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 74,
          color: GREEN,
          lineHeight: 1.15,
          transform: `scale(${0.5 + sWord * 0.5})`,
          opacity: Math.min(1, sWord * 2),
          textShadow: `0 0 ${30 + glowPulse * 40}px ${GREEN}88, 0 10px 50px rgba(0,0,0,0.7)`,
          letterSpacing: 1,
          whiteSpace: 'nowrap',
        }}
      >
        DARMOWA REKLAMA
      </div>
      <div
        style={{
          position: 'absolute',
          top: 940,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 800,
          fontSize: 46,
          color: '#9aa3b2',
          opacity: Math.min(1, sWord * 2),
        }}
      >
        dla Twojej firmy
      </div>
    </AbsoluteFill>
  );
};

// ---------- BADGE pill (alpha overlay) ----------

export const Badge5: React.FC<{icon: string; text: string}> = ({icon, text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const sIn = useSp(0, 11, 170);
  const iconB = Math.sin(frame / 6) * 6;
  const outStart = durationInFrames - Math.round(0.25 * fps);
  const out = interpolate(frame, [outStart, durationInFrames - 2], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          backgroundColor: '#161d28f2',
          border: `4px solid ${ORANGE}`,
          borderRadius: 999,
          padding: '20px 44px',
          boxShadow: `0 18px 60px rgba(0,0,0,0.55), 0 0 34px ${ORANGE}44`,
          transform: `translateY(${(1 - sIn) * -260 + out * -260}px) scale(${0.7 + sIn * 0.3})`,
          opacity: Math.min(1, sIn * 1.8) * (1 - out),
        }}
      >
        <span style={{fontSize: 54, transform: `translateY(${iconB}px)`}}>{icon}</span>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 46, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap'}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- VS SPLIT: IDZIESZ Z CZASEM vs ZOSTAJESZ W TYLE ----------

export const VsSplit5: React.FC = () => {
  const frame = useCurrentFrame();
  const sL = useSp(4, 13, 130);
  const sR = useSp(16, 13, 130);
  const sVs = useSp(30, 9, 200);
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  return (
    <AbsoluteFill style={{backgroundColor: '#05080d'}}>
      {/* left: zostajesz w tyle */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateX(${(1 - sL) * -540}px)`}}>
        <AbsoluteFill style={{background: 'linear-gradient(160deg, #0a1a2e, #07101c)'}} />
        <AbsoluteFill style={{background: `radial-gradient(500px 500px at 270px 700px, ${BLUE}26, transparent 70%)`}} />
        <div style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', fontSize: 110}}>🐌</div>
        <div style={{position: 'absolute', top: 690, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 48, color: BLUE, letterSpacing: 1, lineHeight: 1.15, padding: '0 30px'}}>
          ZOSTAJESZ<br />W TYLE
        </div>
        <div style={{position: 'absolute', top: 1130, width: '100%', textAlign: 'center', fontSize: 90, color: RED}}>✗</div>
      </div>
      {/* right: idziesz z czasem */}
      <div style={{position: 'absolute', left: 540, top: 0, width: 540, height: 1920, overflow: 'hidden', transform: `translateX(${(1 - sR) * 540}px)`}}>
        <AbsoluteFill style={{background: 'linear-gradient(160deg, #10230f, #0a170a)'}} />
        <AbsoluteFill style={{background: `radial-gradient(500px 500px at 270px 700px, ${GREEN}2e, transparent 70%)`}} />
        <div style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', fontSize: 110}}>🚀</div>
        <div style={{position: 'absolute', top: 690, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 48, color: GREEN, letterSpacing: 1, lineHeight: 1.15, padding: '0 30px'}}>
          IDZIESZ<br />Z CZASEM
        </div>
        <div style={{position: 'absolute', top: 1130, width: '100%', textAlign: 'center', fontSize: 90, color: GREEN}}>✓</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center', transform: `scale(${0.4 + sVs * 0.6})`, opacity: Math.min(1, sVs * 2)}}>
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 88, color: '#fff', backgroundColor: '#101722', border: '5px solid #fff', borderRadius: 999, padding: '12px 34px', boxShadow: `0 0 ${20 + pulse * 40}px rgba(255,255,255,0.5)`}}>VS</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA DM: napisz do mnie ----------

export const CtaDm5: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const typeEnd = Math.round(1.2 * fps);
  const sCard = useSp(0, 14, 120);
  const sMsg = useSp(typeEnd, 11, 160);
  const metaOp = interpolate(frame - typeEnd - 20, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const Dot: React.FC<{i: number}> = ({i}) => {
    const b = Math.sin((frame - i * 6) / 5);
    return <div style={{width: 16, height: 16, borderRadius: 16, backgroundColor: '#8a94a3', transform: `translateY(${b * -7}px)`}} />;
  };

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: 930,
          backgroundColor: '#161b22ee',
          borderRadius: 30,
          padding: '28px 32px',
          border: '1px solid #2a3441',
          boxShadow: '0 26px 80px rgba(0,0,0,0.6)',
          transform: `translateY(${(1 - sCard) * 320}px)`,
          opacity: Math.min(1, sCard * 1.8),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20}}>
          <div style={{width: 56, height: 56, borderRadius: 56, background: `linear-gradient(135deg, ${ORANGE}, #2D4DFF)`}} />
          <div>
            <div style={{fontFamily: SANS, color: '#fff', fontWeight: 800, fontSize: 30}}>Ty</div>
            <div style={{fontFamily: SANS, color: '#8a94a3', fontSize: 23}}>wiadomość prywatna</div>
          </div>
        </div>
        {frame < typeEnd ? (
          <div style={{display: 'inline-flex', gap: 10, backgroundColor: '#222b36', borderRadius: 24, padding: '22px 30px'}}>
            <Dot i={0} />
            <Dot i={1} />
            <Dot i={2} />
          </div>
        ) : (
          <div
            style={{
              backgroundColor: '#1f6feb',
              color: '#fff',
              fontFamily: SANS,
              fontSize: 32,
              fontWeight: 600,
              padding: '22px 28px',
              borderRadius: '24px 24px 24px 8px',
              maxWidth: 820,
              lineHeight: 1.35,
              transform: `scale(${0.6 + sMsg * 0.4})`,
              transformOrigin: 'bottom left',
              opacity: Math.min(1, sMsg * 2),
            }}
          >
            Cześć! Chcę ogarnąć social media dla mojej firmy, pomożesz? 👋
          </div>
        )}
        <div style={{fontFamily: SANS, color: '#8a94a3', fontSize: 21, marginTop: 16, display: 'flex', gap: 22, opacity: metaOp}}>
          <span>Wysłano teraz</span>
          <span>✓✓ Dostarczono</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
