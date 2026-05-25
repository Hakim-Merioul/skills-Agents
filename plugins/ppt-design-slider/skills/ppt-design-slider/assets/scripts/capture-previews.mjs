#!/usr/bin/env node
/**
 * capture-previews.mjs — Take a screenshot of the first slide of every template.
 *
 * For each subfolder under assets/templates/, opens template.html in headless
 * Chromium and saves a 1920×1080 PNG to assets/previews/<slug>.png. Used to
 * populate the visual catalog in the README.
 *
 * USAGE:
 *   node capture-previews.mjs               # capture all 36 templates
 *   node capture-previews.mjs --only magazine,swiss   # only specific slugs
 *   node capture-previews.mjs --width 1280 --height 720   # custom size
 *
 * Run from the skill root (assets/scripts/) — paths are resolved relative.
 */

import { chromium } from 'playwright';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATES_DIR = path.join(SKILL_ROOT, 'assets', 'templates');
const PREVIEWS_DIR = path.join(SKILL_ROOT, 'assets', 'previews');

function parseArgs() {
  const args = { width: 1920, height: 1080, only: null };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i].replace(/^--/, '');
    if (k === 'width' || k === 'height') args[k] = parseInt(a[++i]);
    else if (k === 'only') args.only = a[++i].split(',').map(s => s.trim());
  }
  return args;
}

async function capture(slug, templateDir, previewsDir, width, height) {
  const html = path.join(templateDir, 'template.html');
  try {
    await fs.access(html);
  } catch {
    return { slug, status: 'skip', reason: 'no template.html' };
  }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  try {
    await page.goto('file://' + html, { waitUntil: 'networkidle', timeout: 30_000 });
    await page.waitForTimeout(1500); // font load + animation settle

    // Try to isolate the first slide and screenshot just it. Most templates use
    // <section class="slide">, some use <div class="slide"> or [data-slide].
    const slideCount = await page.evaluate(() => {
      return document.querySelectorAll('.slide, section.slide, [data-slide]').length;
    });

    if (slideCount === 0) {
      // No .slide elements — screenshot the whole viewport as a fallback
      const out = path.join(previewsDir, `${slug}.png`);
      await page.screenshot({ path: out, fullPage: false, type: 'png' });
      await browser.close();
      return { slug, status: 'ok', mode: 'viewport-fallback', slides: 0 };
    }

    // Show ONLY the first slide
    await page.evaluate(() => {
      const all = document.querySelectorAll('.slide, section.slide, [data-slide]');
      all.forEach((el, i) => { el.style.display = i === 0 ? '' : 'none'; });
      // scroll first slide into view
      if (all[0]) all[0].scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    await page.waitForTimeout(600);

    const out = path.join(previewsDir, `${slug}.png`);
    await page.screenshot({ path: out, fullPage: false, type: 'png' });
    await browser.close();
    return { slug, status: 'ok', mode: 'first-slide', slides: slideCount };
  } catch (e) {
    await browser.close().catch(() => {});
    return { slug, status: 'error', reason: e.message };
  }
}

async function main() {
  const args = parseArgs();
  await fs.mkdir(PREVIEWS_DIR, { recursive: true });

  let slugs = (await fs.readdir(TEMPLATES_DIR))
    .filter(s => !s.startsWith('.'))
    .sort();

  if (args.only) {
    slugs = slugs.filter(s => args.only.includes(s));
    if (!slugs.length) {
      console.error(`No slugs matched --only filter: ${args.only.join(',')}`);
      process.exit(1);
    }
  }

  console.log(`Capturing ${slugs.length} templates → ${PREVIEWS_DIR}`);
  console.log(`Viewport: ${args.width}×${args.height}\n`);

  const results = [];
  for (const slug of slugs) {
    process.stdout.write(`  ${slug.padEnd(22)} `);
    const r = await capture(slug, path.join(TEMPLATES_DIR, slug), PREVIEWS_DIR, args.width, args.height);
    results.push(r);
    if (r.status === 'ok') console.log(`✓ ${r.mode} (${r.slides} slide${r.slides === 1 ? '' : 's'})`);
    else if (r.status === 'skip') console.log(`- skip: ${r.reason}`);
    else console.log(`✗ ${r.reason}`);
  }

  const ok = results.filter(r => r.status === 'ok').length;
  const errs = results.filter(r => r.status === 'error');
  const skips = results.filter(r => r.status === 'skip');

  console.log(`\nDone: ${ok} captured, ${skips.length} skipped, ${errs.length} errors`);
  if (errs.length) {
    console.log('Errors:');
    for (const e of errs) console.log(`  ${e.slug}: ${e.reason}`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
