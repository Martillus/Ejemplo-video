import { useEffect, useRef, useState } from 'react';
import { Menu, Scissors, X, ArrowUpRight } from 'lucide-react';
import MagneticButton from './MagneticButton';

const LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'The Cut', href: '#transformation' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Visit', href: '#book' },
];

export default function Nav({ show }: { show: boolean }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > window.innerHeight * 0.8);
      setHidden(y > lastY.current && y > 200);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  const visible = show && (!hidden || open);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-[70]"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          transform: visible ? 'translateY(0)' : 'translateY(-120%)',
          opacity: show ? 1 : 0,
          transition: 'transform .7s cubic-bezier(0.16,1,0.3,1), opacity .8s ease',
        }}
      >
        <nav
          className={`mx-auto flex items-center justify-between px-5 sm:px-10 md:px-14 py-5 transition-all duration-500 ${
            solid && !open ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-4' : ''
          }`}
        >
          <a href="#top" className="flex items-center gap-2 text-white group" aria-label="Kutters home">
            <span className="w-8 h-8 rounded-full bg-[#e8702a] flex items-center justify-center transition-transform duration-500 group-hover:rotate-[-25deg]">
              <Scissors className="w-4 h-4" strokeWidth={2} />
            </span>
            <span className="font-playfair italic text-2xl" style={{ letterSpacing: '-0.04em' }}>
              Kutters
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 p-1.5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="block px-4 py-1.5 rounded-full text-sm text-white/80 hover:text-black hover:bg-white transition-colors duration-300"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <MagneticButton
            href="#book"
            className="hidden md:inline-flex bg-white text-black text-sm font-medium px-5 py-2.5 rounded-full hover:bg-[#e8702a] hover:text-white"
          >
            Book Now <ArrowUpRight className="w-4 h-4" />
          </MagneticButton>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className="md:hidden fixed inset-0 z-[65] bg-[#0b0a09] flex flex-col justify-end px-5 pb-12"
        style={{
          clipPath: open ? 'circle(150% at calc(100% - 42px) 42px)' : 'circle(0% at calc(100% - 42px) 42px)',
          transition: 'clip-path .8s cubic-bezier(0.76,0,0.24,1)',
          pointerEvents: open ? 'auto' : 'none',
        }}
        aria-hidden={!open}
      >
        <ul className="flex flex-col gap-2">
          {LINKS.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                tabIndex={open ? 0 : -1}
                className="block font-playfair italic text-6xl text-white"
                style={{
                  letterSpacing: '-0.04em',
                  transform: open ? 'translateY(0)' : 'translateY(110%)',
                  transition: `transform .8s cubic-bezier(0.16,1,0.3,1) ${open ? 0.25 + i * 0.07 : 0}s`,
                }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#book"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className="mt-10 bg-[#e8702a] text-white text-center text-sm font-medium py-4 rounded-full"
          style={{ opacity: open ? 1 : 0, transition: `opacity .6s ease ${open ? 0.6 : 0}s` }}
        >
          Book Now
        </a>
      </div>
    </>
  );
}
