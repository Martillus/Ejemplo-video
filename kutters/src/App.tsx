import { useCallback, useEffect, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Services from './components/Services';
import Transformation from './components/Transformation';
import Testimonials from './components/Testimonials';
import Book from './components/Book';
import ScrollProgress from './components/ScrollProgress';
import { useReveal } from './hooks/useReveal';

export default function App() {
  const [revealed, setRevealed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);

  const onReveal = useCallback(() => setRevealed(true), []);
  const onDone = useCallback(() => setLoaderGone(true), []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = loaderGone ? '' : 'hidden';
  }, [loaderGone]);

  useReveal(revealed);

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {!loaderGone && <Loader onReveal={onReveal} onDone={onDone} />}
      {revealed ? (
        <>
          <ScrollProgress />
          <Nav show={revealed} />
          <main className="bg-black">
            <Hero />
            <Marquee />
            <Services />
            <Transformation />
            <Testimonials />
            <Book />
          </main>
          <div className="grain fixed -inset-[20%] z-[60] opacity-[0.05] pointer-events-none mix-blend-overlay" aria-hidden />
        </>
      ) : (
        <div className="h-screen bg-black" />
      )}
    </div>
  );
}
