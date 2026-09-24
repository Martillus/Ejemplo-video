import { ReactNode, useRef } from 'react';

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  strength?: number;
  onClick?: () => void;
};

/** A link that leans toward the pointer while hovered. */
export default function MagneticButton({ href, className = '', children, strength = 0.35, onClick }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.translate = `${dx * strength}px ${dy * strength}px`;
    if (inner.current) inner.current.style.translate = `${dx * strength * 0.4}px ${dy * strength * 0.4}px`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.translate = '0px 0px';
    if (inner.current) inner.current.style.translate = '0px 0px';
  };

  return (
    <a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#e8702a] ${className}`}
      style={{ transitionProperty: 'all, translate', transitionDuration: '300ms, 450ms', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
    >
      <span ref={inner} className="inline-flex items-center gap-2" style={{ transition: 'translate 450ms cubic-bezier(0.16,1,0.3,1)' }}>
        {children}
      </span>
    </a>
  );
}
