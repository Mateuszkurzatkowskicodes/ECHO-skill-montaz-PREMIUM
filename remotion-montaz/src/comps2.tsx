import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';

const ORANGE = '#FF4D2D';
const GREEN = '#5CCB6A';
const RED = '#F03B3B';
const SANS = "Montserrat, 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

const useSpringIn = (delayFrames: number, damping = 12, stiffness = 130) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delayFrames, fps, config: {damping, stiffness, mass: 0.9}});
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
          <div key={i} style={{position: 'absolute', left: cx + Math.cos(ang) * dist, top: cy + Math.sin(ang) * dist * 0.75, width: size, height: size, borderRadius: size, backgroundColor: color, opacity: 1 - p}} />
        );
      })}
    </>
  );
};

// ---------- PRZED -> PO polaroids (top zone, inside Hook2) ----------

const BeforeAfter: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const IN = Math.round(3.35 * fps);
  const OUT = Math.round(5.15 * fps);
  if (frame < IN || frame > OUT) return null;
  const sL = spring({frame: frame - IN, fps, config: {damping: 11, stiffness: 170, mass: 0.9}});
  const sA = spring({frame: frame - IN - 20, fps, config: {damping: 11, stiffness: 170, mass: 0.9}});
  const sR = spring({frame: frame - IN - 34, fps, config: {damping: 10, stiffness: 180, mass: 0.9}});
  const fadeOut = interpolate(frame, [OUT - 10, OUT], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const card: React.CSSProperties = {
    width: 300,
    height: 230,
    borderRadius: 18,
    padding: 12,
    boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontFamily: SANS,
    fontWeight: 900,
    fontSize: 40,
  };
  const sparkP = (frame - IN - 40) / 20;
  return (
    <div style={{position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 26, opacity: fadeOut}}>
      <div style={{...card, backgroundColor: '#2a2f38', color: '#9aa3b2', border: '3px solid #3a4656', transform: `rotate(-6deg) scale(${0.5 + sL * 0.5})`, opacity: Math.min(1, sL * 2), filter: 'saturate(0.4)'}}>
        <span style={{fontSize: 72}}>🌫️</span>
        <span>PRZED 🙁</span>
      </div>
      <svg width={80} height={60} style={{opacity: Math.min(1, sA * 1.6), transform: `translateX(${(1 - sA) * -30}px)`}}>
        <path d="M 6 30 L 58 30" stroke={ORANGE} strokeWidth={10} strokeLinecap="round" />
        <path d="M 46 12 L 70 30 L 46 48" stroke={ORANGE} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{position: 'relative', ...card, backgroundColor: '#14251b', color: GREEN, border: `3px solid ${GREEN}`, transform: `rotate(4deg) scale(${0.5 + sR * 0.5})`, opacity: Math.min(1, sR * 2), boxShadow: `0 18px 50px rgba(0,0,0,0.55), 0 0 34px ${GREEN}44`}}>
        <span style={{fontSize: 72}}>📸</span>
        <span>PO ✨</span>
        {sparkP > 0 && sparkP < 1 ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} style={{position: 'absolute', top: -14 - i * 8 - sparkP * 26, left: 24 + i * 78, fontSize: 30, opacity: 1 - sparkP}}>✦</span>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

// ---------- HOOK 2: TWOJE ZDJĘCIA -> MEGA SŁABO + 30 SEKUND timer ----------

export const Hook2: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w1Out = Math.round(1.86 * fps);
  const w2Out = Math.round(3.06 * fps);
  const tIn = Math.round(5.3 * fps);
  const tOut = Math.round(6.78 * fps);

  const s1 = useSpringIn(0, 11, 190);
  const s2 = useSpringIn(w1Out, 11, 190);
  const sT = useSpringIn(tIn, 11, 170);

  const base: React.CSSProperties = {position: 'absolute', width: '100%', top: 1060, textAlign: 'center', fontFamily: SANS, fontWeight: 900, letterSpacing: 2};
  const timerP = interpolate(frame - tIn, [0, tOut - tIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      {frame < w1Out && (
        <>
          <div style={{...base, fontSize: 112, color: '#fff', transform: `scale(${0.4 + s1 * 0.6}) rotate(${(1 - s1) * -6}deg)`, textShadow: '0 6px 0 #1c2735, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s1 * 2)}}>
            TWOJE&nbsp;ZDJĘCIA
          </div>
          <Burst t0={2} cx={540} cy={1120} color={ORANGE} />
        </>
      )}
      {frame >= w1Out && frame < w2Out && (
        <>
          <div style={{...base, fontSize: 122, color: RED, transform: `scale(${0.4 + s2 * 0.6}) rotate(${(1 - s2) * 5}deg)`, textShadow: '0 6px 0 #40130a, 0 14px 44px rgba(0,0,0,0.65)', opacity: Math.min(1, s2 * 2)}}>
            MEGA&nbsp;SŁABO
          </div>
          <Burst t0={w1Out + 2} cx={540} cy={1120} color={'#ffffff'} />
        </>
      )}
      {/* PRZED -> PO polaroid cards, top zone (3.35 - 5.15s) */}
      <BeforeAfter />
      {frame >= tIn && frame < tOut && (
        <div
          style={{
            position: 'absolute',
            top: 1330,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 22,
            transform: `scale(${0.6 + sT * 0.4})`,
            opacity: Math.min(1, sT * 2),
          }}
        >
          <div style={{backgroundColor: '#161d28f2', border: `4px solid ${GREEN}`, borderRadius: 999, padding: '18px 40px', display: 'flex', alignItems: 'center', gap: 20, boxShadow: `0 18px 60px rgba(0,0,0,0.55), 0 0 34px ${GREEN}44`}}>
            <svg width={64} height={64} viewBox="0 0 64 64">
              <circle cx={32} cy={32} r={26} stroke="#2a3441" strokeWidth={8} fill="none" />
              <circle cx={32} cy={32} r={26} stroke={GREEN} strokeWidth={8} fill="none" strokeDasharray={163} strokeDashoffset={163 * timerP} transform="rotate(-90 32 32)" strokeLinecap="round" />
            </svg>
            <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 54, color: '#fff'}}>30 SEKUND</span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- shared chat UI bits ----------

const typedText = (frame: number, startF: number, text: string, cps = 1.6) => {
  const n = Math.max(0, Math.floor((frame - startF) / cps));
  return text.slice(0, Math.min(text.length, n));
};

const ChatField: React.FC<{
  y: number;
  text: string;
  typeStart: number;
  verdict: 'bad' | 'good' | null;
  verdictAt: number;
  width?: number;
}> = ({y, text, typeStart, verdict, verdictAt, width = 900}) => {
  const frame = useCurrentFrame();
  const shown = typedText(frame, typeStart, text);
  const done = shown.length >= text.length;
  const showVerdict = verdict && frame >= verdictAt;
  const shake = verdict === 'bad' && showVerdict ? Math.sin((frame - verdictAt) * 1.6) * Math.max(0, 1 - (frame - verdictAt) / 22) * 9 : 0;
  const sV = useSpringIn(verdictAt, 10, 180);
  const appear = useSpringIn(typeStart - 8, 14, 130);
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: (1080 - width) / 2,
        width,
        transform: `translateX(${shake}px) translateY(${(1 - appear) * 70}px)`,
        opacity: Math.min(1, appear * 1.8),
      }}
    >
      <div
        style={{
          backgroundColor: '#161b22f5',
          border: `2px solid ${showVerdict ? (verdict === 'bad' ? RED : GREEN) : '#2a3441'}`,
          borderRadius: 22,
          padding: '26px 30px',
          fontFamily: SANS,
          fontSize: 38,
          color: '#e9eef5',
          minHeight: 108,
          boxShadow: '0 22px 66px rgba(0,0,0,0.55)',
          lineHeight: 1.35,
        }}
      >
        {shown}
        {!done && caret ? <span style={{color: ORANGE}}>|</span> : null}
      </div>
      {showVerdict ? (
        <div
          style={{
            position: 'absolute',
            right: -14,
            top: -30,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: verdict === 'bad' ? RED : GREEN,
            color: '#fff',
            fontFamily: SANS,
            fontWeight: 900,
            fontSize: 34,
            borderRadius: 999,
            padding: '10px 26px',
            transform: `scale(${0.5 + sV * 0.5}) rotate(${verdict === 'bad' ? -4 : 3}deg)`,
            opacity: Math.min(1, sV * 2),
            boxShadow: '0 12px 34px rgba(0,0,0,0.45)',
          }}
        >
          {verdict === 'bad' ? '✗ ZA OGÓLNE' : '✓ KONKRET'}
        </div>
      ) : null}
    </div>
  );
};

// ---------- PROMPT BAD: full-screen, generic prompt fails (7.1s) ----------

export const PromptBad: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const serifOp = interpolate(frame - Math.round(5.6 * fps), [0, 20], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill>
      <DarkBg glow={RED} />
      <div style={{position: 'absolute', top: 430, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 58, color: '#8a94a3', letterSpacing: 3}}>TWÓJ PROMPT:</div>
      <ChatField y={560} text={'Popraw mi to zdjęcie, niech wygląda ładnie…'} typeStart={14} verdict="bad" verdictAt={Math.round(3.6 * fps)} />
      <div style={{position: 'absolute', top: 900, width: '100%', textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 62, color: '#9aa3b2', opacity: serifOp}}>
        magii nie oczekuj…
      </div>
    </AbsoluteFill>
  );
};

// ---------- PROMPT GOOD: floating card over face, 2 concrete prompts (11s, alpha) ----------

export const PromptGood: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      {/* card panel floating - transparent comp, face stays visible below */}
      <ChatField y={120} text={'Sprzątnij podłogę na zdjęciu'} typeStart={16} verdict="good" verdictAt={Math.round(3.1 * fps)} width={860} />
      <ChatField y={430} text={'Usuń wiadro z tła, dodaj lepsze światło'} typeStart={Math.round(6.0 * fps)} verdict="good" verdictAt={Math.round(9.6 * fps)} width={860} />
    </AbsoluteFill>
  );
};

// ---------- PAYOFF: universal secret prompt card (5.9s) ----------

export const Payoff2: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSpringIn(8, 12, 140);
  const glowPulse = 0.5 + Math.sin(frame / 7) * 0.5;
  const sTitle = useSpringIn(26, 10, 160);
  const blurLines = [86, 70, 92, 60, 78];
  return (
    <AbsoluteFill>
      <DarkBg glow={ORANGE} />
      <div style={{position: 'absolute', top: 380, width: '100%', textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 64, color: '#e8e8e8', opacity: Math.min(1, sTitle * 1.6)}}>
        uniwersalne polecenie
      </div>
      <div
        style={{
          position: 'absolute',
          top: 520,
          left: 90,
          width: 900,
          backgroundColor: '#161b22f5',
          border: `3px solid ${ORANGE}`,
          borderRadius: 26,
          padding: '38px 40px',
          transform: `translateY(${(1 - sCard) * 240}px) scale(${0.8 + sCard * 0.2})`,
          opacity: Math.min(1, sCard * 1.8),
          boxShadow: `0 26px 80px rgba(0,0,0,0.6), 0 0 ${40 + glowPulse * 50}px ${ORANGE}55`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginBottom: 28}}>
          <span style={{fontSize: 54}}>🔒</span>
          <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, color: '#fff', letterSpacing: 1}}>SUPER PROMPT</span>
        </div>
        {blurLines.map((w, i) => (
          <div key={i} style={{height: 26, width: `${w}%`, borderRadius: 13, backgroundColor: '#3a4656', filter: 'blur(7px)', marginBottom: 20, opacity: 0.85}} />
        ))}
      </div>
      <div style={{position: 'absolute', top: 1180, width: '100%', textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 56, color: GREEN, opacity: interpolate(frame, [200, 225], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
        ZDJĘCIE ZAWSZE WYGLĄDA SUPER ✓
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA: IG comment being typed (5.6s, alpha) ----------

export const CtaComment: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sCard = useSpringIn(0, 14, 120);
  const typeStart = Math.round(1.1 * fps);
  const word = 'ZDJĘCIE';
  const shown = typedText(frame, typeStart, word, 3.2);
  const done = shown.length >= word.length;
  const sSend = useSpringIn(typeStart + Math.round(word.length * 3.2) + 8, 10, 170);
  const caret = Math.floor(frame / 8) % 2 === 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div
        style={{
          width: 930,
          backgroundColor: '#161b22ee',
          borderRadius: 30,
          padding: '26px 30px',
          border: '1px solid #2a3441',
          boxShadow: '0 26px 80px rgba(0,0,0,0.6)',
          transform: `translateY(${(1 - sCard) * 320}px)`,
          opacity: Math.min(1, sCard * 1.8),
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <div style={{width: 58, height: 58, borderRadius: 58, background: `linear-gradient(135deg, ${ORANGE}, #2D4DFF)`, flexShrink: 0}} />
        <div
          style={{
            flexGrow: 1,
            backgroundColor: '#222b36',
            borderRadius: 999,
            padding: '20px 30px',
            fontFamily: SANS,
            fontSize: 40,
            color: shown ? '#fff' : '#8a94a3',
            fontWeight: shown ? 900 : 500,
            letterSpacing: shown ? 3 : 0,
          }}
        >
          {shown ? shown : 'Dodaj komentarz…'}
          {!done && frame >= typeStart && caret ? <span style={{color: ORANGE}}>|</span> : null}
        </div>
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: 74,
            backgroundColor: done ? ORANGE : '#2a3441',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: `scale(${done ? 0.7 + sSend * 0.45 : 1})`,
            boxShadow: done ? `0 0 30px ${ORANGE}77` : 'none',
            flexShrink: 0,
          }}
        >
          <svg width={36} height={36} viewBox="0 0 24 24" fill="none">
            <path d="M3 11 L21 3 L14 21 L11 13 Z" fill="#fff" />
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};
