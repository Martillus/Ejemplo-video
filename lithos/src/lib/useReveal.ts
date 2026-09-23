import { useEffect } from 'react';

// Adds `is-in` to every .reveal / .clip-reveal element once it enters the viewport.
// A fully clipped element never reports as intersecting, so .clip-reveal is
// watched through its parent.
export function useReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const owners = new Map<Element, HTMLElement[]>();
    document.querySelectorAll<HTMLElement>('.reveal, .clip-reveal').forEach((el) => {
      const target = el.classList.contains('clip-reveal') && el.parentElement ? el.parentElement : el;
      owners.set(target, [...(owners.get(target) ?? []), el]);
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          owners.get(e.target)?.forEach((el) => el.classList.add('is-in'));
          io.unobserve(e.target);
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    owners.forEach((_, t) => io.observe(t));
    return () => io.disconnect();
  }, [active]);
}
