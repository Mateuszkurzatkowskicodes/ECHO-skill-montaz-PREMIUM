import React from 'react';
import {Composition} from 'remotion';
import {Hook, Interlude1, Interlude2, CtaDm, Badge} from './comps';
import {Hook2, PromptBad, PromptGood, Payoff2, CtaComment} from './comps2';
import {Hook3, WinterPanel, VsSplit, CtaYoutube} from './comps3';

const FPS = 60;

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="hook" component={Hook} durationInFrames={Math.round(3.3 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="interlude1" component={Interlude1} durationInFrames={Math.round(3.5 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="interlude2" component={Interlude2} durationInFrames={Math.round(6.95 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="ctadm" component={CtaDm} durationInFrames={Math.round(5.9 * FPS)} fps={FPS} width={1080} height={760} />
      <Composition
        id="badge1"
        component={Badge}
        durationInFrames={Math.round(2.4 * FPS)}
        fps={FPS}
        width={1080}
        height={320}
        defaultProps={{icon: '👥', text: 'KLIENCI WCIĄŻ SĄ'}}
      />
      <Composition
        id="badge2"
        component={Badge}
        durationInFrames={Math.round(2.48 * FPS)}
        fps={FPS}
        width={1080}
        height={320}
        defaultProps={{icon: '⚠️', text: 'SAME POLECENIA TO RYZYKO'}}
      />
      {/* --- montaz 2 (AI zdjęcia) --- */}
      <Composition id="hook2" component={Hook2} durationInFrames={Math.round(6.9 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="promptbad" component={PromptBad} durationInFrames={Math.round(7.1 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="promptgood" component={PromptGood} durationInFrames={Math.round(11.0 * FPS)} fps={FPS} width={1080} height={900} />
      <Composition id="payoff2" component={Payoff2} durationInFrames={Math.round(5.9 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="ctacomment" component={CtaComment} durationInFrames={Math.round(5.6 * FPS)} fps={FPS} width={1080} height={400} />
      <Composition
        id="badge3"
        component={Badge}
        durationInFrames={Math.round(3.0 * FPS)}
        fps={FPS}
        width={1080}
        height={320}
        defaultProps={{icon: '💡', text: 'ZADBAJ O OŚWIETLENIE'}}
      />
      <Composition
        id="badge4"
        component={Badge}
        durationInFrames={Math.round(2.4 * FPS)}
        fps={FPS}
        width={1080}
        height={320}
        defaultProps={{icon: '🤖', text: 'WEJDŹ W SENSOWNE AI'}}
      />
      <Composition
        id="badge5"
        component={Badge}
        durationInFrames={Math.round(3.0 * FPS)}
        fps={FPS}
        width={1080}
        height={320}
        defaultProps={{icon: '⚙️', text: 'AI ROBI CAŁĄ ROBOTĘ'}}
      />
      <Composition
        id="badge6"
        component={Badge}
        durationInFrames={Math.round(2.8 * FPS)}
        fps={FPS}
        width={1080}
        height={320}
        defaultProps={{icon: '📷', text: 'BAZA MUSI BYĆ NIEZŁA'}}
      />
      {/* --- montaz 3 (piec latem nie zimą) --- */}
      <Composition id="hook3" component={Hook3} durationInFrames={Math.round(3.4 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="winterpanel" component={WinterPanel} durationInFrames={Math.round(4.2 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="vssplit" component={VsSplit} durationInFrames={Math.round(3.0 * FPS)} fps={FPS} width={1080} height={1920} />
      <Composition id="ctayt" component={CtaYoutube} durationInFrames={Math.round(7.4 * FPS)} fps={FPS} width={1080} height={500} />
      <Composition id="bkonk" component={Badge} durationInFrames={Math.round(2.8 * FPS)} fps={FPS} width={1080} height={320} defaultProps={{icon: '🔥', text: 'WSZYSCY SIĘ REKLAMUJĄ'}} />
      <Composition id="bzero" component={Badge} durationInFrames={Math.round(2.6 * FPS)} fps={FPS} width={1080} height={320} defaultProps={{icon: '☀️', text: 'ZERO KONKURENCJI'}} />
      <Composition id="bklient" component={Badge} durationInFrames={Math.round(2.8 * FPS)} fps={FPS} width={1080} height={320} defaultProps={{icon: '🧠', text: 'SENSOWNY KLIENT'}} />
      <Composition id="blampka" component={Badge} durationInFrames={Math.round(3.0 * FPS)} fps={FPS} width={1080} height={320} defaultProps={{icon: '💡', text: 'SAM CHCE WYMIENIĆ PIEC'}} />
    </>
  );
};
