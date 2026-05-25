#!/usr/bin/env node
/**
 * export-pdf.mjs — PDF export.
 *
 * Renders an HTML deck to PDF via Playwright. Universal, lossless, recommended
 * default for delivery. Text is preserved as vectors (copyable, searchable).
 * Works with any template — no HTML modifications required.
 *
 * USAGE (multi-file deck — one .html per slide in a directory):
 *   node export-pdf.mjs --slides <dir> --out <file.pdf> [--width 1920] [--height 1080]
 *
 * USAGE (single-file deck — one .html with multiple <section class="slide">):
 *   node export-pdf.mjs --slides <deck.html> --out <file.pdf> [--width 1920] [--height 1080]
 *
 * Trade-off: text in the PDF is not editable (edit the source HTML instead).
 *
 * Slides are processed in filename sort order (01-xxx.html -> 02-xxx.html -> ...).
 *
 * DEPENDENCIES: npm install playwright pdf-lib
 */

import { chromium } from 'playwright';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';

function parseArgs() {
  const args = { width: 1920, height: 1080 };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.slides || !args.out) {
    console.error('Usage: node export-pdf.mjs --slides <dir|deck.html> --out <file.pdf> [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  return args;
}

async function main() {
  const { slides, out, width, height } = parseArgs();
  const slidesPath = path.resolve(slides);
  const outFile = path.resolve(out);

  const stat = await fs.stat(slidesPath);
  let mode = 'multi';
  let slideFiles = [];

  if (stat.isDirectory()) {
    slideFiles = (await fs.readdir(slidesPath)).filter(f => /\.html?$/i.test(f)).sort();
    if (!slideFiles.length) {
      console.error(`No .html files found in ${slidesPath}`);
      process.exit(1);
    }
    console.log(`Found ${slideFiles.length} slides in ${slidesPath}`);
  } else {
    slideFiles = [path.basename(slidesPath)];
    mode = 'single';
    console.log(`Single-file deck: ${slidesPath}`);
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height } });

  // 1) Render each slide to its own PDF buffer
  const pageBuffers = [];

  if (mode === 'multi') {
    for (const f of slideFiles) {
      const page = await ctx.newPage();
      const url = 'file://' + path.join(slidesPath, f);
      await page.goto(url, { waitUntil: 'networkidle' }).catch(() => page.goto(url));
      await page.waitForTimeout(1200);  // web-font paint
      // emulate "screen" so CSS colors/backgrounds render the same as browser
      await page.emulateMedia({ media: 'screen' });
      const buf = await page.pdf({
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: false,
      });
      pageBuffers.push(buf);
      await page.close();
      console.log(`  [${pageBuffers.length}/${slideFiles.length}] ${f}`);
    }
  } else {
    const page = await ctx.newPage();
    await page.goto('file://' + slidesPath, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);  // web-font paint
    // emulate "screen" so CSS colors/backgrounds render the same as browser
    await page.emulateMedia({ media: 'screen' });
    const slideCount = await page.evaluate(() =>
      document.querySelectorAll('.slide, section.slide, [data-slide]').length
    );
    if (!slideCount) {
      console.error('No .slide sections found in ' + slidesPath);
      process.exit(1);
    }
    // Detect the "active" display value by reading the currently-visible slide.
    // Many templates use `.slide { display: none } .slide.active { display: flex }`,
    // so setting `el.style.display = ''` (the old approach) falls back to `none` for
    // non-first slides and produces blank pages.
    const activeDisplay = await page.evaluate(() => {
      const all = document.querySelectorAll('.slide, section.slide, [data-slide]');
      for (const el of all) {
        const d = getComputedStyle(el).display;
        if (d && d !== 'none') return d;
      }
      return 'block';
    });
    console.log(`Found ${slideCount} slide sections (active display = ${activeDisplay})`);
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
      const buf = await page.pdf({
        width: `${width}px`,
        height: `${height}px`,
        printBackground: true,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
        preferCSSPageSize: false,
      });
      pageBuffers.push(buf);
      console.log(`  [${pageBuffers.length}/${slideCount}] slide ${i + 1}`);
    }
    await page.close();
  }

  await browser.close();

  // 2) Merge into a single PDF
  const merged = await PDFDocument.create();
  for (const buf of pageBuffers) {
    const src = await PDFDocument.load(buf);
    const copied = await merged.copyPages(src, src.getPageIndices());
    copied.forEach(p => merged.addPage(p));
  }
  const bytes = await merged.save();
  await fs.writeFile(outFile, bytes);

  const kb = (bytes.byteLength / 1024).toFixed(0);
  console.log(`\n✓ Wrote ${outFile}  (${kb} KB, ${pageBuffers.length} pages, vector)`);
}

main().catch(e => { console.error(e); process.exit(1); });
