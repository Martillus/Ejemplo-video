import { useEffect, useRef, useState } from 'react';
import { onScroll, clamp } from '../lib/scroll';

// Boundaries from the ICS International Chronostratigraphic Chart (Ma).
const ERAS = [
  { name: 'Cenozoic', span: [0, 66], color: '#c9a27a', note: 'Age of mammals. India slams into Asia and the Himalaya climb; ice sheets carve the valleys we farm today.', rock: 'Loess, glacial till' },
  { name: 'Mesozoic', span: [66, 251.9], color: '#8f5a3c', note: 'Pangaea tears apart and the Atlantic opens. Warm shallow seas bury ammonites in chalk; dinosaurs rule the land.', rock: 'Chalk, red sandstone' },
  { name: 'Paleozoic', span: [251.9, 538.8], color: '#56614f', note: 'The Cambrian explosion fills the seas with shells. Coal forests rise, then the Great Dying ends 90% of species.', rock: 'Shale, limestone, coal' },
  { name: 'Precambrian', span: [538.8, 4540], color: '#3a2d28', note: 'A molten world cools into crust. Microbes pump oxygen into the air and rust it into banded iron.', rock: 'Gneiss, banded iron' },
];
const BOUNDS = [0, 66, 251.9, 538.8, 4540];
const CUM = [0, 16, 38, 65, 100]; // where each boundary sits down the core, in %

export default function DeepTime() {
  const wrap = useRef<HTMLDivElement>(null);
  const bigText = useRef<HTMLDivElement>(null);
  const drill = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useEffect(
    () =>
      onScroll((_, vh) => {
        const el = wrap.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - vh));
        const seg = Math.min(3, Math.floor(p * 4));
        const f = p * 4 - seg;
        const ma = BOUNDS[seg] + (BOUNDS[seg + 1] - BOUNDS[seg]) * f;
        setActive(seg);
        if (counter.current) counter.current.textContent = ma >= 100 ? Math.round(ma).toLocaleString('en-US') : ma.toFixed(1);
        if (drill.current) drill.current.style.transform = `translateY(${CUM[seg] + (CUM[seg + 1] - CUM[seg]) * f}%)`;
        if (bigText.current) bigText.current.style.transform = `translate3d(${10 - p * 60}%, 0, 0)`;
      }),
    [],
  );

  const era = ERAS[active];

  return (
    <section id="deep-time" ref={wrap} className="relative bg-[#0b0907]" style={{ height: '400vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ height: '100dvh' }}>
        {/* Drifting outline type */}
        <div
          ref={bigText}
          className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-playfair italic text-[26vw] leading-none pointer-events-none select-none"
          style={{ WebkitTextStroke: '1px rgba(255,255,255,.07)', color: 'transparent' }}
          aria-hidden
        >
          4.54 billion years
        </div>
        {/* Era-tinted glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-[background] duration-1000"
          style={{ background: `radial-gradient(60% 60% at 70% 50%, ${era.color}40 0%, transparent 70%)` }}
        />

        <div className="relative h-full max-w-6xl mx-auto px-5 sm:px-10 md:px-14 grid grid-cols-[1fr_auto] gap-6 sm:gap-16 items-center pt-16">
          <div className="min-w-0">
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-6">
              <span className="w-8 h-px bg-[#e8702a]" />
              Drill the core
            </div>
            <div className="flex items-baseline gap-3 text-white tabular-nums">
              <span ref={counter} className="text-6xl sm:text-8xl md:text-[9rem] font-light leading-none" style={{ letterSpacing: '-0.07em' }}>
                0.0
              </span>
              <span className="text-sm sm:text-base text-white/50">million years ago</span>
            </div>
            <div key={era.name} className="mt-8" style={{ animation: 'heroReveal .9s cubic-bezier(0.16,1,0.3,1)' }}>
              <h2 className="font-playfair italic text-white text-4xl sm:text-6xl" style={{ letterSpacing: '-0.04em' }}>
                {era.name}
              </h2>
              <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed max-w-md">{era.note}</p>
              <div className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/50 border border-white/15 rounded-full px-3 py-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: era.color, boxShadow: `0 0 10px ${era.color}` }} />
                {era.rock} · {era.span[1].toLocaleString('en-US')}–{era.span[0]} Ma
              </div>
            </div>
          </div>

          {/* Core sample */}
          <div className="relative flex gap-3 sm:gap-5 items-stretch h-[62vh]">
            <div className="relative w-14 sm:w-28 rounded-[999px] overflow-hidden border border-white/15 shadow-[inset_0_0_30px_rgba(0,0,0,.6)]">
              {ERAS.map((e, i) => (
                <div
                  key={e.name}
                  className="relative transition-[filter,opacity] duration-700"
                  style={{
                    height: `${[16, 22, 27, 35][i]}%`,
                    background: `linear-gradient(90deg, ${e.color}aa, ${e.color} 45%, ${e.color}88)`,
                    filter: i <= active ? 'saturate(1.3) brightness(1.15)' : 'saturate(.3) brightness(.45)',
                  }}
                >
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 9px)' }} />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-black/40 pointer-events-none" />
              <div ref={drill} className="absolute inset-x-0 top-0 h-full pointer-events-none">
                <div className="absolute inset-x-0 top-0 h-[2px] -translate-y-1/2 bg-[#e8702a] shadow-[0_0_16px_4px_rgba(232,112,42,.8)]" />
              </div>
            </div>
            <div className="relative text-[10px] sm:text-xs text-white/45 tabular-nums">
              {CUM.map((top, i) => (
                <span key={i} className="absolute -translate-y-1/2 whitespace-nowrap" style={{ top: `${top}%`, color: i === active || i === active + 1 ? '#fff' : undefined }}>
                  {BOUNDS[i].toLocaleString('en-US')} Ma
                </span>
              ))}
              <span className="invisible">4,540 Ma</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
          {ERAS.map((e, i) => (
            <span key={e.name} className="h-1 rounded-full transition-all duration-500" style={{ width: i === active ? 32 : 8, background: i === active ? '#e8702a' : 'rgba(255,255,255,.25)' }} />
          ))}
        </div>
      </div>
    </section>
  );
}
