import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Daniel R.', service: 'Skin Fade', text: 'Cleanest fade I have had in years. They took time to understand how I actually style it in the morning.' },
  { name: 'Marco T.', service: 'Hot Towel Shave', text: 'The hot towel shave is the best forty minutes of my month. Walked out feeling like a new person.' },
  { name: 'Alex P.', service: 'Signature Cut', text: 'Booked for a wedding and got more compliments on my hair than the groom. Sorry, Tom.' },
  { name: 'Hugo L.', service: 'Beard Sculpt', text: 'Finally a barber who knows how to shape a beard without taking half of it off.' },
  { name: 'Sam K.', service: 'The Full Ritual', text: 'Great music, cold beer, sharp blades. The full ritual is worth every euro.' },
  { name: 'Iván M.', service: 'Signature Cut', text: 'Six months coming here and the cut is identical every single time. That consistency is rare.' },
];

function Card({ r, dim }: { r: (typeof REVIEWS)[number]; dim?: boolean }) {
  return (
    <figure className="w-[300px] sm:w-[380px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.03] p-7 mr-5 transition-colors duration-500 hover:bg-white/[0.07] hover:border-[#e8702a]/50" aria-hidden={dim}>
      <div className="flex gap-1 text-[#e8702a]" aria-label="5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-current" />
        ))}
      </div>
      <blockquote className="mt-5 text-lg leading-snug text-white/85" style={{ letterSpacing: '-0.02em' }}>
        “{r.text}”
      </blockquote>
      <figcaption className="mt-6 flex items-center justify-between text-sm">
        <span className="font-playfair italic text-xl text-white">{r.name}</span>
        <span className="text-xs uppercase tracking-[0.2em] text-white/45">{r.service}</span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  return (
    <section id="reviews" className="bg-black text-white py-24 sm:py-36 overflow-hidden">
      <div className="px-5 sm:px-10 md:px-14 max-w-6xl mx-auto mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <h2 className="text-5xl sm:text-7xl leading-[0.95]" style={{ letterSpacing: '-0.06em' }}>
          <span className="line-mask"><span>Word from</span></span>
          <span className="line-mask"><span className="font-playfair italic text-[#e8702a]" style={{ transitionDelay: '0.1s' }}>the chair</span></span>
        </h2>
        <p className="reveal text-white/55 text-sm">4.9 average from 1,200+ reviews</p>
      </div>
      <div className="group [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee-track flex w-max group-hover:[animation-play-state:paused]" style={{ animationDuration: '60s' }}>
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <Card key={i} r={r} dim={i >= REVIEWS.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
