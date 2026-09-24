import { useRef } from 'react';
import { ArrowUpRight, MapPin, Phone, AtSign } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useViewportProgress } from '../hooks/useScroll';

const HOURS = [
  ['Mon – Fri', '10:00 – 20:30'],
  ['Saturday', '09:00 – 18:00'],
  ['Sunday', 'Closed'],
];

export default function Book() {
  const footRef = useRef<HTMLDivElement>(null);
  const p = useViewportProgress(footRef);

  return (
    <section id="book" className="relative bg-[#e8702a] text-white overflow-hidden">
      <div className="px-5 sm:px-10 md:px-14 pt-24 sm:pt-36 pb-16 max-w-6xl mx-auto">
        <p className="reveal text-xs uppercase tracking-[0.3em] text-white/75 mb-6">Walk-ins welcome · Booking preferred</p>
        <h2 className="text-6xl sm:text-8xl md:text-9xl leading-[0.9]" style={{ letterSpacing: '-0.07em' }}>
          <span className="line-mask"><span>Take a seat,</span></span>
          <span className="line-mask"><span className="font-playfair italic" style={{ transitionDelay: '0.1s' }}>leave sharp.</span></span>
        </h2>

        <div className="mt-14 grid md:grid-cols-[auto_1fr_1fr] gap-12 md:gap-16 items-start">
          <div className="reveal">
            <MagneticButton
              href="#top"
              strength={0.45}
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-black text-white text-base font-medium hover:scale-105 hover:bg-white hover:text-black"
            >
              Book a chair <ArrowUpRight className="w-5 h-5" />
            </MagneticButton>
          </div>

          <div className="reveal flex flex-col gap-4 text-sm" style={{ transitionDelay: '0.1s' }}>
            <span className="text-xs uppercase tracking-[0.25em] text-white/70">Find us</span>
            <span className="flex items-start gap-3"><MapPin className="w-4 h-4 mt-0.5 shrink-0" /> Calle del Pez 18, 28004 Madrid</span>
            <span className="flex items-center gap-3 select-all"><Phone className="w-4 h-4 shrink-0" /> +34 910 555 018</span>
            <span className="flex items-center gap-3"><AtSign className="w-4 h-4 shrink-0" /> @kutters.barbers</span>
          </div>

          <div className="reveal text-sm" style={{ transitionDelay: '0.2s' }}>
            <span className="block text-xs uppercase tracking-[0.25em] text-white/70 mb-4">Hours</span>
            <dl className="divide-y divide-white/25 border-y border-white/25">
              {HOURS.map(([d, h]) => (
                <div key={d} className="flex justify-between py-3">
                  <dt>{d}</dt>
                  <dd className="tabular-nums">{h}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Giant wordmark footer rising in */}
      <div ref={footRef} className="relative overflow-hidden">
        <div
          className="font-playfair italic text-center leading-[0.8] text-black select-none"
          style={{
            fontSize: 'clamp(120px, 30vw, 460px)',
            letterSpacing: '-0.07em',
            transform: `translateY(${(1 - Math.min(1, p * 1.6)) * 35}%)`,
          }}
          aria-hidden
        >
          Kutters
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-2 px-5 sm:px-10 md:px-14 py-6 text-xs text-white/75 border-t border-black/15">
          <span>© {new Date().getFullYear()} Kutters Barbershop</span>
          <a href="#top" className="hover:text-white">Back to top ↑</a>
        </div>
      </div>
    </section>
  );
}
