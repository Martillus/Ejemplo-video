import { useRef } from 'react';
import { Layers, Compass, Radio, ArrowUpRight } from 'lucide-react';

const KIT = [
  {
    icon: Layers,
    title: 'Interactive Maps',
    body: 'Peel back the crust layer by layer, from topsoil to bedrock, on cross-sections you can rotate and slice.',
    tag: 'Stratigraphy',
    hue: '#e8702a',
  },
  {
    icon: Compass,
    title: 'Field Guides',
    body: 'Name a specimen on the spot with streak, luster and Mohs hardness tests, then log its strike and dip.',
    tag: 'Mineralogy',
    hue: '#d8b98f',
  },
  {
    icon: Radio,
    title: 'Live Tours',
    body: 'Walk basalt columns, limestone karst and glacial moraines with working geologists, streamed from the outcrop.',
    tag: 'Fieldwork',
    hue: '#7fa39a',
  },
];

function Card({ k, i }: { k: (typeof KIT)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const Icon = k.icon;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 12}deg) translateZ(0)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
  };

  return (
    <div className="reveal" style={{ '--d': `${i * 0.12}s` } as React.CSSProperties}>
      <div
        ref={ref}
        onPointerMove={move}
        onPointerLeave={leave}
        className="group relative h-full rounded-3xl border border-white/10 bg-white/[0.03] p-7 sm:p-8 overflow-hidden transition-transform duration-300 ease-out will-change-transform"
        style={{ '--mx': '50%', '--my': '0%' } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(360px circle at var(--mx) var(--my), ${k.hue}33, transparent 60%)` }}
        />
        <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: k.hue }} />
        <div className="relative flex flex-col h-full gap-6">
          <div className="flex items-center justify-between">
            <span className="w-12 h-12 rounded-2xl grid place-items-center border border-white/15 bg-white/5 text-white transition-transform duration-500 group-hover:rotate-[-8deg] group-hover:scale-110">
              <Icon size={20} strokeWidth={1.6} />
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">{k.tag}</span>
          </div>
          <h3 className="text-white text-3xl font-playfair italic" style={{ letterSpacing: '-0.03em' }}>
            {k.title}
          </h3>
          <p className="text-white/65 text-sm leading-relaxed">{k.body}</p>
          <span className="mt-auto inline-flex items-center gap-1.5 text-sm text-white/80 group-hover:text-white">
            Explore
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: k.hue }} />
          </span>
        </div>
      </div>
    </div>
  );
}

export default function FieldKit() {
  return (
    <section className="relative bg-[#0b0907] px-5 sm:px-10 md:px-14 py-28 sm:py-40">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="reveal flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[#e8702a] mb-5">
              <span className="w-8 h-px bg-[#e8702a]" />
              The field kit
            </div>
            <h2 className="clip-reveal text-white text-4xl sm:text-6xl leading-[0.98]" style={{ letterSpacing: '-0.06em' }}>
              <span className="font-playfair italic">Read the rock</span> <br className="hidden sm:block" />
              like a geologist
            </h2>
          </div>
          <p className="reveal text-white/60 text-sm leading-relaxed max-w-xs" style={{ '--d': '.15s' } as React.CSSProperties}>
            Three tools, one course. Start at the surface and work down, the way every outcrop asks to be read.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {KIT.map((k, i) => (
            <Card key={k.title} k={k} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
