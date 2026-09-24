import { useRef } from 'react';
import { Scissors } from 'lucide-react';
import { useViewportProgress } from '../hooks/useScroll';

const ITEMS = ['Skin Fades', 'Hot Towel Shaves', 'Beard Sculpting', 'Scissor Cuts', 'Line-ups', 'Hair Tattoos'];

function Row({ reverse, tone }: { reverse?: boolean; tone: 'orange' | 'cream' }) {
  const items = [...ITEMS, ...ITEMS];
  return (
    <div
      className={`overflow-hidden py-4 sm:py-5 ${
        tone === 'orange' ? 'bg-[#e8702a] text-white' : 'bg-[#f5efe6] text-black'
      }`}
    >
      <div className={`marquee-track flex w-max ${reverse ? 'reverse' : ''}`}>
        {[0, 1].map((dup) => (
          <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
            {items.map((t, i) => (
              <span key={i} className="flex items-center gap-6 sm:gap-10 pr-6 sm:pr-10">
                <span
                  className={`text-3xl sm:text-5xl whitespace-nowrap ${i % 2 ? 'font-playfair italic' : 'font-medium'}`}
                  style={{ letterSpacing: '-0.05em' }}
                >
                  {t}
                </span>
                <Scissors className="w-6 h-6 sm:w-8 sm:h-8 shrink-0 opacity-80" strokeWidth={1.5} />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Two crossing ribbons whose tilt eases flat as they scroll through the viewport. */
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useViewportProgress(ref);
  const tilt = (0.5 - p) * 6;
  return (
    <div ref={ref} className="relative bg-black py-16 sm:py-24 overflow-hidden">
      <div style={{ transform: `rotate(${-3 + tilt * 0.3}deg) translateX(${(p - 0.5) * -12}%) scale(1.1)` }}>
        <Row tone="cream" reverse />
      </div>
      <div className="relative z-10 -mt-10 sm:-mt-12" style={{ transform: `rotate(${2.5 - tilt * 0.3}deg) translateX(${(p - 0.5) * 12}%) scale(1.1)` }}>
        <Row tone="orange" />
      </div>
    </div>
  );
}
