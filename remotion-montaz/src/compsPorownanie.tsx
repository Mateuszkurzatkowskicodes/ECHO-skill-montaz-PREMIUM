import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, random} from 'remotion';

const AMBER = '#FFB13D';
const ORANGE = '#FF4A2D';
const DEEP = '#E0290F';
const CYAN = '#38B6D8';
const INKTX = '#161b22';
const HEAVY = "'Arial Black', 'Segoe UI', Arial, sans-serif";
const SANS = "Bahnschrift, 'Segoe UI', Arial, sans-serif";
const FIRE = `linear-gradient(150deg, ${AMBER}, ${ORANGE} 55%, ${DEEP})`;

// ---------- jasne tlo z efektami ----------

const LightBg: React.FC = () => {
  const frame = useCurrentFrame();
  const d1 = Math.sin(frame / 120) * 90;
  const d2 = Math.cos(frame / 150) * 80;
  return (
    <AbsoluteFill style={{backgroundColor: '#f3efe9'}}>
      {/* miekki gradient bazowy */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, #ffffff 0%, #f1ece4 55%, #efe7dc 100%)'}} />
      {/* kolorowe blobki (dryf) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(760px 760px at ${230 + d1}px ${430 - d2}px, ${ORANGE}22 0%, transparent 68%), radial-gradient(720px 720px at ${880 - d1}px ${1520 + d2}px, ${CYAN}1f 0%, transparent 68%), radial-gradient(640px 640px at ${560 + d2}px ${960 + d1}px, ${AMBER}1c 0%, transparent 70%)`,
        }}
      />
      {/* delikatna siatka */}
      <AbsoluteFill
        style={{
          opacity: 0.35,
          backgroundImage: 'linear-gradient(#00000010 1px, transparent 1px), linear-gradient(90deg, #00000010 1px, transparent 1px)',
          backgroundSize: '108px 108px',
          backgroundPosition: `0px ${(frame * 0.1) % 108}px`,
        }}
      />
      {/* unoszace sie czastki */}
      {Array.from({length: 26}).map((_, i) => {
        const seed = i + 1;
        const x = random(`x${seed}`) * 1080;
        const speed = 18 + random(`s${seed}`) * 34;
        const size = 6 + random(`z${seed}`) * 16;
        const y = ((random(`y${seed}`) * 1920 - frame * speed * 0.35) % 2000 + 2000) % 2000 - 40;
        const warm = random(`c${seed}`) > 0.5;
        const op = 0.10 + random(`o${seed}`) * 0.14;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: size,
              background: warm ? ORANGE : CYAN,
              opacity: op,
              filter: 'blur(1px)',
            }}
          />
        );
      })}
      {/* ziarno */}
      <AbsoluteFill
        style={{
          opacity: 0.04,
          backgroundImage: 'radial-gradient(circle at 20% 30%, #000 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #000 0.5px, transparent 1px)',
          backgroundSize: '6px 6px, 9px 9px',
          backgroundPosition: `${(frame * 37) % 100}px ${(frame * 61) % 100}px`,
        }}
      />
      {/* miekka winieta jasna */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 300px 120px rgba(255,255,255,0.55)'}} />
    </AbsoluteFill>
  );
};

const PANEL_W = 506;
const PANEL_H = Math.round(PANEL_W * (16 / 9)); // 900
const GAP = 30;
const PANEL_Y = 500;
const LEFT_X = (1080 - (PANEL_W * 2 + GAP)) / 2;
const RIGHT_X = LEFT_X + PANEL_W + GAP;

const Panel: React.FC<{src: string; x: number; delay: number; fire?: boolean; tilt: number; audio?: boolean}> = ({
  src,
  x,
  delay,
  fire,
  tilt,
  audio,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 120, mass: 0.9}});
  const pulse = 0.5 + Math.sin(frame / 8) * 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: PANEL_Y,
        width: PANEL_W,
        height: PANEL_H,
        borderRadius: 38,
        padding: fire ? 7 : 12,
        background: fire ? FIRE : '#ffffff',
        boxShadow: fire
          ? `0 34px 70px rgba(224,41,15,0.28), 0 0 ${22 + pulse * 40}px ${ORANGE}55`
          : '0 30px 60px rgba(40,40,60,0.20)',
        transform: `translateY(${(1 - s) * 60}px) rotate(${tilt * (1 - s)}deg) scale(${0.9 + s * 0.1})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: fire ? 32 : 28, overflow: 'hidden', position: 'relative', backgroundColor: '#000'}}>
        <OffthreadVideo src={staticFile(src)} muted={!audio} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 30%)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};

const Label: React.FC<{x: number; delay: number; icon: string; text: string; fire?: boolean}> = ({x, delay, icon, text, fire}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 12, stiffness: 160}});
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: PANEL_Y + PANEL_H + 30,
        width: PANEL_W,
        display: 'flex',
        justifyContent: 'center',
        transform: `scale(${0.6 + s * 0.4})`,
        opacity: Math.min(1, s * 2),
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderRadius: 999,
          padding: '18px 44px',
          background: fire ? FIRE : '#ffffff',
          border: fire ? 'none' : '3px solid #d7d0c6',
          boxShadow: fire ? `0 16px 40px rgba(224,41,15,0.35), 0 0 ${16 + pulse * 26}px ${ORANGE}66` : '0 12px 30px rgba(40,40,60,0.16)',
        }}
      >
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 54,
            backgroundColor: fire ? 'rgba(255,255,255,0.95)' : '#f0ece5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
          }}
        >
          {icon}
        </div>
        <span
          style={{
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 50,
            color: fire ? '#ffffff' : '#5a5248',
            letterSpacing: -1,
            textShadow: fire ? '0 2px 6px rgba(120,20,0,0.4)' : 'none',
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};

export const Porownanie: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sTitle = spring({frame, fps, config: {damping: 13, stiffness: 140}});
  const sVs = spring({frame: frame - 24, fps, config: {damping: 9, stiffness: 200}});
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  const spin = frame * 0.6;
  return (
    <AbsoluteFill>
      <LightBg />

      {/* tytul */}
      <div style={{position: 'absolute', top: 158, width: '100%', textAlign: 'center', opacity: Math.min(1, sTitle * 1.6), transform: `translateY(${(1 - sTitle) * -30}px)`}}>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: '#9a9184', letterSpacing: 8}}>TEN SAM MATERIAŁ</div>
        <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 100, letterSpacing: -2, marginTop: 4, color: INKTX}}>
          SUROWO{' '}
          <span style={{background: FIRE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>vs AI</span>
        </div>
      </div>

      {/* panele */}
      <Panel src="r-cmp-raw.mp4" x={LEFT_X} delay={6} tilt={-3} />
      <Panel src="r-cmp-ai.mp4" x={RIGHT_X} delay={14} fire tilt={3} audio />

      {/* labelki */}
      <Label x={LEFT_X} delay={20} icon="😐" text="BEZ AI" />
      <Label x={RIGHT_X} delay={26} icon="🔥" text="Z AI" fire />

      {/* VS badge */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 82,
          top: PANEL_Y + PANEL_H / 2 - 82,
          width: 164,
          height: 164,
          borderRadius: 164,
          padding: 6,
          background: FIRE,
          boxShadow: `0 22px 50px rgba(224,41,15,0.35), 0 0 ${20 + pulse * 40}px ${ORANGE}66`,
          transform: `scale(${0.3 + sVs * 0.7}) rotate(${(1 - sVs) * -40}deg)`,
          opacity: Math.min(1, sVs * 2),
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 999, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 66, letterSpacing: -2, background: FIRE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>VS</span>
        </div>
      </div>

      {/* dolny podpis */}
      <div style={{position: 'absolute', bottom: 156, width: '100%', textAlign: 'center', opacity: Math.min(1, sTitle * 1.4)}}>
        <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 60, letterSpacing: -1, background: FIRE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
          RÓŻNICĘ ROBI AI
        </div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#8a8175', marginTop: 8}}>ten sam surowy plik, dwa światy</div>
      </div>

      {/* brand bug (ciemny, czyta sie na bieli) */}
      <Img src={staticFile('brand-bug.png')} style={{position: 'absolute', top: 60, right: 44, width: 196, opacity: 0.92, filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.22))'}} />
    </AbsoluteFill>
  );
};
