import { useScrollY } from '../hooks/useScroll';

export default function ScrollProgress() {
  const y = useScrollY();
  const max = typeof document !== 'undefined' ? document.documentElement.scrollHeight - window.innerHeight : 1;
  const p = max > 0 ? y / max : 0;
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[80] pointer-events-none">
      <div className="h-full bg-[#e8702a] origin-left" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
