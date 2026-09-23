// Turns the single-file build into an artifact page body (the host adds its own <html>/<head>).
import { readFileSync, writeFileSync } from 'node:fs';
const html = readFileSync(new URL('../dist-single/index.html', import.meta.url), 'utf8');
const title = html.match(/<title>[\s\S]*?<\/title>/)[0];
const styles = [...html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map((m) => m[0]).join('\n');
const scripts = [...html.matchAll(/<script[^>]*>[\s\S]*?<\/script>/g)].map((m) => m[0]).join('\n');
const out = `${title}\n<link rel="preconnect" href="https://fonts.googleapis.com">\n${styles}\n<div id="root"></div>\n${scripts}\n`;
writeFileSync(process.argv[2], out);
console.log('wrote', process.argv[2], out.length);
