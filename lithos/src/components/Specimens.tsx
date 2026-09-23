import { useEffect, useRef } from 'react';
import { onScroll } from '../lib/scroll';

// Name, rock family, Mohs hardness
const ROW_A: [string, string, string][] = [
  ['Obsidian', 'Igneous', '5.5'], ['Granite', 'Igneous', '6–7'], ['Basalt', 'Igneous', '6'], ['Pumice', 'Igneous', '6'], ['Quartz', 'Mineral', '7'], ['Garnet', 'Mineral', '7.5'],
];
const ROW_B: [string, string, string][] = [
  ['Marble', 'Metamorphic', '3'], ['Gneiss', 'Metamorphic', '6–7'], ['Slate', 'Metamorphic', '3–4'], ['Sandstone', 'Sedimentary', '6–7'], ['Limestone', 'Sedimentary', '3'], ['Shale', 'Sedimentary', '3'],
];

function Row({ items, reverse, dur }: { items: [string, string, string][]; reverse?: boolean; dur: string }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex overflow-hidden">
      <div className={`marquee-track flex shrink-0 items-center${reverse ? ' reverse' : ''}`} style={{ '--dur': dur } as React.CSSProperties}>
        {doubled.map(([n, fam, h], i) => (
          <div key={i} className="flex items-center gap-5 px-6 sm:px-8 group">
            <span className="text-white text-5xl sm:text-7xl md:text-8xl whitespace-nowrap transition-colors duration-300 group-hover:text-[#e8702a]" style={{ letterSpacing: '-0.06em' }}>
              <span className={i % 2 ? 'font-playfair italic' : ''}>{n}</span>
            </span>
            <span className="flex flex-col text-[10px] uppercase tracking-[0.2em] text-white/40 leading-5 whitespace-nowrap">
              <span>{fam}</span>
              <span className="tabular-nums">Mohs {h}</span>
            </span>
            <span className="w-2 h-2 rotate-45 bg-[#e8702a] ml-4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Specimens() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let last = window.scrollY;
    let skew = 0;
    let settle = 0;
    const off = onScroll((y) => {
      const v = y - last;
      last = y;
      skew += (Math.max(-8, Math.min(8, v * 0.25)) - skew) * 0.5;
      if (ref.current) ref.current.style.transform = `skewX(${-skew}deg)`;
      clearTimeout(settle);
      settle = window.setTimeout(() => {
        skew = 0;
        if (ref.current) ref.current.style.transform = 'skewX(0deg)';
      }, 120);
    });
    return () => {
      clearTimeout(settle);
      off();
    };
  }, []);

  return (
    <section className="relative bg-[#0b0907] py-16 sm:py-24 border-y border-white/10 overflow-hidden" aria-label="Specimen index">
      <div ref={ref} className="flex flex-col gap-4 sm:gap-6 transition-transform duration-300 ease-out">
        <Row items={ROW_A} dur="46s" />
        <Row items={ROW_B} dur="52s" reverse />
      </div>
    </section>
  );
}
