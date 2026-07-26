import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';

// ---------- ECHO design tokens ----------
const AMBER = '#FFB13D';
const ORANGE = '#FF4A2D';
const DEEP = '#E0290F';
const CYAN = '#38B6D8';
const NAVY = '#0E1622';
const INK = '#070B11';
const GREEN = '#4ED47A';
const RED = '#F0453B';

const HEAVY = "'Arial Black', 'Segoe UI', Arial, sans-serif";
const SANS = "Bahnschrift, 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const FIRE = `linear-gradient(150deg, ${AMBER}, ${ORANGE} 55%, ${DEEP})`;

const FPS = 60;
const s2f = (s: number) => Math.round(s * FPS);

const useSp = (delay: number, damping = 12, stiffness = 140) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.9}});
};

// fade-out helper for the last N frames of a sequence
const useOut = (tail = 0.22) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const start = durationInFrames - Math.round(tail * fps);
  return interpolate(frame, [start, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 37) % 100;
  const y = (frame * 61) % 100;
  return (
    <AbsoluteFill
      style={{
        opacity: 0.06,
        backgroundImage:
          'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 1px)',
        backgroundSize: '7px 7px, 11px 11px',
        backgroundPosition: `${x}px ${y}px, ${-y}px ${x}px`,
      }}
    />
  );
};

// full-frame ECHO background for cutaways
const EchoBg: React.FC<{glow?: string}> = ({glow = ORANGE}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 95) * 70;
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(950px 950px at ${260 + drift}px ${1480 - drift}px, ${glow}2b 0%, transparent 70%), radial-gradient(780px 780px at ${860 - drift}px ${360 + drift}px, ${CYAN}1c 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.06,
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          backgroundPosition: `0px ${(frame * 0.16) % 92}px`,
        }}
      />
      <Grain />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 360px 130px rgba(0,0,0,0.88)'}} />
    </AbsoluteFill>
  );
};

const Burst: React.FC<{t0: number; cx: number; cy: number; color: string; n?: number}> = ({
  t0,
  cx,
  cy,
  color,
  n = 11,
}) => {
  const frame = useCurrentFrame();
  const local = frame - t0;
  if (local < 0 || local > 28) return null;
  const p = local / 28;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + 0.35;
        const dist = 45 + p * 210;
        const size = 14 * (1 - p);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx + Math.cos(ang) * dist,
              top: cy + Math.sin(ang) * dist * 0.72,
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

// ---------- 1. two-stage word slam (chest height, never on the face) ----------

export const TwoWordSlam: React.FC<{
  w1: string;
  w2: string;
  switchAt: number;
  c1?: string;
  c2?: string;
  top?: number;
  size1?: number;
  size2?: number;
}> = ({w1, w2, switchAt, c1 = '#fff', c2 = AMBER, top = 990, size1 = 116, size2 = 116}) => {
  const frame = useCurrentFrame();
  const out = useOut();
  const s1 = useSp(0, 11, 200);
  const s2 = useSp(switchAt, 11, 200);
  const base: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    top,
    textAlign: 'center',
    fontFamily: HEAVY,
    fontWeight: 900,
    letterSpacing: -1,
    padding: '0 40px',
    lineHeight: 1.02,
  };
  const first = frame < switchAt;
  const sp = first ? s1 : s2;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div
        style={{
          ...base,
          fontSize: first ? size1 : size2,
          color: first ? c1 : c2,
          transform: `scale(${0.42 + sp * 0.58}) rotate(${(1 - sp) * (first ? -5 : 4)}deg)`,
          textShadow: '0 7px 0 rgba(6,10,16,0.9), 0 16px 48px rgba(0,0,0,0.7)',
          opacity: Math.min(1, sp * 2.2),
        }}
      >
        {first ? w1 : w2}
      </div>
      <Burst t0={first ? 2 : switchAt + 2} cx={540} cy={top + 70} color={first ? ORANGE : '#fff'} />
    </AbsoluteFill>
  );
};

// ---------- 2. pill badge ----------

export const Pill: React.FC<{icon: string; text: string; accent?: string; top?: number}> = ({
  icon,
  text,
  accent = ORANGE,
  top = 980,
}) => {
  const frame = useCurrentFrame();
  const sIn = useSp(0, 11, 175);
  const out = useOut();
  const bob = Math.sin(frame / 6) * 6;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            backgroundColor: '#101823f5',
            border: `4px solid ${accent}`,
            borderRadius: 999,
            padding: '20px 46px',
            boxShadow: `0 20px 64px rgba(0,0,0,0.6), 0 0 38px ${accent}55`,
            transform: `translateY(${(1 - sIn) * -280 + out * -280}px) scale(${0.72 + sIn * 0.28})`,
            opacity: Math.min(1, sIn * 1.9) * (1 - out),
          }}
        >
          <span style={{fontSize: 54, transform: `translateY(${bob}px)`}}>{icon}</span>
          <span
            style={{
              fontFamily: HEAVY,
              fontWeight: 900,
              fontSize: 46,
              color: '#fff',
              letterSpacing: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 3. word with animated strikethrough ----------

export const StrikeWord: React.FC<{kicker: string; word: string; top?: number}> = ({
  kicker,
  word,
  top = 950,
}) => {
  const sIn = useSp(0, 12, 160);
  const out = useOut();
  const strike = interpolate(useCurrentFrame(), [26, 52], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return (
    <AbsoluteFill style={{opacity: (1 - out) * Math.min(1, sIn * 1.8)}}>
      <div
        style={{
          position: 'absolute',
          top,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 52,
          color: '#eef3f9',
          textShadow: '0 3px 10px rgba(0,0,0,0.95), 0 8px 30px rgba(0,0,0,0.85)',
          transform: `translateY(${(1 - sIn) * -30}px)`,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          position: 'absolute',
          top: top + 66,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 108,
            color: '#fff',
            letterSpacing: -1,
            textShadow: '0 7px 0 rgba(6,10,16,0.9), 0 16px 48px rgba(0,0,0,0.7)',
            transform: `scale(${0.6 + sIn * 0.4})`,
          }}
        >
          {word}
          <span
            style={{
              position: 'absolute',
              left: -10,
              right: -10,
              top: '52%',
              height: 12,
              backgroundColor: RED,
              borderRadius: 8,
              transformOrigin: 'left center',
              transform: `scaleX(${strike}) rotate(-2.5deg)`,
              boxShadow: `0 0 26px ${RED}cc`,
            }}
          />
        </span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 4. FULLSCREEN: countdown timer "kilka minut" ----------

export const FsMinutes: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [8, durationInFrames - 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const sTitle = useSp(16, 12, 150);
  // ring geometry: one square box, circle centred in it -> nothing can drift
  const BOX = 480;
  const CY = 880; // absolute centre of the ring on the 1920px canvas
  const R = 196;
  const C = 2 * Math.PI * R;
  const totalSec = Math.max(4, Math.round(interpolate(p, [0, 1], [180, 4])));
  const mm = Math.floor(totalSec / 60);
  const ss = totalSec % 60;
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill>
      <EchoBg glow={AMBER} />
      <div
        style={{
          position: 'absolute',
          top: 508,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 54,
          color: '#aeb8c6',
        }}
      >
        cały montaż zajmuje
      </div>

      {/* ring + number share one centred box */}
      <div
        style={{
          position: 'absolute',
          left: (1080 - BOX) / 2,
          top: CY - BOX / 2,
          width: BOX,
          height: BOX,
        }}
      >
        <svg width={BOX} height={BOX} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <circle cx={BOX / 2} cy={BOX / 2} r={R} stroke="#1b2634" strokeWidth={20} fill="none" />
          <circle
            cx={BOX / 2}
            cy={BOX / 2}
            r={R}
            stroke={AMBER}
            strokeWidth={20}
            fill="none"
            strokeLinecap="butt"
            strokeDasharray={C}
            strokeDashoffset={C * p}
            transform={`rotate(-90 ${BOX / 2} ${BOX / 2})`}
            style={{filter: `drop-shadow(0 0 ${12 + pulse * 14}px ${AMBER}aa)`}}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 124,
            color: '#fff',
            letterSpacing: -2,
            fontVariantNumeric: 'tabular-nums',
            lineHeight: 1,
          }}
        >
          {mm}:{String(ss).padStart(2, '0')}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 1216,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: -2,
          transform: `scale(${0.55 + sTitle * 0.45})`,
          opacity: Math.min(1, sTitle * 2),
          background: FIRE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        KILKA&nbsp;MINUT
      </div>
      <Burst t0={20} cx={540} cy={1272} color={AMBER} />
    </AbsoluteFill>
  );
};

// ---------- 5. FULLSCREEN: "sporo treści" tile grid ----------

const Tile: React.FC<{delay: number; x: number; y: number; label: string}> = ({delay, x, y, label}) => {
  const s = useSp(delay, 13, 150);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 258,
        height: 340,
        borderRadius: 24,
        background: 'linear-gradient(160deg, #16202e, #0d1420)',
        border: '2px solid #223044',
        boxShadow: '0 18px 50px rgba(0,0,0,0.55)',
        transform: `scale(${0.4 + s * 0.6}) translateY(${(1 - s) * 90}px)`,
        opacity: Math.min(1, s * 2),
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(200px 200px at 50% 40%, ${ORANGE}1f, transparent 70%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 128,
          width: '100%',
          textAlign: 'center',
          fontSize: 54,
          color: '#ffffffcc',
        }}
      >
        ▶
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 22,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 26,
          color: '#8b97a8',
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const FsContent: React.FC = () => {
  const sTitle = useSp(4, 12, 150);
  const labels = ['rolka', 'post', 'story', 'rolka', 'post', 'story'];
  return (
    <AbsoluteFill>
      <EchoBg glow={CYAN} />
      <div
        style={{
          position: 'absolute',
          top: 360,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 54,
          color: '#aeb8c6',
          opacity: Math.min(1, sTitle * 1.6),
        }}
      >
        prowadzisz social media?
      </div>
      <div
        style={{
          position: 'absolute',
          top: 440,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 104,
          letterSpacing: -2,
          color: '#fff',
          transform: `scale(${0.6 + sTitle * 0.4})`,
          opacity: Math.min(1, sTitle * 2),
          textShadow: '0 8px 40px rgba(0,0,0,0.7)',
        }}
      >
        SPORO&nbsp;TREŚCI
      </div>
      {labels.map((l, i) => (
        <Tile
          key={i}
          delay={18 + i * 9}
          x={121 + (i % 3) * 280}
          y={700 + Math.floor(i / 3) * 372}
          label={l}
        />
      ))}
    </AbsoluteFill>
  );
};

// ---------- 6. hours count-up card (overlay) ----------

export const HoursCard: React.FC = () => {
  const frame = useCurrentFrame();
  const sIn = useSp(0, 13, 140);
  const out = useOut();
  const n = interpolate(frame, [14, 92], [0, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 0.5 + Math.sin(frame / 8) * 0.5;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div
        style={{
          position: 'absolute',
          top: 880,
          left: 110,
          width: 860,
          backgroundColor: '#0d151fee',
          border: `3px solid ${RED}`,
          borderRadius: 30,
          padding: '30px 36px',
          boxShadow: `0 26px 80px rgba(0,0,0,0.65), 0 0 ${20 + pulse * 26}px ${RED}44`,
          transform: `translateY(${(1 - sIn) * 260}px) scale(${0.85 + sIn * 0.15})`,
          opacity: Math.min(1, sIn * 1.9),
          display: 'flex',
          alignItems: 'center',
          gap: 30,
        }}
      >
        <div style={{fontSize: 96}}>⏳</div>
        <div>
          <div
            style={{
              fontFamily: HEAVY,
              fontWeight: 900,
              fontSize: 104,
              color: RED,
              lineHeight: 1,
              letterSpacing: -2,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {n.toFixed(0)}h+
          </div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: '#cfd7e2', marginTop: 8}}>
            DZIENNIE NA MONTAŻ
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 7. FULLSCREEN chapter: AI ROBI TO ZA CIEBIE ----------

export const FsChapter: React.FC = () => {
  const frame = useCurrentFrame();
  const sK = useSp(2, 13, 130);
  const s1 = useSp(14, 10, 190);
  const s2 = useSp(34, 10, 190);
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill>
      <EchoBg glow={ORANGE} />
      <div
        style={{
          position: 'absolute',
          top: 660,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 56,
          color: '#aeb8c6',
          opacity: Math.min(1, sK * 1.6),
          transform: `translateY(${(1 - sK) * -36}px)`,
        }}
      >
        a teraz
      </div>
      <div
        style={{
          position: 'absolute',
          top: 750,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 158,
          letterSpacing: -4,
          lineHeight: 0.98,
          transform: `scale(${0.5 + s1 * 0.5})`,
          opacity: Math.min(1, s1 * 2),
          background: FIRE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 ${16 + pulse * 22}px ${ORANGE}66)`,
        }}
      >
        AI&nbsp;ROBI
      </div>
      <div
        style={{
          position: 'absolute',
          top: 930,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 106,
          letterSpacing: -2,
          color: '#fff',
          transform: `scale(${0.5 + s2 * 0.5})`,
          opacity: Math.min(1, s2 * 2),
          textShadow: '0 8px 40px rgba(0,0,0,0.75)',
        }}
      >
        TO&nbsp;ZA&nbsp;CIEBIE
      </div>
      <Burst t0={16} cx={540} cy={840} color={AMBER} />
      <Burst t0={36} cx={540} cy={980} color="#fff" />
    </AbsoluteFill>
  );
};

// ---------- 8. raw file -> AI card (overlay) ----------

export const FileDrop: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(0, 13, 140);
  const sArrow = useSp(38, 12, 160);
  const out = useOut();
  const prog = interpolate(frame, [70, 170], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  const bob = Math.sin(frame / 7) * 8;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      {/* raw file card */}
      <div
        style={{
          position: 'absolute',
          top: 810,
          left: 150,
          width: 780,
          backgroundColor: '#0d151fee',
          border: '3px solid #24344a',
          borderRadius: 26,
          padding: '24px 30px',
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          boxShadow: '0 24px 70px rgba(0,0,0,0.6)',
          transform: `translateY(${(1 - sCard) * 200}px)`,
          opacity: Math.min(1, sCard * 1.9),
        }}
      >
        <div style={{fontSize: 68}}>🎥</div>
        <div style={{flex: 1}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: '#fff'}}>
            nagranie-surowe.mp4
          </div>
          <div style={{fontFamily: SANS, fontSize: 30, color: '#8b97a8', marginTop: 4}}>
            bez cięcia · bez efektów
          </div>
        </div>
      </div>

      {/* arrow */}
      <div
        style={{
          position: 'absolute',
          top: 972,
          width: '100%',
          textAlign: 'center',
          fontSize: 62,
          color: AMBER,
          transform: `translateY(${bob}px) scale(${0.4 + sArrow * 0.6})`,
          opacity: Math.min(1, sArrow * 2),
          textShadow: `0 0 26px ${AMBER}aa`,
        }}
      >
        ↓
      </div>

      {/* AI box with progress */}
      <div
        style={{
          position: 'absolute',
          top: 1060,
          left: 150,
          width: 780,
          background: 'linear-gradient(160deg, #14202e, #0b121c)',
          border: `3px solid ${ORANGE}`,
          borderRadius: 26,
          padding: '22px 30px',
          boxShadow: `0 24px 70px rgba(0,0,0,0.6), 0 0 34px ${ORANGE}44`,
          transform: `translateY(${(1 - sArrow) * 120}px)`,
          opacity: Math.min(1, sArrow * 1.8),
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          <div
            style={{
              fontFamily: HEAVY,
              fontWeight: 900,
              fontSize: 44,
              background: FIRE,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI
          </div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#cfd7e2', flex: 1}}>
            montuję…
          </div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: AMBER}}>
            {Math.round(prog * 100)}%
          </div>
        </div>
        <div
          style={{
            marginTop: 16,
            height: 16,
            borderRadius: 16,
            backgroundColor: '#1b2634',
            overflow: 'hidden',
          }}
        >
          <div style={{height: '100%', width: `${prog * 100}%`, background: FIRE}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- 9. sequential ✗ chips ----------

const Chip: React.FC<{delay: number; text: string; y: number}> = ({delay, text, y}) => {
  const s = useSp(delay, 12, 165);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        transform: `translateX(${(1 - s) * -640}px)`,
        opacity: Math.min(1, s * 1.9),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          backgroundColor: '#0f1620f2',
          border: `3px solid ${RED}`,
          borderRadius: 999,
          padding: '12px 32px',
          boxShadow: '0 16px 44px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{fontSize: 38, color: RED, fontWeight: 900}}>✗</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: '#fff', whiteSpace: 'nowrap'}}>
          {text}
        </span>
      </div>
    </div>
  );
};

export const RawChips: React.FC = () => {
  const out = useOut();
  // 4 chipy zamiast 5: stos musi zmiescic sie miedzy koszulka (896) a pasem napisow (~1300)
  const items = [
    {t: 0.30, text: 'bez cięcia'},
    {t: 1.20, text: 'bez efektów'},
    {t: 2.70, text: 'przerwy'},
    {t: 4.30, text: 'powtórki'},
  ];
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      {items.map((it, i) => (
        <Chip key={i} delay={s2f(it.t)} text={it.text} y={884 + i * 86} />
      ))}
    </AbsoluteFill>
  );
};

// ---------- 10. FULLSCREEN checklist: AI załatwia wszystko ----------

const CheckRow: React.FC<{delay: number; label: string; y: number}> = ({delay, label, y}) => {
  const s = useSp(delay, 13, 140);
  const sTick = useSp(delay + 8, 10, 210);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 120,
        width: 840,
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        backgroundColor: '#101a26e8',
        border: '2px solid #22303f',
        borderRadius: 22,
        padding: '18px 28px',
        boxShadow: '0 16px 46px rgba(0,0,0,0.5)',
        transform: `translateX(${(1 - s) * -760}px)`,
        opacity: Math.min(1, s * 1.9),
      }}
    >
      <div
        style={{
          width: 62,
          height: 62,
          borderRadius: 62,
          backgroundColor: GREEN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 38,
          color: '#06210f',
          fontWeight: 900,
          transform: `scale(${0.2 + sTick * 0.8})`,
          boxShadow: `0 0 26px ${GREEN}77`,
        }}
      >
        ✓
      </div>
      <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 60, color: '#fff', letterSpacing: -1}}>
        {label}
      </div>
    </div>
  );
};

export const FsChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const sTitle = useSp(2, 12, 150);
  const prog = interpolate(frame, [s2f(2.3), durationInFrames - 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // rows land exactly on: napisów 36.54, cięć 37.32, zoomów 37.84, efektów 38.38 (seq starts 34.10)
  const rows = [
    {t: 2.34, label: 'NAPISY'},
    {t: 3.12, label: 'CIĘCIA'},
    {t: 3.64, label: 'ZOOMY'},
    {t: 4.18, label: 'EFEKTY'},
  ];
  return (
    <AbsoluteFill>
      <EchoBg glow={GREEN} />
      <div
        style={{
          position: 'absolute',
          top: 400,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 54,
          color: '#aeb8c6',
          opacity: Math.min(1, sTitle * 1.6),
        }}
      >
        AI samo załatwia
      </div>
      <div
        style={{
          position: 'absolute',
          top: 478,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 108,
          letterSpacing: -2,
          color: '#fff',
          transform: `scale(${0.6 + sTitle * 0.4})`,
          opacity: Math.min(1, sTitle * 2),
          textShadow: '0 8px 40px rgba(0,0,0,0.7)',
        }}
      >
        CAŁĄ&nbsp;ROBOTĘ
      </div>
      {rows.map((r, i) => (
        <CheckRow key={i} delay={s2f(r.t)} label={r.label} y={760 + i * 132} />
      ))}
      {/* progress bar */}
      <div
        style={{
          position: 'absolute',
          top: 1370,
          left: 120,
          width: 840,
          height: 18,
          borderRadius: 18,
          backgroundColor: '#18222f',
          overflow: 'hidden',
        }}
      >
        <div style={{height: '100%', width: `${prog * 100}%`, background: FIRE}} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1408,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 34,
          color: '#8b97a8',
        }}
      >
        {Math.round(prog * 100)}% gotowe
      </div>
    </AbsoluteFill>
  );
};

// ---------- 11. meta badge: to nagranie zmontowało AI ----------

export const MetaBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const sIn = useSp(0, 12, 155);
  const out = useOut();
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div
        style={{
          position: 'absolute',
          top: 900,
          left: 105,
          width: 870,
          borderRadius: 30,
          padding: 4,
          background: FIRE,
          boxShadow: `0 24px 76px rgba(0,0,0,0.65), 0 0 ${22 + pulse * 30}px ${ORANGE}66`,
          transform: `translateY(${(1 - sIn) * 230}px) scale(${0.86 + sIn * 0.14})`,
          opacity: Math.min(1, sIn * 1.9),
        }}
      >
        <div style={{backgroundColor: '#0b121b', borderRadius: 26, padding: '26px 32px'}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: AMBER, letterSpacing: 2}}>
            TA ROLKA, KTÓRĄ OGLĄDASZ
          </div>
          <div
            style={{
              fontFamily: HEAVY,
              fontWeight: 900,
              fontSize: 66,
              color: '#fff',
              letterSpacing: -1,
              marginTop: 8,
              lineHeight: 1.05,
            }}
          >
            ZMONTOWANA<br />PRZEZ AI
          </div>
        </div>
      </div>
      <Burst t0={6} cx={540} cy={1020} color={AMBER} />
    </AbsoluteFill>
  );
};

// ---------- 12. FULLSCREEN price: tysiące -> 0 zł ----------

export const FsPrice: React.FC = () => {
  const frame = useCurrentFrame();
  const sOld = useSp(4, 13, 140);
  const sNew = useSp(72, 10, 200);
  const strike = interpolate(frame, [44, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill>
      <EchoBg glow={GREEN} />
      <div
        style={{
          position: 'absolute',
          top: 470,
          width: '100%',
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 54,
          color: '#aeb8c6',
        }}
      >
        montażysta co miesiąc
      </div>
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center'}}>
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 128,
            color: '#8e9aab',
            letterSpacing: -3,
            transform: `scale(${0.6 + sOld * 0.4})`,
          }}
        >
          TYSIĄCE ZŁ
          <span
            style={{
              position: 'absolute',
              left: -12,
              right: -12,
              top: '52%',
              height: 14,
              backgroundColor: RED,
              borderRadius: 8,
              transformOrigin: 'left center',
              transform: `scaleX(${strike}) rotate(-2deg)`,
              boxShadow: `0 0 28px ${RED}cc`,
            }}
          />
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 800,
          width: '100%',
          textAlign: 'center',
          fontSize: 70,
          color: '#5b6779',
          opacity: Math.min(1, sNew * 1.4),
        }}
      >
        ↓
      </div>
      <div
        style={{
          position: 'absolute',
          top: 900,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 210,
          letterSpacing: -6,
          color: GREEN,
          transform: `scale(${0.4 + sNew * 0.6})`,
          opacity: Math.min(1, sNew * 2),
          textShadow: `0 0 ${28 + pulse * 40}px ${GREEN}88, 0 12px 50px rgba(0,0,0,0.7)`,
        }}
      >
        0 ZŁ
      </div>
      <div
        style={{
          position: 'absolute',
          top: 1160,
          width: '100%',
          textAlign: 'center',
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 44,
          color: '#cfd7e2',
          opacity: Math.min(1, sNew * 1.6),
        }}
      >
        za montaż Twoich rolek
      </div>
      <Burst t0={74} cx={540} cy={1000} color={GREEN} />
    </AbsoluteFill>
  );
};

// ---------- 13. chill chips (leżysz / czytasz / kawa) + payoff ----------

const ChillChip: React.FC<{delay: number; icon: string; text: string; y: number}> = ({
  delay,
  icon,
  text,
  y,
}) => {
  const s = useSp(delay, 12, 165);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        transform: `translateX(${(1 - s) * 640}px)`,
        opacity: Math.min(1, s * 1.9),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          backgroundColor: '#0f1620f2',
          border: `3px solid ${GREEN}`,
          borderRadius: 999,
          padding: '14px 36px',
          boxShadow: `0 16px 44px rgba(0,0,0,0.6), 0 0 24px ${GREEN}33`,
        }}
      >
        <span style={{fontSize: 42}}>{icon}</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 44, color: '#fff', whiteSpace: 'nowrap'}}>
          {text}
        </span>
      </div>
    </div>
  );
};

export const ChillChips: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useOut();
  // chipy znikaja, payoff wchodzi na ICH miejsce (nie pod nimi) - przenikanie, nie przerwa;
  // spring startuje 4.00 zeby napis byl pelny dokladnie na slowie "proste" (55.04s = local 4.24)
  const swap = s2f(4.0);
  const sFinal = useSp(s2f(4.0), 10, 195);
  const chipsOut = interpolate(frame, [swap, swap + 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <AbsoluteFill style={{opacity: 1 - chipsOut}}>
        <ChillChip delay={s2f(0.42)} icon="🛋️" text="leżysz" y={896} />
        <ChillChip delay={s2f(1.32)} icon="📖" text="czytasz" y={988} />
        <ChillChip delay={s2f(2.92)} icon="☕" text="pijesz kawę" y={1080} />
      </AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 952,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 96,
          letterSpacing: -2,
          transform: `scale(${0.45 + sFinal * 0.55})`,
          opacity: Math.min(1, sFinal * 2),
          background: FIRE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        MEGA&nbsp;PROSTE
      </div>
      <Burst t0={s2f(4.06)} cx={540} cy={1010} color={AMBER} />
    </AbsoluteFill>
  );
};

// ---------- 14. CTA card ----------

export const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(0, 14, 130);
  const sBtn = useSp(26, 11, 175);
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  const bob = Math.sin(frame / 7) * 9;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 830,
          left: 95,
          width: 890,
          borderRadius: 34,
          padding: 4,
          background: FIRE,
          boxShadow: `0 28px 90px rgba(0,0,0,0.7), 0 0 ${24 + pulse * 34}px ${ORANGE}66`,
          transform: `translateY(${(1 - sCard) * 320}px) scale(${0.88 + sCard * 0.12})`,
          opacity: Math.min(1, sCard * 1.8),
        }}
      >
        <div style={{backgroundColor: '#0a1119', borderRadius: 30, padding: '30px 34px'}}>
          <div
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 34,
              color: AMBER,
              letterSpacing: 2,
              textAlign: 'center',
            }}
          >
            CHCESZ TAK SAMO?
          </div>
          <div
            style={{
              marginTop: 18,
              borderRadius: 22,
              background: FIRE,
              padding: '22px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
              transform: `scale(${0.82 + sBtn * 0.18})`,
              opacity: Math.min(1, sBtn * 1.9),
              boxShadow: `0 0 ${18 + pulse * 30}px ${AMBER}77`,
            }}
          >
            <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 54, color: '#1a0a04'}}>
              DOWIEDZ SIĘ WIĘCEJ
            </span>
          </div>
          <div
            style={{
              marginTop: 16,
              textAlign: 'center',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 34,
              color: '#98a3b3',
            }}
          >
            przycisk poniżej ↓
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- cut flash (masks hard cuts back from cutaways) ----------

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 9], [0.55, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{backgroundColor: '#fff', opacity: o}} />;
};

// ---------- brand bug ----------

const BrandBug: React.FC = () => (
  <Img
    src={staticFile('brand-bug.png')}
    style={{
      position: 'absolute',
      top: 84,
      right: 48,
      width: 208,
      opacity: 0.82,
      filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.55))',
    }}
  />
);

// ---------- MASTER: full 59.6s effect track ----------

const Seq: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={s2f(from)} durationInFrames={s2f(to) - s2f(from)}>
    {children}
  </Sequence>
);

export const Rolka1Fx: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* brand bug first so opaque cutaways cover it */}
      <Sequence from={0} durationInFrames={s2f(59.6)}>
        <BrandBug />
      </Sequence>

      {/* --- 0.20-3.05  hook slam --- */}
      <Seq from={0.2} to={3.05}>
        <TwoWordSlam w1="SZKODA MI" w2="MONTAŻYSTÓW" switchAt={s2f(1.4)} size1={124} size2={92} />
      </Seq>

      {/* --- 3.60-6.35  FULLSCREEN countdown --- */}
      <Seq from={3.6} to={6.35}>
        <FsMinutes />
      </Seq>

      {/* --- 8.40-11.00  Hollywood struck out --- */}
      <Seq from={8.4} to={11.0}>
        <StrikeWord kicker="chyba że chcesz efekty jak w" word="HOLLYWOOD" />
      </Seq>

      {/* --- 11.60-13.40  nie musisz --- */}
      <Seq from={11.6} to={13.4}>
        <Pill icon="🚫" text="NIE MUSISZ SIĘ UCZYĆ" accent={AMBER} top={1000} />
      </Seq>

      {/* --- 14.60-17.40  FULLSCREEN content grid --- */}
      <Seq from={14.6} to={17.4}>
        <FsContent />
      </Seq>

      {/* --- 18.30-21.90  hours count-up --- */}
      <Seq from={18.3} to={21.9}>
        <HoursCard />
      </Seq>

      {/* --- 21.96-24.60  FULLSCREEN chapter --- */}
      <Seq from={21.96} to={24.6}>
        <FsChapter />
      </Seq>

      {/* --- 25.20-28.85  raw file -> AI --- */}
      <Seq from={25.2} to={28.85}>
        <FileDrop />
      </Seq>

      {/* --- 28.95-34.00  ✗ chips --- */}
      <Seq from={28.95} to={34.0}>
        <RawChips />
      </Seq>

      {/* --- 34.10-38.95  FULLSCREEN checklist --- */}
      <Seq from={34.1} to={38.95}>
        <FsChecklist />
      </Seq>

      {/* --- 39.10-41.70  meta badge --- */}
      <Seq from={39.1} to={41.7}>
        <MetaBadge />
      </Seq>

      {/* --- 42.20-44.05  zero umiejętności --- */}
      <Seq from={42.2} to={44.05}>
        <Pill icon="🎯" text="ZERO UMIEJĘTNOŚCI" accent={AMBER} top={1000} />
      </Seq>

      {/* --- 44.30-47.40  FULLSCREEN price --- */}
      <Seq from={44.3} to={47.4}>
        <FsPrice />
      </Seq>

      {/* --- 47.90-50.40  zero męczenia --- */}
      <Seq from={47.9} to={50.4}>
        <Pill icon="😌" text="ZERO MĘCZENIA SIĘ" accent={GREEN} top={1000} />
      </Seq>

      {/* --- 50.80-56.30  chill chips + payoff --- */}
      <Seq from={50.8} to={56.3}>
        <ChillChips />
      </Seq>

      {/* --- 56.75-59.60  CTA --- */}
      <Seq from={56.75} to={59.6}>
        <CtaCard />
      </Seq>

      {/* --- cut flashes: open + every return from a cutaway --- */}
      {[0.02, 6.35, 17.4, 24.6, 38.95, 47.4].map((t) => (
        <Sequence key={t} from={s2f(t)} durationInFrames={10}>
          <Flash />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
