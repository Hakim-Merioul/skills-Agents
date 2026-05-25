#!/usr/bin/env node
// Universal image-based PPTX export.
// Renders each slide HTML to PNG via Playwright, embeds full-bleed in a 16:9 PPTX.
// Works with ANY template (gradients, SVG ornaments, WebGL — anything).
// Trade-off: text in the output PPTX is NOT editable (it's pixels).
//
// Usage: node export-pptx-image.mjs --slides <dir> --out <file.pptx>
//   --slides   directory of NN-*.html files (or a single index.html with .slide sections)
//   --out      output .pptx path
//   --viewport 1920x1080 (default, 16:9)

import pptxgen from 'pptxgenjs';
import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

function parseArgs() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) out[a[i].replace(/^--/, '')] = a[i + 1];
  return out;
}

const args = parseArgs();
if (!args.slides || !args.out) {
  console.error('Usage: node export-pptx-image.mjs --slides <dir-or-html> --out <file.pptx> [--viewport 1920x1080]');
  process.exit(1);
}
const [vw, vh] = (args.viewport || '1920x1080').split('x').map(Number);

const pptx = new pptxgen();
pptx.layout = 'LAYOUT_WIDE'; // 13.333" × 7.5"
pptx.defineLayout({ name: 'CUSTOM_16x9', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_16x9';

// Discover slide files.
const slidesPath = path.resolve(args.slides);
const stat = await fs.stat(slidesPath);
let slideFiles = [];
let mode = 'multi'; // multi = NN-*.html, single = one index.html with .slide sections

if (stat.isDirectory()) {
  slideFiles = (await fs.readdir(slidesPath))
    .filter(f => /\.html?$/i.test(f))
    .sort();
  if (!slideFiles.length) { console.error('No .html files in directory'); process.exit(1); }
} else {
  slideFiles = [path.basename(slidesPath)];
  mode = 'single';
}

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: vw, height: vh } });

let added = 0;
if (mode === 'multi') {
  for (const file of slideFiles) {
    const page = await ctx.newPage();
    await page.goto('file://' + path.join(slidesPath, file), { waitUntil: 'networkidle' });
    await page.waitForTimeout(800); // settle animations
    const buf = await page.screenshot({ type: 'png', fullPage: false });
    const slide = pptx.addSlide();
    slide.addImage({ data: 'data:image/png;base64,' + buf.toString('base64'), x: 0, y: 0, w: 13.333, h: 7.5 });
    await page.close();
    added++;
  }
} else {
  // Single index.html with multiple .slide sections — screenshot each in turn.
  const page = await ctx.newPage();
  await page.goto('file://' + slidesPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const slideCount = await page.evaluate(() => document.querySelectorAll('.slide, section.slide, [data-slide]').length);
  if (!slideCount) { console.error('No .slide sections found'); process.exit(1); }
  // Detect the active display value (handles `.slide { display: none } .slide.active { display: flex }`).
  const activeDisplay = await page.evaluate(() => {
    const all = document.querySelectorAll('.slide, section.slide, [data-slide]');
    for (const el of all) {
      const d = getComputedStyle(el).display;
      if (d && d !== 'none') return d;
    }
    return 'block';
  });
  for (let i = 0; i < slideCount; i++) {
    await page.evaluate(({ idx, displayValue }) => {
      const all = document.querySelectorAll('.slide, section.slide, [data-slide]');
      all.forEach((el, n) => {
        if (n === idx) {
          el.classList.add('active');
          el.style.setProperty('display', displayValue, 'important');
        } else {
          el.classList.remove('active');
          el.style.setProperty('display', 'none', 'important');
        }
      });
      window.scrollTo(0, 0);
    }, { idx: i, displayValue: activeDisplay });
    await page.waitForTimeout(400);
    const buf = await page.screenshot({ type: 'png', fullPage: false });
    const slide = pptx.addSlide();
    slide.addImage({ data: 'data:image/png;base64,' + buf.toString('base64'), x: 0, y: 0, w: 13.333, h: 7.5 });
    added++;
  }
  await page.close();
}

await browser.close();
await pptx.writeFile({ fileName: args.out });
console.log(`Wrote ${added} slides to ${args.out}`);
