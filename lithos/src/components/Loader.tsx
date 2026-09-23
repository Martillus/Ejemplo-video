import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/scroll';

const EARTH_AGE = 4540; // million years
const MIN_TIME = 3400;
const SEDIMENT = ['#2b2522', '#4f5a4a', '#6b3a28', '#8f5a3c', '#a67c52', '#5d4a3a', '#c9a27a', '#7d3322', '#d8b98f', '#3f4a44', '#e3cda8'];
const SLATS = 9;

// Eras from the ICS chart, youngest last. The counter walks through them.
const ERAS: [number, string][] = [
  [4540, 'Hadean · Earth forms'],
  [4000, 'Archean · first crust'],
  [2500, 'Proterozoic · oxygen rises'],
  [538.8, 'Paleozoic · life explodes'],
  [251.9, 'Mesozoic · Pangaea splits'],
  [66, 'Cenozoic · mountains rise'],
  [0.0117, 'Holocene · today'],
];

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

interface Props {
  ready: boolean;
  onReveal: () => void;
  onDone: () => void;
}

export default function Loader({ ready, onReveal, onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exit' | 'gone'>('loading');
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const cb = useRef({ onReveal, onDone });
  cb.current = { onReveal, onDone };

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const start = performance.now();
    const min = reduced ? 600 : MIN_TIME;
    let shown = 0;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / min);
      const target = readyRef.current ? t : Math.min(t, 0.86);
      shown += (target - shown) * 0.08;
      if (target === 1 && shown > 0.995) shown = 1;
      setProgress(shown);
      if (shown < 1) raf = requestAnimationFrame(tick);
      else {
        setPhase('exit');
        setTimeout(() => cb.current.onReveal(), reduced ? 0 : 520);
        setTimeout(() => {
          setPhase('gone');
          cb.current.onDone();
        }, reduced ? 200 : 2000);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === 'gone') return null;

  const eased = easeInOut(progress);
  const ma = EARTH_AGE * Math.pow(1 - eased, 2.2);
  const era = ERAS.reduce((cur, e) => (ma <= e[0] ? e : cur), ERAS[0])[1];
  const exiting = phase === 'exit';
  const maLabel = ma >= 10 ? Math.round(ma).toLocaleString('en-US') : ma.toFixed(ma >= 1 ? 1 : 2);

  return (
    <div className="fixed inset-0 z-[200] pointer-events-auto" aria-live="polite" aria-label="Loading Lithos">
      {/* Shearing slats: a fault slip that opens onto the hero */}
      {Array.from({ length: SLATS }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 bg-[#0b0907]"
          style={{
            top: `${(i * 100) / SLATS}%`,
            height: `calc(${100 / SLATS}% + 1px)`,
            transform: exiting ? `translateX(${i % 2 ? '' : '-'}102%)` : 'translateX(0)',
            transition: `transform 1.05s cubic-bezier(0.76,0,0.24,1) ${0.35 + Math.abs(i - (SLATS - 1) / 2) * 0.07}s`,
          }}
        >
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#e8702a]"
            style={{ [i % 2 ? 'left' : 'right']: 0, opacity: exiting ? 1 : 0, boxShadow: '0 0 24px 4px #e8702a88', transition: 'opacity .3s' } as React.CSSProperties}
          />
        </div>
      ))}

      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-white"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? 'scale(0.94)' : 'none',
          filter: exiting ? 'blur(10px)' : 'none',
          transition: 'opacity .5s ease, transform .6s cubic-bezier(0.16,1,0.3,1), filter .5s ease',
        }}
      >
        {/* Ember glow */}
        <div
          className="pulse-glow absolute w-[520px] h-[520px] max-w-[120vw] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(232,112,42,.28) 0%, rgba(232,112,42,0) 65%)', transform: `translateY(${-40 + progress * 20}px)` }}
        />

        <div className="relative flex flex-col items-center gap-6 px-5 -mt-[10vh]">
          <div className="flex items-center gap-3">
            <svg width="44" height="44" viewBox="0 0 256 256" fill="#ffffff" aria-hidden>
              <path className="shard-a" d="M 256 256 L 128 256 L 0 128 L 128 128 Z" />
              <path className="shard-b" d="M 256 128 L 128 128 L 0 0 L 128 0 Z" />
            </svg>
            <span className="font-playfair italic text-5xl sm:text-6xl" style={{ letterSpacing: '-0.04em' }}>
              {'Lithos'.split('').map((ch, i) => (
                <span key={i} className="letter-in" style={{ animationDelay: `${0.35 + i * 0.07}s` }}>
                  {ch}
                </span>
              ))}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1 mt-4">
            <div className="text-[11px] uppercase tracking-[0.3em] text-white/50">Excavating deep time</div>
            <div className="flex items-baseline gap-2 tabular-nums">
              <span className="text-6xl sm:text-7xl font-light" style={{ letterSpacing: '-0.06em' }}>
                {maLabel}
              </span>
              <span className="text-sm text-white/60">Ma</span>
            </div>
            <div key={era} className="letter-in text-sm text-[#e8a06a] font-playfair italic" style={{ animationDelay: '0s' }}>
              {era}
            </div>
          </div>

          <div className="w-[min(320px,70vw)] mt-2">
            <div className="h-px w-full bg-white/15 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-[#e8702a]" style={{ width: `${progress * 100}%`, boxShadow: '0 0 12px #e8702a' }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] uppercase tracking-[0.2em] text-white/40 tabular-nums">
              <span>4.54 Ga</span>
              <span>{Math.round(progress * 100)}%</span>
              <span>Present</span>
            </div>
          </div>
        </div>

        {/* Sediment settling: oldest layer at the bottom (law of superposition) */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col-reverse">
          {SEDIMENT.map((c, i) => {
            const on = progress > i / SEDIMENT.length;
            return (
              <div
                key={i}
                className="w-full origin-bottom"
                style={{
                  height: `${1.1 + ((i * 7) % 5) * 0.35}vh`,
                  background: `linear-gradient(90deg, ${c}, ${c}dd 40%, ${c})`,
                  transform: on ? 'scaleY(1)' : 'scaleY(0)',
                  opacity: on ? 1 : 0,
                  clipPath: `polygon(0 ${20 + (i % 3) * 15}%, 30% ${(i % 4) * 10}%, 62% ${30 - (i % 3) * 10}%, 100% ${10 + (i % 2) * 20}%, 100% 100%, 0 100%)`,
                  transition: 'transform .9s cubic-bezier(0.16,1,0.3,1), opacity .6s',
                }}
              />
            );
          })}
        </div>
        <div className="absolute bottom-[calc(22vh)] left-5 sm:left-10 text-[10px] uppercase tracking-[0.25em] text-white/35">
          Oldest layers settle first
        </div>
      </div>
    </div>
  );
}
