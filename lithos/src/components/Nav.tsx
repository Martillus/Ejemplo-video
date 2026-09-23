import { useEffect, useRef, useState } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { onScroll } from '../lib/scroll';

const LINKS = ['Course', 'Field Guides', 'Geology', 'Plans', 'Live Tour'];

export function Logo({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="#ffffff" aria-hidden>
      <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(
    () =>
      onScroll((y) => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar.current) bar.current.style.transform = `scaleX(${h > 0 ? y / h : 0})`;
        navRef.current?.classList.toggle('nav-solid', y > window.innerHeight * 0.6);
      }),
    [],
  );

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 transition-[background-color,backdrop-filter] duration-500 [&.nav-solid]:bg-black/40 [&.nav-solid]:backdrop-blur-xl"
      >
        <div ref={bar} className="absolute left-0 right-0 bottom-0 h-px bg-[#e8702a] origin-left" style={{ transform: 'scaleX(0)' }} />
        <a href="#top" className="flex items-center gap-2.5 group">
          <span className="transition-transform duration-700 group-hover:rotate-180">
            <Logo />
          </span>
          <span className="text-white text-2xl font-playfair italic">Lithos</span>
        </a>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          {LINKS.map((l, i) => (
            <button
              key={l}
              className={
                i === 0
                  ? 'text-white px-4 py-1.5 rounded-full text-sm font-medium bg-white/20'
                  : 'text-white/80 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-white/20 hover:text-white transition-colors'
              }
            >
              {l}
            </button>
          ))}
        </div>

        <button className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-transform hover:scale-[1.03]">
          Sign Up
        </button>

        <button
          className="md:hidden text-white w-10 h-10 grid place-items-center rounded-full bg-white/15 backdrop-blur-md border border-white/25"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className="md:hidden fixed inset-0 z-[99] bg-[#0b0907]/95 backdrop-blur-xl flex flex-col justify-center px-8 transition-[clip-path] duration-700"
        style={{ clipPath: open ? 'circle(150% at 100% 0%)' : 'circle(0% at 100% 0%)', transitionTimingFunction: 'cubic-bezier(0.77,0,0.18,1)' }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {LINKS.map((l, i) => (
            <li
              key={l}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'none' : 'translateY(24px)',
                transition: `all .7s cubic-bezier(0.16,1,0.3,1) ${open ? 0.15 + i * 0.06 : 0}s`,
              }}
            >
              <button onClick={() => setOpen(false)} className="flex items-center justify-between w-full py-3 border-b border-white/10 text-white text-3xl font-playfair italic">
                {l}
                <ArrowUpRight size={20} className="text-[#e8702a]" />
              </button>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setOpen(false)}
          className="mt-10 bg-white text-gray-900 text-sm font-semibold px-6 py-3 rounded-full self-start"
          style={{ opacity: open ? 1 : 0, transition: `opacity .6s ${open ? 0.5 : 0}s` }}
        >
          Sign Up
        </button>
      </div>
    </>
  );
}
