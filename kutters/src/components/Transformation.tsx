import { useEffect, useRef, useState } from 'react';
import { bg1, bg2 } from '../constants';
import { useSectionProgress } from '../hooks/useScroll';

const STATS = [
  { value: 12, suffix: '', label: 'Years behind the chair' },
  { value: 48, suffix: 'k', label: 'Cuts delivered' },
  { value: 4.9, suffix: '', label: 'Average rating', decimals: 1 },
  { value: 6, suffix: '', label: 'Master barbers' },
];

function CountUp({ value, decimals = 0, suffix }: { value: number; decimals?: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1800);
        setN(value * (1 - Math.pow(1 - t, 4)));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export default function Transformation() {
  const ref = useRef<HTMLElement>(null);
  const p = useSectionProgress(ref);
  // Wipe runs across the middle 70% of the pinned scroll.
  const wipe = Math.min(1, Math.max(0, (p - 0.12) / 0.7));
  const edge = wipe * 100;

  return (
    <>
      <section id="transformation" ref={ref} className="relative bg-black" style={{ height: '280vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden" style={{ height: '100dvh' }}>
          {/* Parallax background words */}
          <div className="absolute inset-0 flex flex-col justify-center gap-4 pointer-events-none select-none" aria-hidden>
            <div
              className="whitespace-nowrap text-[22vw] leading-none font-playfair italic text-white/[0.05]"
              style={{ transform: `translateX(${10 - p * 60}%)`, letterSpacing: '-0.06em' }}
            >
              Before · After · Before
            </div>
            <div
              className="whitespace-nowrap text-[22vw] leading-none font-medium text-white/[0.05]"
              style={{ transform: `translateX(${-50 + p * 60}%)`, letterSpacing: '-0.08em' }}
            >
              Precision · Tradition
            </div>
          </div>

          {/* Comparison frame */}
          <div className="absolute inset-0 flex items-center justify-center px-5">
            <div
              className="relative w-full max-w-5xl rounded-[28px] overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
              style={{
                aspectRatio: '16 / 10',
                maxHeight: '72dvh',
                transform: `scale(${0.82 + Math.min(1, p * 3) * 0.18})`,
                borderRadius: `${48 - Math.min(1, p * 3) * 20}px`,
              }}
            >
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: bg1, transform: `scale(${1.15 - p * 0.15})` }} />
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: bg2,
                  transform: `scale(${1.15 - p * 0.15})`,
                  clipPath: `inset(0 ${100 - edge}% 0 0)`,
                }}
              />
              {/* Divider */}
              <div className="absolute top-0 bottom-0 w-[2px] bg-[#e8702a] shadow-[0_0_24px_#e8702a]" style={{ left: `calc(${edge}% - 1px)`, opacity: wipe > 0 && wipe < 1 ? 1 : 0, transition: 'opacity .3s' }}>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#e8702a] text-white flex items-center justify-center text-lg">
                  ⇆
                </span>
              </div>
              <span
                className="absolute top-5 right-5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-white text-[10px] uppercase tracking-[0.3em]"
                style={{ opacity: 1 - wipe }}
              >
                Before
              </span>
              <span
                className="absolute top-5 left-5 px-3 py-1.5 rounded-full bg-[#e8702a] text-white text-[10px] uppercase tracking-[0.3em]"
                style={{ opacity: wipe }}
              >
                After · 45 min
              </span>
            </div>
          </div>

          {/* Caption */}
          <div className="absolute bottom-6 sm:bottom-10 left-5 right-5 sm:left-10 sm:right-10 md:left-14 md:right-14 flex flex-col sm:flex-row justify-between gap-2 text-white">
            <h2 className="text-3xl sm:text-5xl leading-none" style={{ letterSpacing: '-0.06em' }}>
              The <span className="font-playfair italic text-[#e8702a]">transformation</span>
            </h2>
            <p className="text-white/55 text-xs sm:text-sm max-w-xs">Keep scrolling. Same client, one appointment.</p>
          </div>

          {/* Progress rail */}
          <div className="absolute top-1/2 -translate-y-1/2 left-5 sm:left-8 h-40 w-[2px] bg-white/10 hidden sm:block">
            <div className="w-full bg-[#e8702a]" style={{ height: `${p * 100}%` }} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#f5efe6] text-black px-5 sm:px-10 md:px-14 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6">
          {STATS.map((s, i) => (
            <div key={s.label} className="reveal border-t border-black/15 pt-5" style={{ transitionDelay: `${i * 0.08}s` }}>
              <div className="text-6xl sm:text-7xl leading-none" style={{ letterSpacing: '-0.06em' }}>
                <CountUp value={s.value} decimals={s.decimals} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.2em] text-black/55">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
