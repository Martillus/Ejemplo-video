import { useEffect, useRef } from 'react';
import { onScroll, clamp } from '../lib/scroll';

const LINE = 'The present is the key to the past. The same slow forces that settle silt in a river today laid down the cliffs you walk past.';

// Words ink in one by one as the paragraph passes through the viewport.
export default function Principle() {
  const ref = useRef<HTMLDivElement>(null);
  const words = LINE.split(' ');

  useEffect(
    () =>
      onScroll((_, vh) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
        const spans = el.querySelectorAll<HTMLSpanElement>('[data-w]');
        const lit = p * spans.length;
        spans.forEach((s, i) => {
          const o = clamp(lit - i);
          s.style.opacity = String(0.14 + o * 0.86);
          s.style.filter = `blur(${(1 - o) * 3}px)`;
        });
      }),
    [],
  );

  return (
    <section className="relative bg-[#0b0907] px-5 sm:px-10 md:px-14 py-32 sm:py-44">
      <div className="max-w-5xl mx-auto">
        <div className="reveal flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-10">
          <span className="w-8 h-px bg-[#e8702a]" />
          Uniformitarianism · Hutton, 1788
        </div>
        <div ref={ref} className="text-white text-3xl sm:text-5xl md:text-6xl leading-[1.08]" style={{ letterSpacing: '-0.04em', textWrap: 'balance' } as React.CSSProperties}>
          {words.map((w, i) => (
            <span key={i} data-w className={`inline-block mr-[0.25em] transition-[opacity,filter] duration-300 ${i < 8 ? 'font-playfair italic' : ''}`} style={{ opacity: 0.14 }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
