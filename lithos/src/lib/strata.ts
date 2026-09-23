// Procedural stand-ins for the hero photographs. Used only when the remote
// images cannot be fetched (offline, or a sandbox that blocks the host), so
// the spotlight still has two aligned images to move between.

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNoise(seed: number) {
  const rnd = mulberry32(seed);
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  const v = new Float32Array(256).map(() => rnd());
  const h = (i: number, j: number) => v[p[p[i & 255] + (j & 255)]];
  const fade = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const u = fade(x - xi), w = fade(y - yi);
    const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
  return (x: number, y: number, oct = 4) => {
    let s = 0, amp = 0.5, f = 1, n = 0;
    for (let o = 0; o < oct; o++) {
      s += noise(x * f, y * f) * amp;
      n += amp;
      amp *= 0.5;
      f *= 2.03;
    }
    return s / n;
  };
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

const DUSK = ['#2a2320', '#473a31', '#5f4c3d', '#3a302b', '#7a6450', '#514237', '#8b7259', '#352c27', '#6a5645', '#2f2724', '#574739'].map(hex);
const CORE = ['#a3452a', '#d49a4c', '#5b2a1f', '#e7c38a', '#3f6f6a', '#b8612e', '#7d3322', '#f0d6a4', '#2e4e4a', '#c9772f', '#6b2c20'].map(hex);

export function renderStrata(variant: 'surface' | 'core', W = 1024, H = 640): string {
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d')!;
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const warp = makeNoise(7);
  const tex = makeNoise(21);
  const vein = makeNoise(99);
  const pal = variant === 'surface' ? DUSK : CORE;
  const bandH = 34;
  const star = mulberry32(5);

  for (let x = 0; x < W; x++) {
    const sky = H * 0.4 + (warp(x * 0.004, 3.1, 3) - 0.5) * 220;
    for (let y = 0; y < H; y++) {
      const i = (y * W + x) * 4;
      let r: number, g: number, b: number;
      if (y < sky) {
        const t = y / sky;
        if (variant === 'surface') {
          r = 10 + 60 * t * t; g = 9 + 32 * t * t; b = 12 + 18 * t * t;
        } else {
          r = 6 + 30 * t * t; g = 8 + 14 * t * t; b = 16 + 26 * t * t;
          const neb = tex(x * 0.006, y * 0.012, 3);
          r += neb * 40; b += neb * 55;
        }
      } else {
        // Folded strata: warp the depth coordinate, then add a gentle anticline.
        const fold = Math.sin(x * 0.0042) * 46 + (warp(x * 0.003, y * 0.003) - 0.5) * 150;
        const depth = (y - sky * 0.35 + fold) / bandH;
        const k = Math.floor(depth);
        const f = depth - k;
        const c0 = pal[((k % pal.length) + pal.length) % pal.length];
        const c1 = pal[(((k + 1) % pal.length) + pal.length) % pal.length];
        const m = f > 0.9 ? (f - 0.9) * 10 : 0;
        const grain = 0.72 + tex(x * 0.05, y * 0.09, 3) * 0.55;
        r = (c0[0] + (c1[0] - c0[0]) * m) * grain;
        g = (c0[1] + (c1[1] - c0[1]) * m) * grain;
        b = (c0[2] + (c1[2] - c0[2]) * m) * grain;
        // Rim light along the ridge line
        const rim = Math.max(0, 1 - (y - sky) / 26);
        if (variant === 'surface') { r += rim * 70; g += rim * 36; b += rim * 12; }
        // Cross-section veins glow through the reveal
        if (variant === 'core') {
          const vv = Math.abs(vein(x * 0.008, y * 0.008) - 0.5);
          if (vv < 0.012) { const e = 1 - vv / 0.012; r += 200 * e; g += 120 * e; b += 40 * e; }
        }
        const shade = variant === 'surface' ? 0.55 + 0.45 * (1 - y / H) : 0.85;
        r *= shade; g *= shade; b *= shade;
      }
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  if (variant === 'core') {
    for (let s = 0; s < 260; s++) {
      const x = star() * W, y = star() * H * 0.45;
      ctx.fillStyle = `rgba(255,240,220,${0.3 + star() * 0.7})`;
      ctx.fillRect(x, y, star() < 0.1 ? 2 : 1, star() < 0.1 ? 2 : 1);
    }
    // Ammonites
    const fossils: [number, number, number][] = [[0.22, 0.72, 34], [0.63, 0.83, 46], [0.84, 0.64, 26], [0.43, 0.6, 22]];
    fossils.forEach(([fx, fy, R]) => {
      const cx = fx * W, cy = fy * H;
      ctx.save();
      ctx.shadowColor = 'rgba(255,170,80,.9)';
      ctx.shadowBlur = 14;
      ctx.strokeStyle = 'rgba(255,226,180,.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 7; a += 0.05) {
        const rr = R * Math.exp(-0.16 * (Math.PI * 7 - a)) ;
        const px = cx + Math.cos(a) * rr, py = cy + Math.sin(a) * rr;
        a === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.lineWidth = 1;
      for (let a = Math.PI * 3; a < Math.PI * 7; a += 0.32) {
        const r1 = R * Math.exp(-0.16 * (Math.PI * 7 - a));
        const r0 = r1 * 0.72;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
        ctx.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
        ctx.stroke();
      }
      ctx.restore();
    });
  }
  return cv.toDataURL('image/jpeg', 0.9);
}

// Resolve a remote image, or hand back a generated one if it cannot load.
export function loadOrGenerate(url: string, variant: 'surface' | 'core', timeout = 7000): Promise<string> {
  return new Promise((resolve) => {
    let done = false;
    const fallback = () => {
      if (done) return;
      done = true;
      resolve(renderStrata(variant));
    };
    const img = new Image();
    img.onload = () => {
      if (done) return;
      done = true;
      resolve(url);
    };
    img.onerror = fallback;
    setTimeout(fallback, timeout);
    img.src = url;
  });
}
