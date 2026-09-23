import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { onScroll } from '../lib/scroll';

const SPOTLIGHT_R = 260;
const AUTOPILOT_AFTER = 6000; // ms without input before the spotlight wanders on its own

interface RevealProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

function RevealLayer({ image, cursorX, cursorY }: RevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const size = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    size();
    window.addEventListener('resize', size);
    return () => window.removeEventListener('resize', size);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const reveal = revealRef.current;
    if (!canvas || !reveal) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,1)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    g.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    g.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    const url = `url(${canvas.toDataURL()})`;
    reveal.style.maskImage = url;
    reveal.style.webkitMaskImage = url;
    reveal.style.maskSize = '100% 100%';
    reveal.style.webkitMaskSize = '100% 100%';
  });

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: 'none' }} />
      <div
        ref={revealRef}
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{ backgroundImage: `url(${image})` }}
      />
    </>
  );
}

interface HeroProps {
  bg1: string;
  bg2: string;
  started: boolean;
}

export default function Hero({ bg1, bg2, started }: HeroProps) {
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number>(0);
  const lastInput = useRef(-Infinity);
  const visible = useRef(true);
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const scrollY = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      lastInput.current = performance.now();
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.current.x = t.clientX;
      mouse.current.y = t.clientY;
      lastInput.current = performance.now();
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });

    const loop = (now: number) => {
      if (visible.current) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        // Until someone moves the pointer, drift along a slow Lissajous path.
        if (now - lastInput.current > AUTOPILOT_AFTER) {
          const t = now / 1000;
          mouse.current.x = w * (0.5 + 0.3 * Math.sin(t * 0.45));
          mouse.current.y = h * (0.58 + 0.16 * Math.sin(t * 0.7 + 1));
          if (smooth.current.x < -500) smooth.current = { ...mouse.current };
        }
        const s = smooth.current;
        const dx = (mouse.current.x - s.x) * 0.1;
        const dy = (mouse.current.y - s.y) * 0.1;
        s.x += dx;
        s.y += dy;
        if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) setCursorPos({ x: s.x, y: s.y });

        // Heading drifts against the light for depth
        const px = (s.x / w - 0.5) * -18;
        const py = (s.y / h - 0.5) * -10;
        if (headingRef.current) {
          headingRef.current.style.transform = `translate3d(${px}px, ${py + scrollY.current * 0.45}px, 0)`;
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
        }
        if (readoutRef.current) {
          const depth = Math.max(0, (s.y / h) * 1200);
          readoutRef.current.textContent = `${Math.round(depth).toLocaleString('en-US')} m · ${(depth * 0.21).toFixed(1)} Ma`;
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const off = onScroll((y, vh) => {
      scrollY.current = y;
      visible.current = y < vh * 1.05;
      const p = Math.min(1, y / vh);
      if (leftRef.current) leftRef.current.style.transform = `translate3d(0, ${y * -0.18}px, 0)`;
      if (rightRef.current) rightRef.current.style.transform = `translate3d(0, ${y * -0.28}px, 0)`;
      if (shadeRef.current) shadeRef.current.style.opacity = String(p * 0.85);
      if (headingRef.current) headingRef.current.style.opacity = String(1 - p * 1.3);
    });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchstart', onTouch);
      cancelAnimationFrame(rafRef.current);
      off();
    };
  }, []);

  const go = started ? '' : ' [animation-play-state:paused]';

  return (
    <section ref={sectionRef} id="top" className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
      <div
        className={`absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom${go}`}
        style={{ backgroundImage: `url(${bg1})` }}
      />

      <RevealLayer image={bg2} cursorX={cursorPos.x} cursorY={cursorPos.y} />

      {/* Legibility vignette + scroll dimmer */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.55)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 z-40 pointer-events-none bg-gradient-to-t from-black/60 to-transparent" />
      <div ref={shadeRef} className="absolute inset-0 z-[45] pointer-events-none bg-[#0b0907]" style={{ opacity: 0 }} />

      {/* Spotlight ring with a depth readout (fine pointers only) */}
      <div ref={ringRef} className="hidden [@media(pointer:fine)]:block absolute left-0 top-0 z-[55] pointer-events-none" style={{ transform: 'translate3d(-999px,-999px,0)' }}>
        <div
          className="absolute rounded-full border border-white/25"
          style={{ width: SPOTLIGHT_R * 1.5, height: SPOTLIGHT_R * 1.5, left: -SPOTLIGHT_R * 0.75, top: -SPOTLIGHT_R * 0.75, opacity: started ? 1 : 0, transition: 'opacity 1s 1.2s' }}
        />
        <div className="absolute w-1.5 h-1.5 -left-[3px] -top-[3px] rounded-full bg-[#e8702a] shadow-[0_0_12px_#e8702a]" />
        <span
          ref={readoutRef}
          className="absolute whitespace-nowrap text-[10px] uppercase tracking-[0.2em] text-white/70 tabular-nums"
          style={{ left: SPOTLIGHT_R * 0.55, top: SPOTLIGHT_R * 0.55, opacity: started ? 1 : 0, transition: 'opacity 1s 1.2s' }}
        />
      </div>

      <div ref={headingRef} className="absolute top-[14%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50 will-change-transform">
        <h1 className="text-white leading-[0.95]">
          <span
            className={`block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl hero-anim${started ? ' hero-reveal' : ''}`}
            style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
          >
            Layers hold
          </span>
          <span
            className={`block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1 hero-anim${started ? ' hero-reveal' : ''}`}
            style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
          >
            tales of time
          </span>
        </h1>
      </div>

      <div ref={leftRef} className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50">
        <div className={`hero-anim${started ? ' hero-fade' : ''}`} style={{ animationDelay: '0.7s' }}>
          <p className="text-sm text-white/80 leading-relaxed">
            Every layer of sediment records a chapter of our planet, from ancient seabeds to drifting ash, layered across millions of years beneath us.
          </p>
        </div>
      </div>

      <div
        ref={rightRef}
        className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] z-50"
      >
        <div className={`flex flex-col items-start gap-4 sm:gap-5 hero-anim${started ? ' hero-fade' : ''}`} style={{ animationDelay: '0.85s' }}>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Our interactive maps let you peel back the crust to trace how stones, fossils, and deep time combine to shape the ground beneath your feet.
          </p>
          <a
            href="#deep-time"
            className="bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30"
          >
            Start Digging
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#deep-time"
        className={`hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex-col items-center gap-2 text-white/60 text-[10px] uppercase tracking-[0.3em] hero-anim${started ? ' hero-fade' : ''}`}
        style={{ animationDelay: '1.2s' }}
      >
        <span className="relative block w-px h-10 bg-white/20 overflow-hidden scroll-cue" />
        <ArrowDown size={12} />
      </a>
    </section>
  );
}
