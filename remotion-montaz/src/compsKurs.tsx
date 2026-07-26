import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const FIRE = 'linear-gradient(150deg,#FFB13D,#FF4A2D 55%,#E0290F)';
const INK = '#141a24';
const HEAVY = "'Bahnschrift','Arial Black','Segoe UI',sans-serif";
const BODY = "'Inter','Segoe UI',sans-serif";

// ------- tło premium (kremowe + miękkie poświaty + ziarno) -------
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
      <filter id="grainK">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </svg>
    <AbsoluteFill style={{filter: 'url(#grainK)', opacity: 0.05, mixBlendMode: 'multiply'}} />
  </AbsoluteFill>
);

type Step = {icon: string; title: string; sub: string; appearAt: number};

const StepCard: React.FC<{step: Step; index: number}> = ({step, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame - step.appearAt;
  const s = spring({frame: local, fps, config: {damping: 14, mass: 0.8, stiffness: 110}});
  const opacity = interpolate(local, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(s, [0, 1], [60, 0]);
  const scale = interpolate(s, [0, 1], [0.82, 1]);
  // delikatny oddech ikony po pojawieniu
  const iconPulse = 1 + 0.05 * Math.sin((frame - step.appearAt) / 14);

  return (
    <div
      style={{
        position: 'relative',
        width: 420,
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 22,
      }}
    >
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: 40,
          background: FIRE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 74,
          boxShadow: '0 26px 60px rgba(255,74,45,.32), inset 0 2px 3px rgba(255,255,255,.4)',
          transform: `scale(${index >= 0 ? iconPulse : 1})`,
        }}
      >
        {step.icon}
      </div>
      <div
        style={{
          width: 40,
          height: 40,
          marginTop: -10,
          borderRadius: '50%',
          background: '#fff',
          border: '3px solid #FF4A2D',
          color: '#FF4A2D',
          fontFamily: HEAVY,
          fontWeight: 800,
          fontSize: 22,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(0,0,0,.12)',
        }}
      >
        {index + 1}
      </div>
      <div style={{textAlign: 'center'}}>
        <div style={{fontFamily: HEAVY, fontWeight: 800, fontSize: 40, color: INK, letterSpacing: -1}}>
          {step.title}
        </div>
        <div style={{fontFamily: BODY, fontWeight: 500, fontSize: 25, color: '#6b7280', marginTop: 8, lineHeight: 1.3}}>
          {step.sub}
        </div>
      </div>
    </div>
  );
};

const Connector: React.FC<{appearAt: number; x: number}> = ({appearAt, x}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame - appearAt, [0, 14], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute',
        top: 88,
        left: x,
        width: 130 * draw,
        height: 5,
        borderRadius: 4,
        background: 'linear-gradient(90deg,#FF7A45,#FF4A2D)',
        opacity: 0.55,
      }}
    />
  );
};

// ------- WYLICZANKA: 3 kroki kursu (16:9) -------
export const EnumInterlude: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const steps: Step[] = [
    {icon: '🧰', title: 'Narzędzia', sub: 'Ustawiamy, czego potrzebujesz', appearAt: Math.round(0.9 * fps)},
    {icon: '⚡', title: 'Mój skill', sub: 'Wgrywasz mój autorski skill', appearAt: Math.round(6.8 * fps)},
    {icon: '🎨', title: 'Twój styl', sub: 'AI uczy się, jak lubisz', appearAt: Math.round(16.6 * fps)},
  ];

  const titleS = spring({frame, fps, config: {damping: 16, mass: 0.7, stiffness: 90}});
  const titleY = interpolate(titleS, [0, 1], [-40, 0]);
  const titleOp = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{fontFamily: BODY}}>
      <CreamBg />
      {/* kicker + tytuł */}
      <div style={{position: 'absolute', top: 90, left: 0, right: 0, textAlign: 'center', transform: `translateY(${titleY}px)`, opacity: titleOp}}>
        <div
          style={{
            display: 'inline-block',
            fontFamily: HEAVY,
            fontWeight: 700,
            fontSize: 22,
            letterSpacing: 6,
            color: '#FF4A2D',
            padding: '10px 22px',
            border: '1.5px solid rgba(255,74,45,.4)',
            borderRadius: 999,
            marginBottom: 20,
          }}
        >
          TEN KURS W 3 KROKACH
        </div>
        <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 64, color: INK, letterSpacing: -2}}>
          Co dziś <span style={{background: FIRE, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>zrobimy</span>
        </div>
      </div>

      {/* karty w rzędzie + łączniki */}
      <div
        style={{
          position: 'absolute',
          top: 340,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 90,
        }}
      >
        <div style={{position: 'relative', display: 'flex', gap: 90}}>
          {steps.map((st, i) => (
            <StepCard key={i} step={st} index={i} />
          ))}
          {/* łączniki między kartami (pojawiają się z drugą i trzecią kartą) */}
          <Connector appearAt={steps[1].appearAt - 4} x={420} />
          <Connector appearAt={steps[2].appearAt - 4} x={930} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ------- PAYOFF: "Ty pijesz kawę, AI montuje" (16:9) -------
export const CoffeePayoff: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 15, mass: 0.8, stiffness: 100}});
  const y = interpolate(s, [0, 1], [50, 0]);
  const op = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  const cupFloat = Math.sin(frame / 18) * 8;

  return (
    <AbsoluteFill style={{fontFamily: BODY}}>
      <CreamBg />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{textAlign: 'center', transform: `translateY(${y}px)`, opacity: op}}>
          <div style={{fontSize: 130, transform: `translateY(${cupFloat}px)`, marginBottom: 10}}>☕</div>
          <div style={{fontFamily: HEAVY, fontWeight: 900, fontSize: 78, color: INK, letterSpacing: -2, lineHeight: 1.05}}>
            Ty pijesz kawę.
          </div>
          <div
            style={{
              fontFamily: HEAVY,
              fontWeight: 900,
              fontSize: 78,
              letterSpacing: -2,
              lineHeight: 1.05,
              marginTop: 4,
              background: FIRE,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI montuje.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
