import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';

const ORANGE = '#FF4D2D';
const GREEN = '#5CCB6A';
const RED = '#F03B3B';
const SANS = "Montserrat, 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

// ---------- shared bits ----------

const Grain: React.FC = () => {
  // animated film grain via layered radial gradients jittered per frame
  const frame = useCurrentFrame();
  const x = (frame * 37) % 100;
  const y = (frame * 61) % 100;
  return (
    <AbsoluteFill
      style={{
        opacity: 0.05,
        backgroundImage:
          'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 1px), radial-gradient(circle at 40% 80%, #fff 0.5px, transparent 1px)',
        backgroundSize: '7px 7px, 11px 11px, 13px 13px',
        backgroundPosition: `${x}px ${y}px, ${-y}px ${x}px, ${x}px ${-x}px`,
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
      {/* subtle grid */}
      <AbsoluteFill
        style={{
          opacity: 0.07,
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          backgroundPosition: `0px ${(frame * 0.15) % 90}px`,
        }}
      />
      <Grain />
      {/* vignette */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 340px 120px rgba(0,0,0,0.85)'}} />
    </AbsoluteFill>
  );
};

const useSpringIn = (delayFrames: number, damping = 12, stiffness = 130) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delayFrames, fps, config: {damping, stiffness, mass: 0.9}});
};

// ---------- HOOK: chest-level kinetic slams with impact particles ----------

const Burst: React.FC<{t0: number; cx: number; cy: number; color: string}> = ({t0, cx, cy, color}) => {
  const frame = useCurrentFrame();
  const local = frame - t0;
  if (local < 0 || local > 26) return null;
  const p = local / 26;
  const dots = 10;
  return (
    <>
      {Array.from({length: dots}).map((_, i) => {
        const ang = (i / dots) * Math.PI * 2 + 0.4;
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

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w1In = 0;
  const w1Out = Math.round(1.06 * fps);
  const w2Out = Math.round(2.3 * fps);

  const s1 = useSpringIn(w1In, 11, 190);
  const s2 = useSpringIn(w1Out, 11, 190);

  const word1Visible = frame >= w1In && frame < w1Out;
  const word2Visible = frame >= w1Out && frame < w2Out;

  const base: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    top: 1060,
    textAlign: 'center',
    fontFamily: SANS,
    fontWeight: 900,
    letterSpacing: 2,
  };

  return (
    <AbsoluteFill>
      {word1Visible && (
        <>
          <div
            style={{
              ...base,
              fontSize: 128,
              color: '#fff',
              transform: `scale(${0.4 + s1 * 0.6}) rotate(${(1 - s1) * -6}deg)`,
              textShadow: '0 6px 0 #1c2735, 0 14px 44px rgba(0,0,0,0.65)',
              opacity: Math.min(1, s1 * 2),
            }}
          >
            DZWONI
          </div>
          <Burst t0={2} cx={540} cy={1130} color={ORANGE} />
        </>
      )}
      {word2Visible && (
        <>
          <div
            style={{
              ...base,
              fontSize: 108,
              color: ORANGE,
              transform: `scale(${0.4 + s2 * 0.6}) rotate(${(1 - s2) * 5}deg)`,
              textShadow: '0 6px 0 #40130a, 0 14px 44px rgba(0,0,0,0.65)',
              opacity: Math.min(1, s2 * 2),
            }}
          >
            MNIEJ&nbsp;LUDZI?
          </div>
          <Burst t0={w1Out + 2} cx={540} cy={1130} color={'#ffffff'} />
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- INTERLUDE 1: excuse list + declining chart ----------

const DownChart: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const path = 'M 60 520 L 260 610 L 460 560 L 660 760 L 860 700 L 1020 880';
  const len = 1300;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.5}}>
      <path
        d={path}
        stroke={RED}
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - p)}
      />
      {p > 0.97 && <circle cx={1020} cy={880} r={13} fill={RED} />}
    </svg>
  );
};

const Row: React.FC<{delay: number; text: string; y: number}> = ({delay, text, y}) => {
  const s = useSpringIn(delay, 13, 120);
  const frame = useCurrentFrame();
  const arrowP = interpolate(frame - delay - 10, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        transform: `translateX(${(1 - s) * -700}px)`,
        opacity: Math.min(1, s * 1.6),
      }}
    >
      <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 82, color: '#fff', letterSpacing: 1, textShadow: '0 8px 30px rgba(0,0,0,0.7)'}}>
        {text}
      </span>
      <svg width={54} height={70} style={{opacity: arrowP}}>
        <path d={`M 27 4 L 27 ${4 + arrowP * 40}`} stroke={RED} strokeWidth={10} strokeLinecap="round" />
        <path d="M 8 40 L 27 62 L 46 40" stroke={RED} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

export const Interlude1: React.FC = () => {
  const frame = useCurrentFrame();
  const serifOp = interpolate(frame - 128, [0, 25], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <DarkBg glow={RED} />
      <DownChart delay={6} />
      <Row delay={8} text="MNIEJ TELEFONÓW" y={560} />
      <Row delay={62} text="MNIEJ ZLECEŃ" y={760} />
      <div
        style={{
          position: 'absolute',
          top: 1010,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 74,
          color: '#9aa3b2',
          opacity: serifOp,
        }}
      >
        „taki okres”?
      </div>
    </AbsoluteFill>
  );
};

// ---------- INTERLUDE 2: payoff SEZON vs SYSTEM ----------

const UpChart: React.FC<{delay: number}> = ({delay}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const path = 'M 60 1500 L 280 1420 L 480 1460 L 700 1260 L 900 1300 L 1020 1120';
  const len = 1300;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', opacity: 0.45}}>
      <path d={path} stroke={GREEN} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {p > 0.97 && <circle cx={1020} cy={1120} r={13} fill={GREEN} />}
    </svg>
  );
};

export const Interlude2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // beat A: 0 - 2.7s
  const sSerif = useSpringIn(6, 14, 110);
  const sSystem = useSpringIn(28, 10, 150);
  const glowPulse = 0.5 + Math.sin(frame / 7) * 0.5;

  // beat B: from 2.95s
  const bB = Math.round(2.95 * fps);
  const sSezon = useSpringIn(bB, 14, 130);
  const strikeP = interpolate(frame - bB - 14, [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const sSysOk = useSpringIn(bB + 42, 10, 150);
  const checkP = interpolate(frame - bB - 52, [0, 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  // beat C: from 5.35s
  const bC = Math.round(5.35 * fps);
  const eqText = '= klienci cały rok';
  const typeN = Math.max(0, Math.min(eqText.length, Math.floor((frame - bC) / 2)));

  const beatA = frame < bB - 6;
  const fadeA = interpolate(frame, [bB - 16, bB - 4], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <DarkBg glow={frame < bB ? ORANGE : GREEN} />
      {frame >= bB && <UpChart delay={bB + 30} />}

      {beatA || fadeA > 0 ? (
        <div style={{opacity: fadeA}}>
          <div
            style={{
              position: 'absolute',
              top: 640,
              width: '100%',
              textAlign: 'center',
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 68,
              color: '#e8e8e8',
              opacity: Math.min(1, sSerif * 1.5),
              transform: `translateY(${(1 - sSerif) * 60}px)`,
            }}
          >
            przewidywalny
          </div>
          <div
            style={{
              position: 'absolute',
              top: 760,
              width: '100%',
              textAlign: 'center',
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 168,
              color: ORANGE,
              transform: `scale(${0.5 + sSystem * 0.5})`,
              opacity: Math.min(1, sSystem * 2),
              textShadow: `0 0 ${30 + glowPulse * 40}px ${ORANGE}88, 0 10px 50px rgba(0,0,0,0.7)`,
              letterSpacing: 4,
            }}
          >
            SYSTEM
          </div>
        </div>
      ) : null}

      {frame >= bB && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 660,
              width: '100%',
              textAlign: 'center',
              fontFamily: SANS,
              fontWeight: 900,
              fontSize: 104,
              color: RED,
              opacity: Math.min(1, sSezon * 1.6) * 0.92,
              transform: `translateY(${(1 - sSezon) * -50}px)`,
            }}
          >
            <span style={{position: 'relative', display: 'inline-block'}}>
              SEZON
              <span
                style={{
                  position: 'absolute',
                  left: '-4%',
                  top: '50%',
                  width: `${strikeP * 108}%`,
                  height: 12,
                  borderRadius: 8,
                  backgroundColor: RED,
                  boxShadow: '0 0 18px #F03B3Baa',
                }}
              />
            </span>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 880,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 26,
              transform: `scale(${0.5 + sSysOk * 0.5})`,
              opacity: Math.min(1, sSysOk * 2),
            }}
          >
            <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 122, color: GREEN, textShadow: '0 0 44px #5CCB6A66, 0 10px 40px rgba(0,0,0,0.7)', letterSpacing: 3}}>
              SYSTEM
            </span>
            <svg width={110} height={110} viewBox="0 0 110 110">
              <circle cx={55} cy={55} r={48} stroke={GREEN} strokeWidth={9} fill="none" strokeDasharray={302} strokeDashoffset={302 * (1 - checkP)} transform="rotate(-90 55 55)" />
              <path d="M 30 58 L 49 76 L 82 38" stroke={GREEN} strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={90} strokeDashoffset={90 * (1 - checkP)} />
            </svg>
          </div>
          <div
            style={{
              position: 'absolute',
              top: 1100,
              width: '100%',
              textAlign: 'center',
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 76,
              color: GREEN,
              opacity: frame >= bC ? 1 : 0,
            }}
          >
            {eqText.slice(0, typeN)}
            {frame >= bC && typeN < eqText.length ? <span style={{opacity: glowPulse}}>|</span> : null}
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ---------- CTA DM: typing indicator -> message springs in ----------

export const CtaDm: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const typeEnd = Math.round(1.25 * fps);
  const sCard = useSpringIn(0, 14, 120);
  const sMsg = useSpringIn(typeEnd, 11, 160);
  const metaOp = interpolate(frame - typeEnd - 20, [0, 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const Dot: React.FC<{i: number}> = ({i}) => {
    const b = Math.sin((frame - i * 6) / 5);
    return (
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 16,
          backgroundColor: '#8a94a3',
          transform: `translateY(${b * -7}px)`,
        }}
      />
    );
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
          <div
            style={{
              display: 'inline-flex',
              gap: 10,
              backgroundColor: '#222b36',
              borderRadius: 24,
              padding: '22px 30px',
            }}
          >
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
              fontSize: 33,
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
            Cześć! Widziałem Twoją rolkę, chętnie pogadam o tym systemie 👋
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

// ---------- Animated pill badge (alpha overlay) ----------

export const Badge: React.FC<{icon: string; text: string}> = ({icon, text}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const sIn = useSpringIn(0, 11, 170);
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
        <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: '#fff', letterSpacing: 1, whiteSpace: 'nowrap'}}>{text}</span>
      </div>
    </AbsoluteFill>
  );
};
