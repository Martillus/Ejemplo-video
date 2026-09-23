# Lithos

Landing page for Lithos, a geology course. React 18 + TypeScript + Vite + Tailwind CSS + lucide-react.

```bash
npm install
npm run dev          # local dev server
npm run build        # production build in dist/
npm run build:single # one self-contained HTML file in dist-single/
```

## What's on the page

- **Loader**: counts down from 4,540 Ma to the present while sediment settles, then opens with a fault-slip shear.
- **Hero**: cursor-following spotlight that reveals a second image through a canvas-generated radial mask. Without pointer input it wanders on its own.
- **Principle**: Hutton's uniformitarianism, inked word by word on scroll.
- **Deep time**: pinned drill core through the four eras with ICS boundaries.
- **Field kit**: tilt cards with a pointer glow.
- **Specimens**: rock index marquee that skews with scroll speed.
- **Finale**: parallax call to action, magnetic button, footer.

If the hero photographs cannot be fetched, `src/lib/strata.ts` generates matching stand-ins so the spotlight still works.
