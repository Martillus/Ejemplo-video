import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Clock } from 'lucide-react';
import { bg1, bg2 } from '../constants';

const SERVICES = [
  { name: 'Signature Cut', note: 'Consultation, precision cut, wash and style finish.', time: '45 min', price: 35, img: bg2, pos: '50% 30%' },
  { name: 'Skin Fade', note: 'Foil-close fade blended by hand, razor-clean neckline.', time: '50 min', price: 38, img: bg2, pos: '40% 20%' },
  { name: 'Hot Towel Shave', note: 'Pre-shave oil, two hot towels, straight razor, cold finish.', time: '40 min', price: 32, img: bg1, pos: '50% 40%' },
  { name: 'Beard Sculpt', note: 'Shape, line and condition, finished with a razor edge.', time: '30 min', price: 24, img: bg1, pos: '60% 60%' },
  { name: 'The Full Ritual', note: 'Signature cut, hot towel shave and scalp massage.', time: '80 min', price: 60, img: bg2, pos: '55% 45%' },
];

export default function Services() {
  const [active, setActive] = useState<number | null>(null);
  const preview = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  // Floating preview trails the pointer with the same easing as the hero spotlight.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      const vx = target.current.x - pos.current.x;
      if (preview.current) {
        preview.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%) rotate(${Math.max(-12, Math.min(12, vx * 0.08))}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="services"
      className="relative bg-black text-white px-5 sm:px-10 md:px-14 py-24 sm:py-36"
      onMouseMove={(e) => {
        target.current = { x: e.clientX, y: e.clientY };
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14 sm:mb-20">
          <h2 className="text-5xl sm:text-7xl leading-[0.95]" style={{ letterSpacing: '-0.06em' }}>
            <span className="line-mask"><span>The</span></span>
            <span className="line-mask"><span className="font-playfair italic text-[#e8702a]" style={{ transitionDelay: '0.1s' }}>menu</span></span>
          </h2>
          <p className="reveal max-w-sm text-white/60 text-sm leading-relaxed">
            Every service starts with a conversation about how you wear your hair day to day. Prices
            include a wash, style and a hot towel to finish.
          </p>
        </div>

        <ul className="border-t border-white/15" onMouseLeave={() => setActive(null)}>
          {SERVICES.map((s, i) => (
            <li key={s.name} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <a
                href="#book"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group relative grid grid-cols-[1fr_auto] md:grid-cols-[1.2fr_1.5fr_auto_auto] items-center gap-x-6 gap-y-2 py-7 sm:py-9 border-b border-white/15 overflow-hidden focus-visible:outline-none"
              >
                <span className="absolute inset-0 bg-[#e8702a] origin-bottom scale-y-0 group-hover:scale-y-100 group-focus-visible:scale-y-100 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span
                  className="relative text-3xl sm:text-5xl transition-transform duration-500 group-hover:translate-x-4"
                  style={{ letterSpacing: '-0.05em' }}
                >
                  {i % 2 ? <span className="font-playfair italic">{s.name}</span> : s.name}
                </span>
                <span className="relative hidden md:block text-sm text-white/55 group-hover:text-white/90 transition-colors max-w-xs">
                  {s.note}
                </span>
                <span className="relative hidden md:flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-white/50 group-hover:text-white/90">
                  <Clock className="w-3.5 h-3.5" /> {s.time}
                </span>
                <span className="relative flex items-center gap-3 justify-end">
                  <span className="text-2xl sm:text-3xl tabular-nums" style={{ letterSpacing: '-0.04em' }}>
                    €{s.price}
                  </span>
                  <span className="w-10 h-10 rounded-full border border-white/25 flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-[#e8702a] group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </span>
                <span className="relative md:hidden col-span-2 text-sm text-white/55">
                  {s.note} · {s.time}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Cursor preview (pointer devices only) */}
      <div
        ref={preview}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden md:block w-60 h-72 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          opacity: active === null ? 0 : 1,
          scale: active === null ? '0.6' : '1',
          transition: 'opacity .35s ease, scale .5s cubic-bezier(0.16,1,0.3,1)',
        }}
        aria-hidden
      >
        {SERVICES.map((s, i) => (
          <div
            key={s.name}
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: s.img,
              backgroundPosition: s.pos,
              clipPath: active === i ? 'inset(0 0 0 0)' : 'inset(100% 0 0 0)',
              transition: 'clip-path .6s cubic-bezier(0.76,0,0.24,1)',
            }}
          />
        ))}
      </div>
    </section>
  );
}
