import { useEffect, useState } from 'react';
import Loader from './components/Loader';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Principle from './components/Principle';
import DeepTime from './components/DeepTime';
import FieldKit from './components/FieldKit';
import Specimens from './components/Specimens';
import Finale from './components/Finale';
import { loadOrGenerate } from './lib/strata';
import { useReveal } from './lib/useReveal';

const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';

export default function App() {
  const [images, setImages] = useState<{ bg1: string; bg2: string } | null>(null);
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('is-loading');
    let alive = true;
    Promise.all([
      loadOrGenerate(BG_IMAGE_1, 'surface'),
      loadOrGenerate(BG_IMAGE_2, 'core'),
      document.fonts?.ready ?? Promise.resolve(),
    ]).then(([bg1, bg2]) => alive && setImages({ bg1, bg2 }));
    return () => {
      alive = false;
    };
  }, []);

  useReveal(loaded);

  return (
    <div className="min-h-screen bg-white tracking-[-0.02em]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {!loaded && (
        <Loader
          ready={!!images}
          onReveal={() => setStarted(true)}
          onDone={() => {
            setLoaded(true);
            document.documentElement.classList.remove('is-loading');
          }}
        />
      )}
      <div className="grain" aria-hidden />
      {images && (
        <>
          <Nav />
          <main className="bg-[#0b0907]">
            <Hero bg1={images.bg1} bg2={images.bg2} started={started} />
            <Principle />
            <DeepTime />
            <FieldKit />
            <Specimens />
            <Finale image={images.bg2} />
          </main>
        </>
      )}
    </div>
  );
}
