import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';

// ---------- ECHO tokens ----------
const AMBER = '#FFB13D';
const ORANGE = '#FF4A2D';
const DEEP = '#E0290F';
const CYAN = '#38B6D8';
const INK = '#070B11';
const GREEN = '#4ED47A';
const RED = '#F0453B';
const HEAVY = "'Arial Black', 'Segoe UI', Arial, sans-serif";
const SANS = "Bahnschrift, 'Segoe UI', Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const FIRE = `linear-gradient(150deg, ${AMBER}, ${ORANGE} 55%, ${DEEP})`;
const FPS = 60;
const s2f = (s: number) => Math.round(s * FPS);
const PANEL_H = 1010;

const useSp = (delay: number, damping = 12, stiffness = 140) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.9}});
};
const useOut = (tail = 0.22) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const start = durationInFrames - Math.round(tail * fps);
  return interpolate(frame, [start, durationInFrames - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const x = (frame * 37) % 100;
  const y = (frame * 61) % 100;
  return (
    <AbsoluteFill
      style={{
        opacity: 0.06,
        backgroundImage: 'radial-gradient(circle at 20% 30%, #fff 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #fff 0.5px, transparent 1px)',
        backgroundSize: '7px 7px, 11px 11px',
        backgroundPosition: `${x}px ${y}px, ${-y}px ${x}px`,
      }}
    />
  );
};

const Burst: React.FC<{t0: number; cx: number; cy: number; color: string; n?: number}> = ({t0, cx, cy, color, n = 11}) => {
  const frame = useCurrentFrame();
  const local = frame - t0;
  if (local < 0 || local > 28) return null;
  const p = local / 28;
  return (
    <>
      {Array.from({length: n}).map((_, i) => {
        const ang = (i / n) * Math.PI * 2 + 0.35;
        const dist = 45 + p * 200;
        const size = 13 * (1 - p);
        return (
          <div key={i} style={{position: 'absolute', left: cx + Math.cos(ang) * dist, top: cy + Math.sin(ang) * dist * 0.72, width: size, height: size, borderRadius: size, backgroundColor: color, opacity: 1 - p}} />
        );
      })}
    </>
  );
};

// ---------- SPLIT-SCREEN panel (reels hook) ----------

const PanelShell: React.FC<{children: React.ReactNode; glow?: string; label?: string}> = ({children, glow = ORANGE, label}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 95) * 60;
  const sLabel = useSp(6, 13, 150);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: PANEL_H, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundColor: INK}} />
      <AbsoluteFill style={{background: `radial-gradient(820px 820px at ${250 + drift}px ${760 - drift}px, ${glow}24 0%, transparent 70%), radial-gradient(680px 680px at ${850 - drift}px ${220 + drift}px, ${CYAN}18 0%, transparent 70%)`}} />
      <AbsoluteFill style={{opacity: 0.05, backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '92px 92px', backgroundPosition: `0px ${(frame * 0.14) % 92}px`}} />
      <Grain />
      {children}
      {label ? (
        <div style={{position: 'absolute', left: 40, top: 34, display: 'flex', alignItems: 'center', gap: 12, backgroundColor: '#0c131de6', border: `2px solid ${glow}`, borderRadius: 999, padding: '10px 22px', transform: `translateX(${(1 - sLabel) * -320}px)`, opacity: Math.min(1, sLabel * 1.8)}}>
          <span style={{width: 12, height: 12, borderRadius: 12, backgroundColor: glow}} />
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: '#e8eef6', letterSpacing: 1}}>{label}</span>
        </div>
      ) : null}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 190px 60px rgba(0,0,0,0.55)'}} />
      <div style={{position: 'absolute', left: 0, top: PANEL_H - 8, width: 1080, height: 8, background: FIRE}} />
    </div>
  );
};

const PhoneClip: React.FC<{src: string; delay: number; x: number; y: number; w: number; rot: number}> = ({src, delay, x, y, w, rot}) => {
  const frame = useCurrentFrame();
  const s = useSp(delay, 13, 150);
  const float = Math.sin((frame - delay) / 30) * 6;
  const h = Math.round(w * (16 / 9));
  return (
    <div style={{position: 'absolute', left: x, top: y + float, width: w, height: h, borderRadius: 30, padding: 7, background: 'linear-gradient(160deg, #313d4c, #10171f)', boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 30px ${ORANGE}22`, transform: `scale(${0.6 + s * 0.4}) rotate(${rot * (1 - s) * 1.4 + rot * 0.2}deg)`, opacity: Math.min(1, s * 2.2)}}>
      <div style={{width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', position: 'relative'}}>
        <OffthreadVideo src={staticFile(src)} muted loop style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 34%)', pointerEvents: 'none'}} />
      </div>
    </div>
  );
};

export const ReelsPanel3: React.FC = () => {
  const frame = useCurrentFrame();
  const sTag = useSp(s2f(4.05), 11, 170); // "w parę minut" ~4.4s
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  const W = 322;
  const GAP = 24;
  const total = W * 3 + GAP * 2;
  const x0 = (1080 - total) / 2;
  const Y = 96;
  return (
    <PanelShell glow={ORANGE} label="MOJE ROLKI · ZMONTOWANE PRZEZ AI">
      <PhoneClip src="r2-clip-ad1.mp4" delay={2} x={x0} y={Y + 26} w={W} rot={-5} />
      <PhoneClip src="r2-clip-rolka1.mp4" delay={12} x={x0 + W + GAP} y={Y} w={W} rot={0} />
      <PhoneClip src="r2-clip-ad4.mp4" delay={22} x={x0 + (W + GAP) * 2} y={Y + 26} w={W} rot={5} />
      <div style={{position: 'absolute', top: 700, width: '100%', textAlign: 'center', fontFamily: HEAVY, fontWeight: 900, fontSize: 72, letterSpacing: -2, transform: `scale(${0.6 + sTag * 0.4})`, opacity: Math.min(1, sTag * 2), background: FIRE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: `drop-shadow(0 0 ${12 + pulse * 18}px ${ORANGE}55)`}}>
        W&nbsp;PARĘ&nbsp;MINUT
      </div>
      <Burst t0={s2f(4.1)} cx={540} cy={742} color={AMBER} />
    </PanelShell>
  );
};

// ---------- overlaye pelnoekranowe ----------

export const Pill: React.FC<{icon: string; text: string; accent?: string; top?: number}> = ({icon, text, accent = ORANGE, top = 1010}) => {
  const frame = useCurrentFrame();
  const sIn = useSp(0, 11, 175);
  const out = useOut();
  const bob = Math.sin(frame / 6) * 6;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 22, backgroundColor: '#101823f5', border: `4px solid ${accent}`, borderRadius: 999, padding: '20px 44px', boxShadow: `0 20px 64px rgba(0,0,0,0.6), 0 0 38px ${accent}55`, transform: `translateY(${(1 - sIn) * -280 + out * -280}px) scale(${0.72 + sIn * 0.28})`, opacity: Math.min(1, sIn * 1.9) * (1 - out)}}>
          <span style={{fontSize: 52, transform: `translateY(${bob}px)`}}>{icon}</span>
          <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 42, color: '#fff', whiteSpace: 'nowrap'}}>{text}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{delay: number; text: string; y: number; accent: string; mark: string}> = ({delay, text, y, accent, mark}) => {
  const s = useSp(delay, 12, 165);
  return (
    <div style={{position: 'absolute', top: y, width: '100%', display: 'flex', justifyContent: 'center', transform: `translateX(${(1 - s) * -640}px)`, opacity: Math.min(1, s * 1.9)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, backgroundColor: '#0f1620f2', border: `3px solid ${accent}`, borderRadius: 999, padding: '12px 32px', boxShadow: '0 16px 44px rgba(0,0,0,0.6)'}}>
        <span style={{fontSize: 38, color: accent, fontWeight: 900}}>{mark}</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: '#fff', whiteSpace: 'nowrap'}}>{text}</span>
      </div>
    </div>
  );
};

export const NoChips: React.FC = () => {
  const out = useOut();
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Chip delay={s2f(0.30)} text="ręcznego cięcia" y={952} accent={RED} mark="✗" />
      <Chip delay={s2f(2.10)} text="wynajmowania montażysty" y={1044} accent={RED} mark="✗" />
      <Chip delay={s2f(4.00)} text="godzin nad montażem" y={1136} accent={RED} mark="✗" />
    </AbsoluteFill>
  );
};

// ---------- FULLSCREEN checklist: napisy/efekty/muzyka ----------

const CheckRow: React.FC<{delay: number; label: string; y: number}> = ({delay, label, y}) => {
  const s = useSp(delay, 13, 140);
  const sTick = useSp(delay + 7, 10, 210);
  return (
    <div style={{position: 'absolute', top: y, left: 130, width: 820, display: 'flex', alignItems: 'center', gap: 26, backgroundColor: '#101a26e8', border: '2px solid #22303f', borderRadius: 22, padding: '18px 30px', boxShadow: '0 16px 46px rgba(0,0,0,0.5)', transform: `translateX(${(1 - s) * -760}px)`, opacity: Math.min(1, s * 1.9)}}>
      <div style={{width: 62, height: 62, borderRadius: 62, backgroundColor: GREEN, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 38, color: '#06210f', fontWeight: 900, transform: `scale(${0.2 + sTick * 0.8})`, boxShadow: `0 0 26px ${GREEN}77`}}>✓</div>
      <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 64, color: '#fff', letterSpacing: -1}}>{label}</div>
    </div>
  );
};

const EchoBg: React.FC<{glow?: string}> = ({glow = ORANGE}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 95) * 70;
  return (
    <AbsoluteFill style={{backgroundColor: INK}}>
      <AbsoluteFill style={{background: `radial-gradient(950px 950px at ${260 + drift}px ${1480 - drift}px, ${glow}2b 0%, transparent 70%), radial-gradient(780px 780px at ${860 - drift}px ${360 + drift}px, ${CYAN}1c 0%, transparent 70%)`}} />
      <AbsoluteFill style={{opacity: 0.06, backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '92px 92px', backgroundPosition: `0px ${(frame * 0.16) % 92}px`}} />
      <Grain />
      <AbsoluteFill style={{boxShadow: 'inset 0 0 360px 130px rgba(0,0,0,0.88)'}} />
    </AbsoluteFill>
  );
};

export const FsChecklist: React.FC = () => {
  const sTitle = useSp(2, 12, 150);
  // slowa: Napisy 16.58, efekty 17.12, muzyka 17.84, wszystko 18.4 (seq start 16.5)
  const rows = [
    {t: 0.08, label: 'NAPISY'},
    {t: 0.62, label: 'EFEKTY'},
    {t: 1.34, label: 'MUZYKA'},
  ];
  return (
    <AbsoluteFill>
      <EchoBg glow={GREEN} />
      <div style={{position: 'absolute', top: 470, width: '100%', textAlign: 'center', fontFamily: SERIF, fontStyle: 'italic', fontSize: 54, color: '#aeb8c6', opacity: Math.min(1, sTitle * 1.6)}}>AI ogarnia</div>
      <div style={{position: 'absolute', top: 548, width: '100%', textAlign: 'center', fontFamily: HEAVY, fontWeight: 900, fontSize: 116, letterSpacing: -2, color: '#fff', transform: `scale(${0.6 + sTitle * 0.4})`, opacity: Math.min(1, sTitle * 2), textShadow: '0 8px 40px rgba(0,0,0,0.7)'}}>WSZYSTKO</div>
      {rows.map((r, i) => (
        <CheckRow key={i} delay={s2f(r.t)} label={r.label} y={780 + i * 150} />
      ))}
      <Burst t0={s2f(1.9)} cx={540} cy={1140} color={GREEN} />
    </AbsoluteFill>
  );
};

// ---------- meta badge: nawet ta rolka ----------

export const MetaBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const sIn = useSp(0, 12, 155);
  const out = useOut();
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 980, left: 105, width: 870, borderRadius: 30, padding: 4, background: FIRE, boxShadow: `0 24px 76px rgba(0,0,0,0.65), 0 0 ${22 + pulse * 30}px ${ORANGE}66`, transform: `translateY(${(1 - sIn) * 230}px) scale(${0.86 + sIn * 0.14})`, opacity: Math.min(1, sIn * 1.9)}}>
        <div style={{backgroundColor: '#0b121b', borderRadius: 26, padding: '24px 32px'}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: AMBER, letterSpacing: 2}}>TA ROLKA, KTÓRĄ OGLĄDASZ</div>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 60, color: '#fff', letterSpacing: -1, marginTop: 8, lineHeight: 1.05}}>TEŻ ZMONTOWAŁO AI</div>
        </div>
      </div>
      <Burst t0={6} cx={540} cy={1090} color={AMBER} />
    </AbsoluteFill>
  );
};

export const CoffeeCard: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(0, 13, 140);
  const out = useOut();
  const bob = Math.sin(frame / 22) * 8;
  const pulse = 0.5 + Math.sin(frame / 8) * 0.5;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 980, left: 120, width: 840, borderRadius: 30, padding: '26px 32px', backgroundColor: '#0d151fee', border: `3px solid ${GREEN}`, boxShadow: `0 24px 76px rgba(0,0,0,0.65), 0 0 ${18 + pulse * 24}px ${GREEN}33`, transform: `translateY(${(1 - sCard) * 240}px) scale(${0.88 + sCard * 0.12})`, opacity: Math.min(1, sCard * 1.9), display: 'flex', alignItems: 'center', gap: 28}}>
        <div style={{fontSize: 96, transform: `translateY(${bob}px)`}}>☕</div>
        <div>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 62, color: '#fff', letterSpacing: -1, lineHeight: 1}}>TY PIJESZ KAWĘ</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: GREEN, marginTop: 8}}>AI montuje w innym pokoju</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const CtaCard: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(0, 14, 130);
  const sBtn = useSp(20, 11, 175);
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top: 900, left: 95, width: 890, borderRadius: 34, padding: 4, background: FIRE, boxShadow: `0 28px 90px rgba(0,0,0,0.7), 0 0 ${24 + pulse * 34}px ${ORANGE}66`, transform: `translateY(${(1 - sCard) * 320}px) scale(${0.88 + sCard * 0.12})`, opacity: Math.min(1, sCard * 1.8)}}>
        <div style={{backgroundColor: '#0a1119', borderRadius: 30, padding: '28px 34px'}}>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: AMBER, letterSpacing: 2, textAlign: 'center'}}>CHCESZ TAK SAMO?</div>
          <div style={{marginTop: 16, borderRadius: 22, background: FIRE, padding: '20px 26px', textAlign: 'center', transform: `scale(${0.82 + sBtn * 0.18})`, opacity: Math.min(1, sBtn * 1.9), boxShadow: `0 0 ${18 + pulse * 30}px ${AMBER}77`}}>
            <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 52, color: '#1a0a04'}}>NACIŚNIJ PRZYCISK</span>
          </div>
          <div style={{marginTop: 14, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 32, color: '#98a3b3'}}>poniżej ↓</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- KREATYWNE: mockup czatu do AI ----------

const CMD = 'dynamiczne cięcia, karaoke napisy, energiczny beat 🔥';

export const ChatToAI: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = useOut();
  const sCard = useSp(0, 14, 130);
  const typeEnd = Math.round(1.1 * fps);
  const sMsg = useSp(typeEnd, 11, 160);
  const typed = Math.round(interpolate(frame, [10, typeEnd], [0, CMD.length], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const sent = interpolate(frame - typeEnd - 14, [0, 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const Dot: React.FC<{i: number}> = ({i}) => {
    const b = Math.sin((frame - i * 6) / 5);
    return <div style={{width: 14, height: 14, borderRadius: 14, backgroundColor: '#8a94a3', transform: `translateY(${b * -6}px)`}} />;
  };
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div style={{position: 'absolute', top: 858, left: 92, width: 896, backgroundColor: '#0d141ef2', borderRadius: 30, border: '2px solid #24313f', padding: '24px 28px', boxShadow: '0 26px 78px rgba(0,0,0,0.7)', transform: `translateY(${(1 - sCard) * 260}px) scale(${0.9 + sCard * 0.1})`, opacity: Math.min(1, sCard * 1.8)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18}}>
          <div style={{width: 56, height: 56, borderRadius: 16, background: FIRE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30}}>🤖</div>
          <div>
            <div style={{fontFamily: SANS, color: '#fff', fontWeight: 800, fontSize: 30}}>AI</div>
            <div style={{fontFamily: SANS, color: '#8a94a3', fontSize: 22}}>piszę mu swój styl…</div>
          </div>
        </div>
        {frame < typeEnd ? (
          <div style={{display: 'inline-flex', gap: 10, backgroundColor: '#1b2431', borderRadius: 22, padding: '18px 26px'}}>
            <Dot i={0} /><Dot i={1} /><Dot i={2} />
          </div>
        ) : (
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <div style={{background: 'linear-gradient(135deg, #2f6bff, #1f4fd8)', color: '#fff', fontFamily: SANS, fontSize: 34, fontWeight: 600, padding: '18px 26px', borderRadius: '24px 24px 8px 24px', maxWidth: 780, lineHeight: 1.3, transform: `scale(${0.7 + sMsg * 0.3})`, transformOrigin: 'bottom right', opacity: Math.min(1, sMsg * 2)}}>
              {CMD.slice(0, typed)}
            </div>
          </div>
        )}
        <div style={{fontFamily: SANS, color: GREEN, fontSize: 24, marginTop: 14, textAlign: 'right', opacity: sent}}>✓ wysłane do AI</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- KREATYWNE: pipeline surowe -> AI -> gotowe ----------

export const PipelineFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const out = useOut();
  const n1 = useSp(2, 13, 150);
  const n2 = useSp(18, 12, 150);
  const n3 = useSp(40, 11, 170);
  const a1 = interpolate(frame, [14, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const a2 = interpolate(frame, [34, 46], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  const Node: React.FC<{s: number; x: number; icon: string; label: string; accent: string; big?: boolean}> = ({s, x, icon, label, accent, big}) => (
    <div style={{position: 'absolute', left: x, top: big ? 968 : 984, width: big ? 236 : 214, transform: `scale(${0.4 + s * 0.6})`, opacity: Math.min(1, s * 2), textAlign: 'center'}}>
      <div style={{width: big ? 150 : 128, height: big ? 150 : 128, margin: '0 auto', borderRadius: 30, background: big ? FIRE : '#101a26', border: `3px solid ${accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: big ? 74 : 62, boxShadow: `0 16px 46px rgba(0,0,0,0.6)${big ? `, 0 0 ${14 + pulse * 24}px ${accent}` : ''}`}}>{icon}</div>
      <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: big ? 40 : 34, color: '#fff', marginTop: 14, letterSpacing: -1, textShadow: '0 3px 12px rgba(0,0,0,0.95), 0 0 26px rgba(0,0,0,0.8)'}}>{label}</div>
    </div>
  );
  const Arrow: React.FC<{x: number; p: number}> = ({x, p}) => (
    <div style={{position: 'absolute', left: x, top: 1030, width: 90, height: 8, borderRadius: 8, backgroundColor: '#26323f', overflow: 'hidden'}}>
      <div style={{height: '100%', width: `${p * 100}%`, background: FIRE}} />
      <div style={{position: 'absolute', right: -4, top: -10, fontSize: 30, color: AMBER, opacity: p > 0.7 ? 1 : 0.2}}>▸</div>
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Node s={n1} x={92} icon="🎥" label="SUROWE" accent="#3a4a5c" />
      <Arrow x={330} p={a1} />
      <Node s={n2} x={422} icon="⚡" label="AI" accent={ORANGE} big />
      <Arrow x={752} p={a2} />
      <Node s={n3} x={846} icon="✨" label="GOTOWE" accent={GREEN} />
      <Burst t0={40} cx={540} cy={1040} color={AMBER} />
    </AbsoluteFill>
  );
};

// ---------- KREATYWNE: celownik kamery (REC) ----------

export const RecViewfinder: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sIn = useSp(0, 16, 150);
  const out = useOut();
  const blink = Math.sin(frame / 7) > -0.3 ? 1 : 0.15;
  const tc = frame / fps;
  const mm = String(Math.floor(tc / 60)).padStart(2, '0');
  const ss = String(Math.floor(tc % 60)).padStart(2, '0');
  const B = 78;
  const T = 6;
  const op = Math.min(1, sIn * 1.6) * (1 - out);
  const inset = interpolate(sIn, [0, 1], [70, 0]);
  const Bracket: React.FC<{cx: string; cy: string; sx: number; sy: number}> = ({cx, cy, sx, sy}) => (
    <div style={{position: 'absolute', [cx]: 60 + inset, [cy]: 60 + inset, width: B, height: B} as React.CSSProperties}>
      <div style={{position: 'absolute', [cy]: 0, [cx]: 0, width: B, height: T, background: '#fff', borderRadius: T} as React.CSSProperties} />
      <div style={{position: 'absolute', [cy]: 0, [cx]: 0, width: T, height: B, background: '#fff', borderRadius: T} as React.CSSProperties} />
    </div>
  );
  return (
    <AbsoluteFill style={{opacity: op}}>
      {/* rogi celownika */}
      <Bracket cx="left" cy="top" sx={1} sy={1} />
      <Bracket cx="right" cy="top" sx={-1} sy={1} />
      <Bracket cx="left" cy="bottom" sx={1} sy={-1} />
      <Bracket cx="right" cy="bottom" sx={-1} sy={-1} />
      {/* REC */}
      <div style={{position: 'absolute', top: 150, left: 70, display: 'flex', alignItems: 'center', gap: 14, backgroundColor: '#0b111ab0', borderRadius: 999, padding: '10px 22px'}}>
        <div style={{width: 24, height: 24, borderRadius: 24, backgroundColor: RED, opacity: blink, boxShadow: `0 0 18px ${RED}`}} />
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: '#fff', letterSpacing: 2}}>REC {mm}:{ss}</span>
      </div>
      {/* podpis */}
      <div style={{position: 'absolute', top: 940, left: 0, width: '100%', display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, backgroundColor: '#0b111ad9', border: `3px solid #fff`, borderRadius: 18, padding: '14px 32px'}}>
          <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 44, color: '#fff'}}>TY ROBISZ TYLKO TO</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- KREATYWNE: pelnoekranowa kawa ----------

export const FsCoffee: React.FC = () => {
  const frame = useCurrentFrame();
  const sYou = useSp(4, 12, 150);
  const sAi = useSp(24, 12, 150);
  const bob = Math.sin(frame / 20) * 10;
  const spin = frame * 2;
  return (
    <AbsoluteFill>
      <EchoBg glow={AMBER} />
      {/* TY */}
      <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', opacity: Math.min(1, sYou * 1.8), transform: `translateY(${(1 - sYou) * 40}px)`}}>
        <div style={{fontSize: 150, transform: `translateY(${bob}px)`}}>☕</div>
        <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 88, color: '#fff', letterSpacing: -2, marginTop: 6}}>TY: PIJESZ KAWĘ</div>
      </div>
      {/* AI */}
      <div style={{position: 'absolute', top: 1010, width: '100%', textAlign: 'center', opacity: Math.min(1, sAi * 1.8), transform: `translateY(${(1 - sAi) * 40}px)`}}>
        <div style={{fontSize: 120, display: 'inline-block', transform: `rotate(${spin}deg)`}}>⚙️</div>
        <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 88, letterSpacing: -2, marginTop: 6, background: FIRE, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>AI: MONTUJE</div>
        <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 40, color: '#aeb8c6', marginTop: 8}}>w innym pokoju</div>
      </div>
    </AbsoluteFill>
  );
};

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 9], [0.5, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{backgroundColor: '#fff', opacity: o}} />;
};

const BrandBug: React.FC = () => (
  <Img src={staticFile('brand-bug.png')} style={{position: 'absolute', top: 84, right: 48, width: 208, opacity: 0.82, filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.55))'}} />
);

// ---------- MASTER (31s) ----------

const Seq: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={s2f(from)} durationInFrames={s2f(to) - s2f(from)}>{children}</Sequence>
);

export const Rolka3Fx: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={s2f(31.06)}>
        <BrandBug />
      </Sequence>

      {/* 0-4.9 split reels hook */}
      <Seq from={0.1} to={4.9}>
        <ReelsPanel3 />
      </Seq>

      {/* 5.0-11.15 "bez ..." chipy */}
      <Seq from={5.0} to={11.15}>
        <NoChips />
      </Seq>

      {/* 11.3-13.7 KREATYWNE: mockup czatu do AI (piszesz styl) */}
      <Seq from={11.3} to={13.75}>
        <ChatToAI />
      </Seq>

      {/* 13.9-16.4 KREATYWNE: pipeline surowe -> AI -> gotowe */}
      <Seq from={13.9} to={16.45}>
        <PipelineFlow />
      </Seq>

      {/* 16.5-18.75 FULLSCREEN checklist napisy/efekty/muzyka */}
      <Seq from={16.5} to={18.75}>
        <FsChecklist />
      </Seq>

      {/* 18.9-22.05 KREATYWNE: celownik kamery REC */}
      <Seq from={18.9} to={22.05}>
        <RecViewfinder />
      </Seq>

      {/* 22.15-25.6 meta badge: nawet ta rolka */}
      <Seq from={22.15} to={25.6}>
        <MetaBadge />
      </Seq>

      {/* 25.75-28.5 KREATYWNE: pelnoekranowa kawa (TY vs AI) */}
      <Seq from={25.75} to={28.5}>
        <FsCoffee />
      </Seq>

      {/* 28.6-31.06 CTA */}
      <Seq from={28.6} to={31.06}>
        <CtaCard />
      </Seq>

      {/* flashe na wejsciu/wyjsciu z pelnoekranowych */}
      {[0.02, 4.9, 16.5, 18.75, 25.75, 28.5].map((t) => (
        <Sequence key={t} from={s2f(t)} durationInFrames={10}>
          <Flash />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
