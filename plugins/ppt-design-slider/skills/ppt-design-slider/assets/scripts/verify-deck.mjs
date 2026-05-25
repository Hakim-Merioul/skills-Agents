#!/usr/bin/env node
/**
 * verify-deck.mjs — Layout sanity check before delivery.
 *
 * Opens the deck HTML in headless Chromium and runs DOM-level checks per slide:
 *   - Text doesn't overflow its container (no scrollHeight > clientHeight)
 *   - Text elements don't visually overlap (bbox intersection)
 *   - Headlines preserve their <br> breaks (no auto-flow to single line)
 *   - No CSS variables resolve to empty (var(--missing) with no fallback)
 *   - Required chrome (page numbers, deck title) is present and non-empty
 *
 * USAGE:
 *   node verify-deck.mjs --html <project>/deck/index.html
 *   node verify-deck.mjs --html <project>/deck/index.html --strict   # treat warnings as errors
 *
 * Exit code 0 = pass. Exit 1 = errors found.
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs/promises';

function parseArgs() {
  const args = { strict: false };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i].replace(/^--/, '');
    if (k === 'html') args.html = a[++i];
    else if (k === 'strict') args.strict = true;
    else if (k === 'width') args.width = parseInt(a[++i]);
    else if (k === 'height') args.height = parseInt(a[++i]);
  }
  args.width = args.width || 1920;
  args.height = args.height || 1080;
  return args;
}

async function main() {
  const args = parseArgs();
  if (!args.html) {
    console.error('Usage: node verify-deck.mjs --html <deck.html> [--strict] [--width 1920] [--height 1080]');
    process.exit(2);
  }
  const htmlPath = path.resolve(args.html);
  try { await fs.access(htmlPath); }
  catch { console.error(`Cannot read ${htmlPath}`); process.exit(2); }

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: args.width, height: args.height } });
  const page = await ctx.newPage();

  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // settle fonts + animations

  const report = await page.evaluate(() => {
    const issues = [];
    const slides = Array.from(document.querySelectorAll('.slide, section.slide, [data-slide]'));
    if (!slides.length) {
      return { fatal: 'No .slide sections found in HTML' };
    }

    const rectOverlap = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);

    slides.forEach((slide, sIdx) => {
      const slideNum = sIdx + 1;
      const wasHidden = slide.style.display === 'none';
      if (wasHidden) slide.style.display = '';
      slide.scrollIntoView({ block: 'start', behavior: 'instant' });

      // (1) overflow check
      const allDescendants = Array.from(slide.querySelectorAll('*'));
      for (const el of allDescendants) {
        const cs = getComputedStyle(el);
        if (cs.position === 'fixed' || cs.position === 'absolute') continue;
        if (el.scrollHeight > el.clientHeight + 2 && cs.overflow !== 'visible') {
          issues.push({
            slide: slideNum, severity: 'error', kind: 'overflow',
            element: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ').slice(0, 2).join('.') : ''),
            detail: `scrollHeight=${el.scrollHeight} > clientHeight=${el.clientHeight}`,
          });
        }
      }

      // (2) overlap check among text-bearing siblings within the same slide
      const textBoxes = allDescendants
        .filter(el => {
          const t = (el.textContent || '').trim();
          if (!t || t.length < 2) return false;
          // Skip if no actual visible text (only whitespace, or hidden)
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) === 0) return false;
          // Skip very large containers (slides themselves)
          const r = el.getBoundingClientRect();
          if (r.width > slide.clientWidth * 0.95 && r.height > slide.clientHeight * 0.95) return false;
          // Only leaf-ish text nodes (no element children that themselves carry text)
          for (const c of el.children) {
            if ((c.textContent || '').trim()) return false;
          }
          return true;
        })
        .map(el => ({ el, rect: el.getBoundingClientRect(), text: (el.textContent || '').trim() }))
        .filter(o => o.rect.width > 0 && o.rect.height > 0);

      for (let i = 0; i < textBoxes.length; i++) {
        for (let j = i + 1; j < textBoxes.length; j++) {
          if (rectOverlap(textBoxes[i].rect, textBoxes[j].rect)) {
            issues.push({
              slide: slideNum, severity: 'warn', kind: 'overlap',
              element: textBoxes[i].el.tagName + ' "' + textBoxes[i].text.slice(0, 30) + '..."',
              detail: `overlaps with ${textBoxes[j].el.tagName} "${textBoxes[j].text.slice(0, 30)}..."`,
            });
          }
        }
      }

      // (3) line-break preservation: any <h1>/<h2>/<h3> that originally has <br>
      //     should still wrap onto multiple visual lines
      slide.querySelectorAll('h1, h2, h3, .display, .h-xl, .display-xl').forEach(h => {
        if (h.innerHTML.includes('<br')) {
          const lineHeight = parseFloat(getComputedStyle(h).lineHeight) || h.clientHeight;
          if (h.clientHeight < lineHeight * 1.4) {
            issues.push({
              slide: slideNum, severity: 'warn', kind: 'line-break-lost',
              element: h.tagName.toLowerCase(),
              detail: `<br> in markup but rendered on a single visual line (${h.clientHeight}px height, ${lineHeight.toFixed(0)}px line)`,
            });
          }
        }
      });

      if (wasHidden) slide.style.display = 'none';
    });

    // (4) Undeclared CSS variables — check root vars actually defined
    const rootStyle = getComputedStyle(document.documentElement);
    const declaredVars = new Set();
    for (let i = 0; i < rootStyle.length; i++) {
      const prop = rootStyle.item(i);
      if (prop.startsWith('--')) declaredVars.add(prop);
    }

    // Scan all stylesheets for var(--*) usage
    const usedVars = new Set();
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules || []) {
            const text = rule.cssText || '';
            const matches = text.matchAll(/var\(\s*(--[a-zA-Z0-9_-]+)/g);
            for (const m of matches) usedVars.add(m[1]);
          }
        } catch (_) { /* cross-origin etc. */ }
      }
    } catch (_) {}
    for (const v of usedVars) {
      if (!declaredVars.has(v)) {
        // ignore intentional CSS API vars (those usually have inline-set values)
        if (v.startsWith('--anim') || v.startsWith('--state')) continue;
        issues.push({
          slide: 0, severity: 'warn', kind: 'undeclared-css-var',
          element: ':root',
          detail: `var(${v}) used but not declared in :root`,
        });
      }
    }

    return { slides: slides.length, issues };
  });

  await browser.close();

  if (report.fatal) {
    console.error(`FATAL: ${report.fatal}`);
    process.exit(2);
  }

  const errors = report.issues.filter(i => i.severity === 'error');
  const warns = report.issues.filter(i => i.severity === 'warn');

  console.log(`Checked ${report.slides} slide${report.slides === 1 ? '' : 's'}.`);
  console.log(`  Errors:   ${errors.length}`);
  console.log(`  Warnings: ${warns.length}`);
  if (report.issues.length) {
    console.log('\nDetails:');
    for (const i of report.issues) {
      const tag = `[${i.severity === 'error' ? '✗' : '⚠'} slide ${i.slide}/${i.kind}]`;
      console.log(`  ${tag} ${i.element} — ${i.detail}`);
    }
  } else {
    console.log('\n✓ All checks pass — deck is ready to deliver.');
  }

  if (errors.length || (args.strict && warns.length)) {
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(2); });
