import heroBeforeSrc from './assets/hero-before.webp';
import heroAfterSrc from './assets/hero-after.png';

// Hero cut-outs (transparent background): uncut hair, and the finished cut.
export const heroBefore = heroBeforeSrc;
export const heroAfter = heroAfterSrc;

export const BG_IMAGE_1 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85';
export const BG_IMAGE_2 =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85';

// Painted under each photo so the layers still read as "before" (cool, rough)
// and "after" (warm, clean) if an embed blocks the image host.
const FALLBACK_1 =
  'repeating-linear-gradient(115deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 9px), radial-gradient(ellipse 60% 70% at 50% 45%, #3a3d42 0%, #1c1d20 55%, #09090a 100%)';
const FALLBACK_2 =
  'repeating-linear-gradient(-45deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 22px), radial-gradient(ellipse 60% 70% at 50% 45%, #f39a5a 0%, #c9561b 45%, #3b1606 100%)';

export const bg1 = `url("${BG_IMAGE_1}"), ${FALLBACK_1}`;
export const bg2 = `url("${BG_IMAGE_2}"), ${FALLBACK_2}`;
