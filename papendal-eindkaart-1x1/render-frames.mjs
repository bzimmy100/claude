import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';

const [file, outDir, fpsArg] = process.argv.slice(2);
const FPS = Number(fpsArg);
const W = 1080, H = 1080;
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const b = await chromium.launch({ args: ['--force-device-scale-factor=1'] });
const p = await b.newPage({ viewport: { width: W + 40, height: H + 40 }, deviceScaleFactor: 1 });
const errs = [];
p.on('pageerror', e => errs.push(e.message.slice(0, 200)));
await p.goto('file://' + file, { waitUntil: 'load' });
await p.waitForSelector('svg[data-om-exportable-video-with-duration-secs]', { timeout: 60000 });
await p.waitForTimeout(2500); // let fonts and the motif image settle

const meta = await p.evaluate(({ W, H }) => {
  const svg = document.querySelector('svg[data-om-exportable-video-with-duration-secs]');
  // Strip every preview surface so nothing opaque sits behind the canvas.
  document.documentElement.style.background = 'transparent';
  document.body.style.background = 'transparent';
  for (const el of document.querySelectorAll('div')) {
    const bg = getComputedStyle(el).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && !el.contains(svg) === false) { /* keep */ }
  }
  let n = svg.parentElement;
  while (n && n !== document.body) { n.style.background = 'transparent'; n = n.parentElement; }
  document.querySelectorAll('div').forEach(d => {
    const c = getComputedStyle(d).backgroundColor;
    if ((c === 'rgb(26, 26, 26)' || c === 'rgb(10, 10, 10)' || c === 'rgb(13, 13, 13)') && !svg.contains(d)) {
      d.style.background = 'transparent';
    }
  });
  // Hide the tweaks panel and any editor chrome so it can never enter a frame.
  document.querySelectorAll('body *').forEach(el => {
    if (svg.contains(el) || el.contains(svg)) return;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') el.style.display = 'none';
  });
  // Pin the canvas to the origin at 1:1 so the clip is exact.
  svg.style.transform = 'none';
  svg.style.boxShadow = 'none';
  svg.style.position = 'fixed';
  svg.style.left = '0px';
  svg.style.top = '0px';
  svg.style.margin = '0';
  svg.setAttribute('width', W);
  svg.setAttribute('height', H);
  return {
    duration: parseFloat(svg.getAttribute('data-om-exportable-video-with-duration-secs')),
    syncSeek: svg.getAttribute('data-om-sync-seek') === 'true',
  };
}, { W, H });

const total = Math.round(meta.duration * FPS);
console.log(`duur ${meta.duration}s @ ${FPS}fps -> ${total} frames, sync-seek=${meta.syncSeek}`);

for (let i = 0; i < total; i++) {
  const t = i / FPS;
  await p.evaluate((t) => {
    const svg = document.querySelector('svg[data-om-exportable-video-with-duration-secs]');
    svg.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', {
      detail: { time: t, sync: true },
    }));
  }, t);
  if (!meta.syncSeek) await p.waitForTimeout(40);
  await p.screenshot({
    path: `${outDir}/f${String(i).padStart(4, '0')}.png`,
    clip: { x: 0, y: 0, width: W, height: H },
    omitBackground: true,
  });
}
console.log('frames klaar:', total, errs.length ? 'ERRORS: ' + errs.join(' | ') : 'geen fouten');
await b.close();
