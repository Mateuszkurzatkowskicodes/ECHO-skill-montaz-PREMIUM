import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring, Easing} from 'remotion';

// ---------- ECHO design tokens ----------
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
const MONO = "Consolas, 'Courier New', monospace";
const FIRE = `linear-gradient(150deg, ${AMBER}, ${ORANGE} 55%, ${DEEP})`;

const FPS = 60;
const s2f = (s: number) => Math.round(s * FPS);

// split-screen geometry: gorny panel + pas na napisy + szew, dol = twarz (doklejana w ffmpeg)
const PANEL_H = 1010; // dol panelu = szew
// tresc panelu MUSI konczyc sie na 780 - pas 790-1010 nalezy do napisow,
// ktore w oknach split maja MarginV=920 i potrafia byc dwuliniowe
const CONTENT_H = 780;

const useSp = (delay: number, damping = 12, stiffness = 140) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.9}});
};

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
        const dist = 45 + p * 200;
        const size = 13 * (1 - p);
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

// ---------- rama panelu split-screen ----------

const PanelShell: React.FC<{children: React.ReactNode; glow?: string; label?: string}> = ({
  children,
  glow = ORANGE,
  label,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 95) * 60;
  const sLabel = useSp(6, 13, 150);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: PANEL_H, overflow: 'hidden'}}>
      <AbsoluteFill style={{backgroundColor: INK}} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(820px 820px at ${250 + drift}px ${760 - drift}px, ${glow}24 0%, transparent 70%), radial-gradient(680px 680px at ${850 - drift}px ${220 + drift}px, ${CYAN}18 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage:
            'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
          backgroundSize: '92px 92px',
          backgroundPosition: `0px ${(frame * 0.14) % 92}px`,
        }}
      />
      <Grain />
      {children}
      {/* etykieta rozdzialu w rogu panelu */}
      {label ? (
        <div
          style={{
            position: 'absolute',
            left: 40,
            top: 34,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: '#0c131de6',
            border: `2px solid ${glow}`,
            borderRadius: 999,
            padding: '10px 22px',
            transform: `translateX(${(1 - sLabel) * -320}px)`,
            opacity: Math.min(1, sLabel * 1.8),
          }}
        >
          <span style={{width: 12, height: 12, borderRadius: 12, backgroundColor: glow}} />
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: '#e8eef6', letterSpacing: 1}}>
            {label}
          </span>
        </div>
      ) : null}
      {/* winieta + szew */}
      <AbsoluteFill style={{boxShadow: 'inset 0 0 190px 60px rgba(0,0,0,0.55)'}} />
      <div style={{position: 'absolute', left: 0, top: PANEL_H - 8, width: 1080, height: 8, background: FIRE}} />
    </div>
  );
};

// ---------- SS0: "te rolki u gory" - realne kadry z rolki 1 ----------

// duzy telefon z PRAWDZIWYM klipem (montaz zrobiony przez AI), gra w petli
const PhoneClip: React.FC<{src: string; delay: number; x: number; y: number; w: number; rot: number}> = ({
  src,
  delay,
  x,
  y,
  w,
  rot,
}) => {
  const frame = useCurrentFrame();
  const s = useSp(delay, 13, 150);
  const float = Math.sin((frame - delay) / 30) * 6;
  const h = Math.round(w * (16 / 9));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + float,
        width: w,
        height: h,
        borderRadius: 30,
        padding: 7,
        background: 'linear-gradient(160deg, #313d4c, #10171f)',
        boxShadow: `0 30px 80px rgba(0,0,0,0.7), 0 0 30px ${ORANGE}22`,
        transform: `scale(${0.6 + s * 0.4}) rotate(${rot * (1 - s) * 1.4 + rot * 0.2}deg)`,
        opacity: Math.min(1, s * 2.2),
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 24, overflow: 'hidden', position: 'relative'}}>
        <OffthreadVideo
          src={staticFile(src)}
          muted
          loop
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
        {/* delikatny refleks szkla */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, rgba(255,255,255,0.10) 0%, transparent 34%)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

export const ReelsPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const sTag = useSp(s2f(3.25), 11, 170); // "w parę minut" ~3.3s
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;
  // 3 duze telefony w rzedzie: szer. 322, wys. 572; miesci sie w strefie tresci (do 780)
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
      <div
        style={{
          position: 'absolute',
          top: 700,
          width: '100%',
          textAlign: 'center',
          fontFamily: HEAVY,
          fontWeight: 900,
          fontSize: 72,
          letterSpacing: -2,
          transform: `scale(${0.6 + sTag * 0.4})`,
          opacity: Math.min(1, sTag * 2),
          background: FIRE,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: `drop-shadow(0 0 ${12 + pulse * 18}px ${ORANGE}55)`,
        }}
      >
        W&nbsp;PARĘ&nbsp;MINUT
      </div>
      <Burst t0={s2f(3.3)} cx={540} cy={742} color={AMBER} />
    </PanelShell>
  );
};

// ---------- SS1: folder na pulpicie + wpadajacy plik ----------

export const FolderPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const sWin = useSp(2, 14, 130);
  const drop = s2f(1.9); // plik wpada
  const sDrop = useSp(drop, 15, 150);
  const landed = frame >= drop + 26;
  const sRow = useSp(drop + 26, 12, 160);
  // kursor jedzie do listy
  const cur = interpolate(frame, [s2f(0.7), s2f(1.85)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });
  // przyciety zrzut 1250x560 -> pelna szerokosc panelu, wiersze czytelne
  const IMG_W = 1012;
  const IMG_H = Math.round((560 / 1250) * IMG_W); // 453
  const IMG_X = (1080 - IMG_W) / 2;
  const IMG_Y = 150;
  const K = IMG_W / 1250; // 0.81
  const ROW_Y = IMG_Y + Math.round(400 * K); // tuz pod ostatnim wierszem listy
  const ROW_X = IMG_X + Math.round(150 * K);
  const fly = interpolate(sDrop, [0, 1], [0, 1]);
  const cardOpacity = landed ? Math.max(0, 1 - (frame - drop - 26) / 8) : 1;
  return (
    <PanelShell glow={CYAN} label="03 · FOLDER DLA AI">
      <div
        style={{
          position: 'absolute',
          left: IMG_X,
          top: IMG_Y,
          width: IMG_W,
          height: IMG_H,
          borderRadius: 16,
          overflow: 'hidden',
          border: '2px solid #2b3a4a',
          boxShadow: '0 26px 74px rgba(0,0,0,0.7)',
          transform: `scale(${0.94 + sWin * 0.06})`,
          opacity: Math.min(1, sWin * 1.8),
        }}
      >
        <Img
          src={staticFile('r2-folder-crop.png')}
          style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.22) contrast(1.04)'}}
        />
      </div>

      {/* wiersz, ktory pojawia sie po wrzuceniu pliku */}
      {landed ? (
        <div
          style={{
            position: 'absolute',
            left: ROW_X,
            top: ROW_Y,
            width: 640,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            backgroundColor: `${GREEN}22`,
            border: `2px solid ${GREEN}`,
            borderRadius: 8,
            padding: '8px 16px',
            transform: `scaleX(${0.3 + Math.min(1, sRow) * 0.7})`,
            transformOrigin: 'left center',
            opacity: Math.min(1, sRow * 1.6),
            boxShadow: `0 0 22px ${GREEN}44`,
          }}
        >
          <span style={{fontSize: 26}}>🎬</span>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#e9f7ee', whiteSpace: 'nowrap'}}>
            surowa-rolka-1.mp4
          </span>
          <span style={{marginLeft: 'auto', fontSize: 26, color: GREEN, fontWeight: 900}}>✓</span>
        </div>
      ) : null}

      {/* lecacy plik */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(fly, [0, 1], [742, ROW_X - 8]),
          top: interpolate(fly, [0, 1], [96, ROW_Y - 10]),
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          backgroundColor: '#101a26f5',
          border: `3px solid ${AMBER}`,
          borderRadius: 18,
          padding: '14px 24px',
          boxShadow: `0 20px 56px rgba(0,0,0,0.7), 0 0 26px ${AMBER}44`,
          transform: `scale(${interpolate(fly, [0, 1], [1.15, 0.8])}) rotate(${interpolate(fly, [0, 1], [-9, 0])}deg)`,
          opacity: cardOpacity,
        }}
      >
        <span style={{fontSize: 40}}>🎥</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#fff', whiteSpace: 'nowrap'}}>
          surowa-rolka-1.mp4
        </span>
      </div>

      {/* kursor */}
      <div
        style={{
          position: 'absolute',
          left: interpolate(cur, [0, 1], [860, ROW_X + 90]),
          top: interpolate(cur, [0, 1], [640, ROW_Y + 26]),
          fontSize: 44,
          color: '#fff',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.9))',
          opacity: landed ? 0 : 1,
        }}
      >
        ➤
      </div>

      {landed ? (
        <>
          <div
            style={{
              position: 'absolute',
              top: 648,
              width: '100%',
              textAlign: 'center',
              fontFamily: HEAVY,
              fontWeight: 900,
              fontSize: 62,
              color: GREEN,
              letterSpacing: -1,
              transform: `scale(${0.6 + sRow * 0.4})`,
              opacity: Math.min(1, sRow * 2),
              textShadow: `0 0 26px ${GREEN}66`,
            }}
          >
            ✓ AI JUŻ TO WIDZI
          </div>
          <Burst t0={drop + 28} cx={540} cy={690} color={GREEN} />
        </>
      ) : null}
    </PanelShell>
  );
};

// ---------- SS2: Claude Code - puste okno -> pisanie komendy -> praca ----------

const CMD = 'zmontuj mi to nagranie surowa rolka 1';

const CheckLine: React.FC<{delay: number; label: string; y: number}> = ({delay, label, y}) => {
  const s = useSp(delay, 13, 150);
  const sTick = useSp(delay + 7, 10, 210);
  return (
    <div
      style={{
        position: 'absolute',
        left: 96,
        top: y,
        width: 888,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#0c141ff2',
        border: '2px solid #24313f',
        borderRadius: 16,
        padding: '10px 22px',
        transform: `translateX(${(1 - s) * -700}px)`,
        opacity: Math.min(1, s * 1.9),
        boxShadow: '0 14px 38px rgba(0,0,0,0.6)',
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 46,
          backgroundColor: GREEN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          color: '#06210f',
          fontWeight: 900,
          transform: `scale(${0.2 + sTick * 0.8})`,
          boxShadow: `0 0 20px ${GREEN}66`,
        }}
      >
        ✓
      </div>
      <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 44, color: '#fff', letterSpacing: -1}}>{label}</div>
    </div>
  );
};

export const ClaudePanel: React.FC = () => {
  const frame = useCurrentFrame();
  // fazy (lokalnie, panel startuje 34.15s):
  const TYPE_START = s2f(4.70); // 38.85s - "zmontuj"
  const TYPE_END = s2f(7.30); // 41.45s
  const WORK_START = s2f(7.45); // 41.60s
  const working = frame >= WORK_START;

  const sWin = useSp(2, 14, 130);
  const caret = Math.floor(frame / 18) % 2 === 0;
  const typed = Math.round(
    interpolate(frame, [TYPE_START, TYPE_END], [0, CMD.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );
  const sendFlash = interpolate(frame, [TYPE_END, TYPE_END + 10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 0.5 + Math.sin(frame / 7) * 0.5;

  // okno Claude Code (817x957) - dol musi konczyc sie nad pasem napisow (780)
  const CC_H = 700;
  const CC_W = Math.round((817 / 957) * CC_H); // 597
  const CC_X = (1080 - CC_W) / 2;
  const CC_Y = 62;

  // widok pracy (782x750) - powolne przewijanie
  const scroll = interpolate(frame - WORK_START, [0, s2f(10)], [0, -90], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <PanelShell glow={ORANGE} label={working ? '05 · AI MONTUJE' : '04 · KOMENDA'}>
      {!working ? (
        <>
          {/* male okno Claude Code u gory - tylko kontekst */}
          <div
            style={{
              position: 'absolute',
              left: (1080 - 470) / 2,
              top: 30,
              width: 470,
              height: 402,
              borderRadius: 16,
              overflow: 'hidden',
              border: '2px solid #24313f',
              boxShadow: '0 22px 60px rgba(0,0,0,0.7)',
              transform: `scale(${0.92 + sWin * 0.08})`,
              opacity: Math.min(1, sWin * 1.7) * 0.9,
            }}
          >
            <Img
              src={staticFile('r2-cc-empty.png')}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
                objectPosition: 'top',
                filter: 'brightness(1.2) contrast(1.03)',
              }}
            />
            <AbsoluteFill style={{background: 'linear-gradient(transparent 55%, #070B11)'}} />
          </div>

          {/* DUZY pasek promptu - to jest sedno, ma byc czytelne */}
          <div
            style={{
              position: 'absolute',
              left: 70,
              top: 470,
              width: 940,
              borderRadius: 22,
              background: '#0c1017',
              border: `3px solid ${ORANGE}`,
              boxShadow: `0 24px 70px rgba(0,0,0,0.7), 0 0 ${18 + pulse * 26}px ${ORANGE}66`,
              padding: '26px 30px',
              transform: `translateY(${(1 - sWin) * 60}px)`,
              opacity: Math.min(1, sWin * 1.8),
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
              <span style={{fontSize: 30}}>✳️</span>
              <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 30, color: '#8a94a3', letterSpacing: 1}}>
                Claude Code
              </span>
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: 52,
                lineHeight: 1.25,
                color: '#eef3f9',
                fontWeight: 700,
                minHeight: 140,
              }}
            >
              <span style={{color: AMBER}}>&gt; </span>
              {CMD.slice(0, typed)}
              {caret ? <span style={{color: ORANGE}}>▋</span> : null}
            </div>
            {/* pasek wyslij */}
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 14}}>
              <div
                style={{
                  fontFamily: HEAVY,
                  fontWeight: 900,
                  fontSize: 34,
                  color: '#1a0a04',
                  background: FIRE,
                  borderRadius: 14,
                  padding: '10px 28px',
                  boxShadow: `0 0 ${10 + sendFlash * 30}px ${AMBER}`,
                  transform: `scale(${1 + sendFlash * 0.12})`,
                }}
              >
                ENTER ⏎
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              position: 'absolute',
              left: 84,
              top: 34,
              width: 912,
              height: 430,
              borderRadius: 18,
              overflow: 'hidden',
              border: '2px solid #24313f',
              boxShadow: '0 26px 74px rgba(0,0,0,0.7)',
            }}
          >
            <Img
              src={staticFile('r2-cc-work.png')}
              style={{
                position: 'absolute',
                left: 0,
                top: scroll,
                width: '100%',
                objectFit: 'cover',
                filter: 'brightness(1.22) contrast(1.04)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 90,
                background: 'linear-gradient(transparent, #070B11)',
              }}
            />
            {/* dioda aktywnosci */}
            <div
              style={{
                position: 'absolute',
                right: 20,
                top: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                backgroundColor: '#0b121bd9',
                borderRadius: 999,
                padding: '8px 18px',
              }}
            >
              <span
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 14,
                  backgroundColor: ORANGE,
                  opacity: 0.35 + pulse * 0.65,
                  boxShadow: `0 0 ${8 + pulse * 14}px ${ORANGE}`,
                }}
              />
              <span style={{fontFamily: MONO, fontSize: 24, color: '#c8d2df'}}>montuję…</span>
            </div>
          </div>
          <CheckLine delay={s2f(11.37 - 7.45)} label="CIĘCIA" y={496} />
          <CheckLine delay={s2f(12.93 - 7.45)} label="NAPISY" y={568} />
          <CheckLine delay={s2f(14.77 - 7.45)} label="ZOOMY" y={640} />
          <CheckLine delay={s2f(15.69 - 7.45)} label="EFEKTY" y={712} />
        </>
      )}
    </PanelShell>
  );
};

// ---------- overlaye na pelnym kadrze ----------

export const Pill: React.FC<{icon: string; text: string; accent?: string; top?: number}> = ({
  icon,
  text,
  accent = ORANGE,
  top = 1000,
}) => {
  const frame = useCurrentFrame();
  const sIn = useSp(0, 11, 175);
  const out = useOut();
  const bob = Math.sin(frame / 6) * 6;
  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top, width: '100%', display: 'flex', justifyContent: 'center'}}>
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
          <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 44, color: '#fff', whiteSpace: 'nowrap'}}>
            {text}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const StepBadge: React.FC<{num: string; text: string}> = ({num, text}) => {
  const sIn = useSp(0, 12, 160);
  const out = useOut();
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div
        style={{
          position: 'absolute',
          top: 975,
          left: 110,
          width: 860,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          transform: `translateX(${(1 - sIn) * -760}px)`,
          opacity: Math.min(1, sIn * 1.9),
        }}
      >
        <div
          style={{
            width: 110,
            height: 110,
            borderRadius: 26,
            background: FIRE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 58,
            color: '#1a0a04',
            boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
          }}
        >
          {num}
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: '#0d151fee',
            border: '3px solid #24313f',
            borderRadius: 22,
            padding: '20px 26px',
            fontFamily: HEAVY,
            fontWeight: 900,
            fontSize: 50,
            color: '#fff',
            letterSpacing: -1,
            boxShadow: '0 18px 50px rgba(0,0,0,0.6)',
          }}
        >
          {text}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{delay: number; text: string; y: number; accent: string; mark: string}> = ({
  delay,
  text,
  y,
  accent,
  mark,
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
          border: `3px solid ${accent}`,
          borderRadius: 999,
          padding: '12px 32px',
          boxShadow: '0 16px 44px rgba(0,0,0,0.6)',
        }}
      >
        <span style={{fontSize: 38, color: accent, fontWeight: 900}}>{mark}</span>
        <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: '#fff', whiteSpace: 'nowrap'}}>
          {text}
        </span>
      </div>
    </div>
  );
};

export const RawChips: React.FC = () => {
  const out = useOut();
  // 4 pozycje max: okno miedzy broda (884) a pasem napisow (~1210)
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Chip delay={s2f(0.35)} text="w pełni surowe" y={920} accent={AMBER} mark="●" />
      <Chip delay={s2f(5.60)} text="momenty ciszy" y={998} accent={RED} mark="✗" />
      <Chip delay={s2f(6.50)} text="powtórzenia" y={1076} accent={RED} mark="✗" />
      <Chip delay={s2f(8.05)} text="kaszlnięcia" y={1154} accent={RED} mark="✗" />
    </AbsoluteFill>
  );
};

export const ChillChips: React.FC = () => {
  const out = useOut();
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Chip delay={s2f(1.50)} text="siedzisz" y={950} accent={GREEN} mark="✓" />
      <Chip delay={s2f(4.55)} text="idziesz do innego pokoju" y={1032} accent={GREEN} mark="✓" />
      <Chip delay={s2f(5.60)} text="robisz kawę" y={1114} accent={GREEN} mark="✓" />
    </AbsoluteFill>
  );
};

export const FourMin: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(0, 13, 140);
  const out = useOut();
  const n = interpolate(frame, [10, 74], [0, 4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const sDone = useSp(s2f(2.7), 11, 180);
  const pulse = 0.5 + Math.sin(frame / 8) * 0.5;
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <div
        style={{
          position: 'absolute',
          top: 920,
          left: 106,
          width: 868,
          borderRadius: 30,
          padding: 4,
          background: FIRE,
          boxShadow: `0 26px 80px rgba(0,0,0,0.68), 0 0 ${20 + pulse * 28}px ${ORANGE}55`,
          transform: `translateY(${(1 - sCard) * 250}px) scale(${0.88 + sCard * 0.12})`,
          opacity: Math.min(1, sCard * 1.9),
        }}
      >
        <div style={{backgroundColor: '#0a1119', borderRadius: 26, padding: '24px 30px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <div style={{fontSize: 76}}>☕</div>
            <div>
              <div
                style={{
                  fontFamily: HEAVY,
                  fontWeight: 900,
                  fontSize: 96,
                  color: AMBER,
                  lineHeight: 1,
                  letterSpacing: -2,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                ~{n.toFixed(0)} MIN
              </div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 36, color: '#cfd7e2', marginTop: 6}}>
                I WRACASZ DO GOTOWEJ ROLKI
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: 18,
              borderTop: '2px solid #1d2836',
              paddingTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              opacity: Math.min(1, sDone * 1.8),
            }}
          >
            <span style={{fontSize: 34, color: GREEN}}>✓</span>
            <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: GREEN}}>
              gotowe do opublikowania
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- poprawki: dymki czatu ----------

const Bubble: React.FC<{delay: number; text: string; y: number}> = ({delay, text, y}) => {
  const s = useSp(delay, 12, 165);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        right: 96,
        maxWidth: 720,
        backgroundColor: '#1f6feb',
        color: '#fff',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 40,
        padding: '16px 26px',
        borderRadius: '22px 22px 8px 22px',
        boxShadow: '0 18px 48px rgba(0,0,0,0.6)',
        transform: `scale(${0.6 + s * 0.4}) translateY(${(1 - s) * 40}px)`,
        transformOrigin: 'bottom right',
        opacity: Math.min(1, s * 2),
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

export const ChatFix: React.FC = () => {
  const out = useOut();
  return (
    <AbsoluteFill style={{opacity: 1 - out}}>
      <Bubble delay={s2f(2.85)} text="popraw to, popraw tamto" y={920} />
      <Bubble delay={s2f(5.65)} text="ścisz muzykę" y={1010} />
      <Bubble delay={s2f(6.85)} text="zgłośnij mój głos" y={1100} />
    </AbsoluteFill>
  );
};

// ---------- CTA kurs ----------

export const CtaKurs: React.FC = () => {
  const frame = useCurrentFrame();
  const sCard = useSp(0, 14, 130);
  const sBtn = useSp(30, 11, 175);
  const pulse = 0.5 + Math.sin(frame / 6) * 0.5;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: 870,
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
        <div style={{backgroundColor: '#0a1119', borderRadius: 30, padding: '28px 34px'}}>
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
            UCZĘ TEGO KROK PO KROKU
          </div>
          <div
            style={{
              marginTop: 16,
              borderRadius: 22,
              background: FIRE,
              padding: '20px 26px',
              textAlign: 'center',
              transform: `scale(${0.82 + sBtn * 0.18})`,
              opacity: Math.min(1, sBtn * 1.9),
              boxShadow: `0 0 ${18 + pulse * 30}px ${AMBER}77`,
            }}
          >
            <span style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 52, color: '#1a0a04'}}>
              DOWIEDZ SIĘ WIĘCEJ
            </span>
          </div>
          <div
            style={{
              marginTop: 14,
              textAlign: 'center',
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: 32,
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

// ---------- flash + brand bug ----------

const Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 9], [0.5, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{backgroundColor: '#fff', opacity: o}} />;
};

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

// ---------- MASTER ----------

const Seq: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={s2f(from)} durationInFrames={s2f(to) - s2f(from)}>
    {children}
  </Sequence>
);

export const Rolka2Fx: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* brand bug najpierw - zaslaniany przez panele split-screen */}
      <Sequence from={0} durationInFrames={s2f(87.55)}>
        <BrandBug />
      </Sequence>

      {/* --- SPLIT-SCREEN 0: "te rolki u gory" --- */}
      {/* reels hook przedluzony do 6.6s - klipy maja byc duze i dlugo widoczne */}
      <Seq from={0.1} to={6.6}>
        <ReelsPanel />
      </Seq>

      <Seq from={6.85} to={11.95}>
        <StepBadge num="01" text="NAGRAJ SIĘ" />
      </Seq>

      <Seq from={12.1} to={15.35}>
        <StepBadge num="02" text="WRZUĆ NA KOMPUTER" />
      </Seq>

      {/* --- SPLIT-SCREEN 1: folder na pulpicie --- */}
      <Seq from={15.45} to={21.65}>
        <FolderPanel />
      </Seq>

      <Seq from={21.9} to={30.85}>
        <RawChips />
      </Seq>

      <Seq from={30.95} to={34.05}>
        <Pill icon="🤷" text="I NIC NIE SZKODZI" accent={AMBER} top={1000} />
      </Seq>

      {/* --- SPLIT-SCREEN 2: Claude Code (komenda -> praca) --- */}
      <Seq from={34.15} to={52.05}>
        <ClaudePanel />
      </Seq>

      <Seq from={52.2} to={54.05}>
        <Pill icon="😌" text="TYLE Z MOJEJ ROBOTY" accent={GREEN} top={1000} />
      </Seq>

      <Seq from={54.35} to={60.4}>
        <ChillChips />
      </Seq>

      <Seq from={60.6} to={65.85}>
        <FourMin />
      </Seq>

      <Seq from={66.05} to={75.45}>
        <ChatFix />
      </Seq>

      <Seq from={75.7} to={81.3}>
        <Pill icon="⚡" text="POPRAWIA W KILKA SEKUND" accent={AMBER} top={1000} />
      </Seq>

      <Seq from={81.5} to={87.55}>
        <CtaKurs />
      </Seq>

      {/* --- flashe na wejsciu/wyjsciu ze split-screenu --- */}
      {[0.02, 6.6, 15.45, 21.65, 34.15, 52.05].map((t) => (
        <Sequence key={t} from={s2f(t)} durationInFrames={10}>
          <Flash />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
