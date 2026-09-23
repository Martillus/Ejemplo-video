import { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { onScroll, clamp } from '../lib/scroll';
import { Logo } from './Nav';

export default function Finale({ image }: { image: string }) {
  const sec = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(
    () =>
      onScroll((_, vh) => {
        const el = sec.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height));
        if (bg.current) bg.current.style.transform = `translate3d(0, ${(p - 0.5) * -18}%, 0) scale(1.2)`;
        if (word.current) word.current.style.transform = `translate3d(0, ${(1 - clamp(p * 1.6)) * 40}%, 0)`;
      }),
    [],
  );

  // Magnetic button: it leans toward the pointer
  const magnet = (e: React.PointerEvent) => {
    const b = btn.current;
    if (!b) return;
    const r = b.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    b.style.transform = `translate(${x * 0.3}px, ${y * 0.4}px)`;
  };
  const release = () => {
    if (btn.current) btn.current.style.transform = 'translate(0,0)';
  };

  return (
    <section ref={sec} className="relative overflow-hidden bg-black">
      <div ref={bg} className="absolute inset-0 bg-center bg-cover will-change-transform" style={{ backgroundImage: `url(${image})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0907] via-black/55 to-[#0b0907]" />

      <div className="relative px-5 sm:px-10 md:px-14 pt-36 sm:pt-48 pb-10 max-w-6xl mx-auto flex flex-col items-center text-center">
        <div className="reveal text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-6">Enrolment open · Autumn field season</div>
        <h2 className="clip-reveal text-white text-5xl sm:text-7xl md:text-8xl leading-[0.95]" style={{ letterSpacing: '-0.07em' }}>
          <span className="font-playfair italic">The ground</span> is
          <br />
          waiting to talk
        </h2>
        <p className="reveal mt-8 text-white/70 text-sm sm:text-base leading-relaxed max-w-md" style={{ '--d': '.15s' } as React.CSSProperties}>
          Twelve weeks, forty outcrops, one hammer. Learn to read four and a half billion years of history in the rock under your city.
        </p>
        <div className="reveal mt-10 p-6 -m-6" style={{ '--d': '.3s' } as React.CSSProperties} onPointerMove={magnet} onPointerLeave={release}>
          <button
            ref={btn}
            className="group inline-flex items-center gap-2 bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium pl-8 pr-6 py-4 rounded-full transition-[background-color,box-shadow,transform] duration-300 ease-out hover:shadow-2xl hover:shadow-[#e8702a]/40 active:scale-95"
          >
            Start Digging
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          ref={word}
          className="font-playfair italic text-white/90 text-center leading-[0.8] select-none pointer-events-none"
          style={{ fontSize: 'clamp(6rem, 30vw, 28rem)', letterSpacing: '-0.06em' }}
          aria-hidden
        >
          Lithos
        </div>
      </div>

      <footer className="relative border-t border-white/10 px-5 sm:px-10 md:px-14 py-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-white/50 text-xs">
        <div className="flex items-center gap-2 text-white">
          <Logo size={18} />
          <span className="font-playfair italic text-lg">Lithos</span>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour'].map((l) => (
            <a key={l} href="#top" className="hover:text-white transition-colors">
              {l}
            </a>
          ))}
        </nav>
        <span className="tabular-nums">© 2026 Lithos · Est. 4,540 Ma</span>
      </footer>
    </section>
  );
}
