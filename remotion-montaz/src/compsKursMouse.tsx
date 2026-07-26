import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  interpolate,
  spring,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Waypoint kursora. x,y w przestrzeni 1920x1080. click => impuls + ring.
export type WP = {x: number; y: number; t: number; click?: boolean};
// Highlight prostokąt (podświetlenie celu) pojawiający się w danym czasie.
export type HL = {x: number; y: number; w: number; h: number; from: number; to: number; label?: string; labelSide?: 'right' | 'top'};

type Props = {
  src: string;
  waypoints: WP[];
  highlights?: HL[];
  zoomTo?: {x: number; y: number; scale: number}; // Ken Burns cel
  command?: {text: string; from: number; kicker?: string; y?: number}; // komenda pokazana na ekranie
};

const FIRE = 'linear-gradient(150deg,#FFB13D,#FF4A2D 55%,#E0290F)';
const HEAVY = "'Bahnschrift','Arial Black','Segoe UI',sans-serif";

// kursor strzałka (Windows-like), biały z ciemnym obrysem
const Cursor: React.FC<{press: number}> = ({press}) => {
  const s = 1 - 0.16 * press;
  return (
    <svg width={44} height={62} viewBox="0 0 44 62" style={{transform: `scale(${s})`, transformOrigin: '4px 4px', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,.45))'}}>
      <path d="M4 3 L4 44 L15 34 L22 50 L30 46 L23 30 L38 30 Z" fill="#fff" stroke="#14181f" strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
};

const easeSeg = (frame: number, a: WP, b: WP, key: 'x' | 'y') =>
  interpolate(frame, [a.t, b.t], [a[key], b[key]], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

const FIRE2 = 'linear-gradient(150deg,#FFB13D,#FF4A2D 55%,#E0290F)';
const MONO = "'Consolas','Cascadia Mono','Courier New',monospace";

const CommandChip: React.FC<{cmd: NonNullable<Props['command']>}> = ({cmd}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - cmd.from, fps, config: {damping: 13, mass: 0.7, stiffness: 130}});
  const op = interpolate(frame - cmd.from, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const scale = interpolate(s, [0, 1], [0.6, 1]);
  const caret = Math.floor((frame - cmd.from) / 18) % 2 === 0 ? 1 : 0;
  const y = cmd.y ?? 360;
  const len = cmd.text.length;
  const fsz = len <= 6 ? 92 : len <= 14 ? 66 : 50;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        opacity: op,
        transform: `scale(${scale})`,
      }}
    >
      {cmd.kicker && (
        <div
          style={{
            fontFamily: "'Bahnschrift','Segoe UI',sans-serif",
            fontWeight: 800,
            fontSize: 26,
            letterSpacing: 4,
            color: '#fff',
            background: FIRE2,
            padding: '8px 20px',
            borderRadius: 10,
            marginBottom: 18,
            boxShadow: '0 10px 26px rgba(255,74,45,.4)',
          }}
        >
          {cmd.kicker}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          background: 'rgba(15,18,24,.97)',
          border: '2px solid rgba(255,120,60,.55)',
          borderRadius: 22,
          padding: '26px 46px',
          boxShadow: '0 30px 80px rgba(0,0,0,.5)',
        }}
      >
        <span style={{fontFamily: MONO, fontSize: fsz * 0.8, fontWeight: 700, color: '#FF7A45'}}>❯</span>
        <span style={{fontFamily: MONO, fontSize: fsz, fontWeight: 700, color: '#fff', letterSpacing: 2}}>{cmd.text}</span>
        <span style={{width: fsz * 0.28, height: fsz * 0.85, background: '#FF7A45', opacity: caret, borderRadius: 3}} />
      </div>
    </div>
  );
};

export const MouseScreen: React.FC<Props> = ({src, waypoints, highlights = [], zoomTo, command}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // pozycja kursora wg segmentu
  let cx = waypoints[0].x;
  let cy = waypoints[0].y;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const a = waypoints[i];
    const b = waypoints[i + 1];
    if (frame >= a.t) {
      cx = easeSeg(frame, a, b, 'x');
      cy = easeSeg(frame, a, b, 'y');
    }
  }

  // impuls klika: najbliższy click-waypoint
  let press = 0;
  const rings: {r: number; op: number}[] = [];
  waypoints.forEach((w) => {
    if (!w.click) return;
    const d = frame - w.t;
    if (d >= 0 && d < 10) press = Math.max(press, Math.sin((d / 10) * Math.PI));
    if (d >= 0 && d < 26) {
      rings.push({
        r: interpolate(d, [0, 26], [8, 70], {extrapolateRight: 'clamp'}),
        op: interpolate(d, [0, 26], [0.55, 0], {extrapolateRight: 'clamp'}),
      });
    }
  });

  // Ken Burns: delikatny zoom w stronę celu
  const kb = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateRight: 'clamp'});
  const scale = zoomTo ? 1 + (zoomTo.scale - 1) * kb : 1;
  const ox = zoomTo ? (zoomTo.x - 960) * (scale - 1) : 0;
  const oy = zoomTo ? (zoomTo.y - 540) * (scale - 1) : 0;

  const introOp = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#0b0d12'}}>
      <AbsoluteFill style={{transform: `translate(${-ox}px,${-oy}px) scale(${scale})`, opacity: introOp}}>
        <Img src={staticFile(src)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
        {/* highlighty */}
        {highlights.map((h, i) => {
          const op = interpolate(frame, [h.from, h.from + 8, h.to - 8, h.to], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const pulse = 1 + 0.02 * Math.sin(frame / 6);
          return (
            <div key={i} style={{position: 'absolute', left: h.x, top: h.y, width: h.w, height: h.h, opacity: op}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 12,
                  border: '4px solid #FF4A2D',
                  boxShadow: '0 0 0 4px rgba(255,74,45,.25), 0 10px 30px rgba(255,74,45,.35)',
                  transform: `scale(${pulse})`,
                }}
              />
              {h.label && (
                <div
                  style={{
                    position: 'absolute',
                    left: h.labelSide === 'top' ? 0 : h.w + 22,
                    top: h.labelSide === 'top' ? -60 : h.h / 2 - 24,
                    fontFamily: HEAVY,
                    fontWeight: 800,
                    fontSize: 26,
                    color: '#fff',
                    background: FIRE,
                    padding: '6px 16px',
                    borderRadius: 10,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 8px 20px rgba(0,0,0,.3)',
                  }}
                >
                  {h.label}
                </div>
              )}
            </div>
          );
        })}
        {/* rings klika */}
        {rings.map((r, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: cx - r.r,
              top: cy - r.r,
              width: r.r * 2,
              height: r.r * 2,
              borderRadius: '50%',
              border: '3px solid #FF4A2D',
              opacity: r.op,
            }}
          />
        ))}
        {/* kursor */}
        <div style={{position: 'absolute', left: cx, top: cy}}>
          <Cursor press={press} />
        </div>
      </AbsoluteFill>
      {/* komenda na wierzchu (poza zoomem) */}
      {command && <CommandChip cmd={command} />}
    </AbsoluteFill>
  );
};
