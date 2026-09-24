import { useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import { heroBefore, heroAfter } from '../constants';

const WORD = 'Kutters';
const MIN_MS = 2600;
const COLUMNS = 5;

type Props = { onReveal: () => void; onDone: () => void };

function preload(src: string) {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
    setTimeout(resolve, 5000);
  });
}

export default function Loader({ onReveal, onDone }: Props) {
  const [count, setCount] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let assetsReady = false;
    Promise.all([preload(heroBefore), preload(heroAfter), document.fonts?.ready]).then(() => {
      assetsReady = true;
    });

    const start = performance.now();
    let raf = 0;
    let finished = false;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / MIN_MS);
      // ease-in-out with a hold at 92% until assets are in
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      const target = assetsReady ? eased * 100 : Math.min(92, eased * 100);
      setCount(Math.floor(target));
      if (t >= 1 && assetsReady && !finished) {
        finished = true;
        setCount(100);
        setTimeout(() => {
          setExiting(true);
          onReveal();
        }, 350);
        setTimeout(onDone, 350 + 1500);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onReveal, onDone]);

  const padded = String(count).padStart(3, '0');

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto" aria-live="polite" aria-label={`Loading ${count}%`}>
      {/* Shutter columns that lift away on exit */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: COLUMNS }).map((_, i) => (
          <div
            key={i}
            className="h-full flex-1 bg-[#0b0a09] border-r border-white/[0.04] last:border-r-0"
            style={{
              transform: exiting ? 'translateY(-101%)' : 'translateY(0)',
              transition: `transform 1.1s cubic-bezier(0.76,0,0.24,1) ${exiting ? i * 0.07 : 0}s`,
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0 overflow-hidden text-[#f5efe6]"
        style={{
          opacity: exiting ? 0 : 1,
          transform: exiting ? 'translateY(-6vh) scale(0.96)' : 'none',
          filter: exiting ? 'blur(10px)' : 'none',
          transition: 'opacity .6s ease, transform .9s cubic-bezier(0.76,0,0.24,1), filter .6s ease',
        }}
      >
        <div className="grain absolute -inset-[20%] opacity-[0.07] pointer-events-none" />

        {/* Ambient orange glow that grows with progress */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            width: `${30 + count * 0.9}vmax`,
            height: `${30 + count * 0.9}vmax`,
            background: 'radial-gradient(circle, rgba(232,112,42,0.22) 0%, rgba(232,112,42,0) 60%)',
          }}
        />

        {/* Top meta */}
        <div className="absolute top-6 left-5 right-5 sm:left-10 sm:right-10 flex justify-between text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50">
          <span>Barber &amp; Grooming</span>
          <span>Est. 2014</span>
        </div>

        {/* Center stack */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-5">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center">
            <span className="pulse-ring absolute inset-4 rounded-full border border-[#e8702a]/60" />
            <svg viewBox="0 0 200 200" className="spin-slow absolute inset-0 w-full h-full" aria-hidden>
              <defs>
                <path id="loader-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text fill="rgba(245,239,230,0.55)" fontSize="13" letterSpacing="5.2" fontFamily="Inter, sans-serif">
                <textPath href="#loader-circle">SHARP EDGES · CRAFTED DAILY · SHARP EDGES · CRAFTED DAILY ·</textPath>
              </text>
            </svg>
            <span className="w-14 h-14 rounded-full bg-[#e8702a] flex items-center justify-center shadow-[0_0_40px_rgba(232,112,42,0.5)]">
              <Scissors className="snip w-6 h-6 text-white" strokeWidth={1.8} />
            </span>
          </div>

          <div className="font-playfair italic text-7xl sm:text-8xl md:text-9xl leading-none overflow-hidden pb-3" style={{ letterSpacing: '-0.05em' }}>
            {WORD.split('').map((ch, i) => (
              <span key={i} className="loader-letter" style={{ animationDelay: `${0.15 + i * 0.07}s` }}>
                {ch}
              </span>
            ))}
          </div>

          {/* Barber-pole progress bar */}
          <div className="w-[min(420px,80vw)]">
            <div className="h-[6px] rounded-full bg-white/10 overflow-hidden">
              <div className="barber-pole h-full rounded-full" style={{ width: `${count}%`, transition: 'width 120ms linear' }} />
            </div>
            <div className="mt-3 flex justify-between text-[10px] uppercase tracking-[0.3em] text-white/45">
              <span>{count < 40 ? 'Sharpening blades' : count < 80 ? 'Warming towels' : 'Chair is ready'}</span>
              <span className="tabular-nums">{count}%</span>
            </div>
          </div>
        </div>

        {/* Huge counter */}
        <div
          className="absolute bottom-2 right-4 sm:right-8 font-light tabular-nums text-white/[0.08] leading-none select-none"
          style={{ fontSize: 'clamp(96px, 22vw, 300px)', letterSpacing: '-0.06em' }}
          aria-hidden
        >
          {padded}
        </div>
        <div className="absolute bottom-6 left-5 sm:left-10 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50">
          Fades · Shaves · Beards
        </div>
      </div>
    </div>
  );
}
