import { useEffect } from 'react';

/** Adds `is-in` to every `.reveal` / `.line-mask` element once it scrolls into view. */
export function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const els = document.querySelectorAll<HTMLElement>('.reveal, .line-mask');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [active]);
}
