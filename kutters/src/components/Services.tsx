import { ArrowUpRight, Clock } from 'lucide-react';

const SERVICES = [
  { name: 'Signature Cut', note: 'Consultation, precision cut, wash and style finish.', time: '45 min', price: 35 },
  { name: 'Skin Fade', note: 'Foil-close fade blended by hand, razor-clean neckline.', time: '50 min', price: 38 },
  { name: 'Hot Towel Shave', note: 'Pre-shave oil, two hot towels, straight razor, cold finish.', time: '40 min', price: 32 },
  { name: 'Beard Sculpt', note: 'Shape, line and condition, finished with a razor edge.', time: '30 min', price: 24 },
  { name: 'The Full Ritual', note: 'Signature cut, hot towel shave and scalp massage.', time: '80 min', price: 60 },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative bg-black text-white px-5 sm:px-10 md:px-14 py-24 sm:py-36"
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

        <ul className="border-t border-white/15">
          {SERVICES.map((s, i) => (
            <li key={s.name} className="reveal" style={{ transitionDelay: `${i * 0.06}s` }}>
              <a
                href="#book"
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

    </section>
  );
}
