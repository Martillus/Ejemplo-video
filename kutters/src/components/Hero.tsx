import { useEffect, useRef, useState } from 'react';
import { heroBefore, heroAfter } from '../constants';
import { useScrollY } from '../hooks/useScroll';
import MagneticButton from './MagneticButton';

const SPOTLIGHT_R = 260;

type RevealLayerProps = {
  image: string;
  cursorX: number;
  cursorY: number;
};

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const mask = `url(${canvas.toDataURL()})`;
    reveal.style.maskImage = mask;
    reveal.style.webkitMaskImage = mask;
    reveal.style.maskSize = '100% 100%';
    reveal.style.webkitMaskSize = '100% 100%';
  });

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ display: 'none' }}
      />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-bottom bg-contain bg-no-repeat bg-black z-30 pointer-events-none"
        style={{ backgroundImage: image }}
      />
    </>
  );
}

export default function Hero() {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const scrollY = useScrollY();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) mouse.current = { x: t.clientX, y: t.clientY };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    const loop = () => {
      const s = smooth.current;
      const m = mouse.current;
      s.x += (m.x - s.x) * 0.1;
      s.y += (m.y - s.y) * 0.1;
      setCursorPos((prev) =>
        Math.abs(prev.x - s.x) < 0.05 && Math.abs(prev.y - s.y) < 0.05 ? prev : { x: s.x, y: s.y },
      );
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // The reveal layer scrolls up at 0.65x (page scroll minus parallax), so the
  // viewport cursor is shifted into the layer's own coordinates.
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
  const heroProgress = Math.min(1, scrollY / vh);

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: '100dvh' }}
    >
      {/* 1. Base image with Ken Burns zoom; outer wrapper carries the parallax */}
      <div
        className="absolute inset-0 z-10 will-change-transform"
        style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
      >
        <div
          className="absolute inset-0 bg-bottom bg-contain bg-no-repeat hero-zoom origin-bottom"
          style={{ backgroundImage: `url("${heroBefore}")` }}
        />
      </div>

      {/* 2. Spotlight reveal */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
      >
        <RevealLayer image={`url("${heroAfter}")`} cursorX={cursorPos.x} cursorY={cursorPos.y + scrollY * 0.65} />
      </div>

      {/* Soft vignette so white type always reads */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/70" />

      {/* 3. Heading */}
      <div
        className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50"
        style={{
          transform: `translate3d(0, ${scrollY * -0.25}px, 0) scale(${1 - heroProgress * 0.08})`,
          opacity: 1 - heroProgress * 1.4,
        }}
      >
        <h1 className="text-white leading-[0.95]">
          <span
            className="block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim hero-reveal"
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Sharp edges
          </span>
          <span
            className="block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim hero-reveal"
            style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
          >
            crafted daily
          </span>
        </h1>
      </div>

      {/* 4. Bottom-left paragraph */}
      <div
        className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50 hero-anim hero-fade"
        style={{ animationDelay: '0.7s' }}
      >
        <p className="text-white/80 text-sm leading-relaxed">
          Every haircut is executed with meticulous detail, blending classic barbering traditions
          with modern styling to define your signature look.
        </p>
      </div>

      {/* 5. Bottom-right block */}
      <div
        className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade"
        style={{ animationDelay: '0.85s' }}
      >
        <p className="text-white/80 text-sm leading-relaxed">
          Step into our chair for tailored fades, hot towel shaves, and expert grooming services
          designed to keep you looking effortlessly sharp.
        </p>
        <MagneticButton
          href="#book"
          className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
        >
          Book Appointment
        </MagneticButton>
      </div>

      {/* Scroll cue */}
      <a
        href="#services"
        aria-label="Scroll to services"
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-50 flex-col items-center gap-3 text-white/60 hover:text-white transition-colors hero-anim hero-fade"
        style={{ animationDelay: '1.1s' }}
      >
        <span className="relative w-[22px] h-[36px] rounded-full border border-current">
          <span className="scroll-dot absolute left-1/2 top-2 -ml-[2px] w-1 h-1.5 rounded-full bg-current" />
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
      </a>

      {/* Hint for pointer users */}
      <div
        className="hidden md:block absolute top-1/2 right-10 z-50 origin-right -rotate-90 translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-white/50 hero-anim hero-fade"
        style={{ animationDelay: '1.3s' }}
      >
        Move your cursor · see the cut
      </div>
    </section>
  );
}
