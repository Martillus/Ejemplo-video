// One rAF-throttled scroll/resize loop shared by every parallax element,
// so scroll effects write styles directly instead of re-rendering React.
type Fn = (scrollY: number, vh: number) => void;
const subs = new Set<Fn>();
let queued = false;

function run() {
  queued = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  subs.forEach((fn) => fn(y, vh));
}
function queue() {
  if (!queued) {
    queued = true;
    requestAnimationFrame(run);
  }
}

export function onScroll(fn: Fn) {
  if (subs.size === 0) {
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
  }
  subs.add(fn);
  fn(window.scrollY, window.innerHeight);
  return () => {
    subs.delete(fn);
    if (subs.size === 0) {
      window.removeEventListener('scroll', queue);
      window.removeEventListener('resize', queue);
    }
  };
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
