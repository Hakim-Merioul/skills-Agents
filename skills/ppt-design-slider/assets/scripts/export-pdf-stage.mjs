#!/usr/bin/env node
/**
 * export-pdf-stage.mjs — PDF stage export.
 *
 * Variant for templates with a deck-stage.js runtime: renders each .slide section
 * separately. Use this script when the deck is a single HTML file with all slides
 * as <section> elements wrapped in a <deck-stage> custom element.
 *
 * USAGE:
 *   node export-pdf-stage.mjs --html <deck.html> --out <file.pdf> [--width 1920] [--height 1080]
 *
 * Use export-pdf.mjs instead if your deck uses separate per-slide HTML files.
 *
 * WHY NOT page.pdf() DIRECTLY:
 *   The deck-stage shadow CSS hides all but the active slide — page.pdf() would
 *   produce a single-page PDF. This script extracts sections from the shadow DOM
 *   slot and flattens them into the body so every section prints.
 *
 * OUTPUT: vector PDF — text is copyable and searchable.
 *
 * DEPENDENCIES: npm install playwright
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';

function parseArgs() {
  const args = { width: 1920, height: 1080 };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i += 2) {
    const k = a[i].replace(/^--/, '');
    args[k] = a[i + 1];
  }
  if (!args.html || !args.out) {
    console.error('Usage: node export-pdf-stage.mjs --html <deck.html> --out <file.pdf> [--width 1920] [--height 1080]');
    process.exit(1);
  }
  args.width = parseInt(args.width);
  args.height = parseInt(args.height);
  return args;
}

async function main() {
  const { html, out, width, height } = parseArgs();
  const htmlAbs = path.resolve(html);
  const outFile = path.resolve(out);

  await fs.access(htmlAbs).catch(() => {
    console.error(`HTML file not found: ${htmlAbs}`);
    process.exit(1);
  });

  console.log(`Rendering ${path.basename(htmlAbs)} → ${path.basename(outFile)}`);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height } });
  const page = await ctx.newPage();

  await page.goto('file://' + htmlAbs, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);  // wait for Google Fonts + deck-stage init

  // Core fix: extract sections from the shadow DOM slot and flatten to body
  const sectionCount = await page.evaluate(({ W, H }) => {
    const stage = document.querySelector('deck-stage');
    if (!stage) throw new Error('<deck-stage> not found — this script is only for single-file deck-stage layouts');
    const sections = Array.from(stage.querySelectorAll(':scope > section'));
    if (!sections.length) throw new Error('No <section> found inside <deck-stage>');

    // Inject print styles
    const style = document.createElement('style');
    style.textContent = `
      @page { size: ${W}px ${H}px; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: #fff; }
      deck-stage { display: none !important; }
    `;
    document.head.appendChild(style);

    // Flatten sections under body
    const container = document.createElement('div');
    container.id = 'print-container';
    sections.forEach(s => {
      // Inline style wins specificity; position:relative constrains absolutely-positioned children
      s.style.cssText = `
        width: ${W}px !important;
        height: ${H}px !important;
        display: block !important;
        position: relative !important;
        overflow: hidden !important;
        page-break-after: always !important;
        break-after: page !important;
        margin: 0 !important;
        padding: 0 !important;
      `;
      container.appendChild(s);
    });
    // Last page: no forced break to avoid trailing blank page
    const last = sections[sections.length - 1];
    last.style.pageBreakAfter = 'auto';
    last.style.breakAfter = 'auto';
    document.body.appendChild(container);
    return sections.length;
  }, { W: width, H: height });

  await page.waitForTimeout(800);

  await page.pdf({
    path: outFile,
    width: `${width}px`,
    height: `${height}px`,
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();

  const stat = await fs.stat(outFile);
  const kb = (stat.size / 1024).toFixed(0);
  console.log(`\nWrote ${outFile}  (${kb} KB, ${sectionCount} pages, vector)`);
}

main().catch(e => { console.error(e); process.exit(1); });
