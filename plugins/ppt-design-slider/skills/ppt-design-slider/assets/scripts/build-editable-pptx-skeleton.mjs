#!/usr/bin/env node
/**
 * build-editable-pptx-skeleton.mjs — Template for the per-deck editable PPTX builder.
 *
 * Copy this file into <project>/deck/scripts/build-editable-pptx.mjs and adapt it
 * to your deck's content. The agent fills in the DESIGN tokens (from design.md)
 * and adds one block per slide.
 *
 * Why this script exists:
 *   The auto HTML→PPTX converter (export-pptx-editable.mjs) only works for the
 *   ~6 of 36 templates that pass the strict 4-constraint check. For every other
 *   template, the agent uses pptxgenjs DIRECTLY here, rebuilding the deck as
 *   native PowerPoint objects: text boxes, shapes, tables. Every line of text
 *   is double-click-editable in PowerPoint.
 *
 *   Result: every deck ships with an editable PPTX. No exceptions.
 *
 * USAGE (after customization):
 *   cd <project>/deck/scripts
 *   node build-editable-pptx.mjs
 *   # writes ../deck-editable.pptx
 *
 * See references/editable-fallback.md for the full policy + verification rules.
 */

import pptxgen from 'pptxgenjs';

const pptx = new pptxgen();

// 16:9 slide canvas — 13.333" × 7.5" (matches LAYOUT_WIDE)
pptx.defineLayout({ name: 'CUSTOM_16x9', width: 13.333, height: 7.5 });
pptx.layout = 'CUSTOM_16x9';

// ---------------------------------------------------------------------------
// DESIGN TOKENS — pulled from <template-folder>/design.md
// Read the design.md before filling these in. Don't invent colors / fonts.
// ---------------------------------------------------------------------------
const DESIGN = {
  // Palette (hex without #)
  paper: 'F2EFE6',       // background
  ink: '0F0F0F',         // primary text
  accent: 'F06CA8',      // single accent
  muted: '8E8E8E',       // de-emphasized text
  rule: '0F0F0F',        // hairlines

  // Type stack (use exact families from design.md)
  fontDisplay: 'DM Serif Display',
  fontBody: 'Inter',
  fontMono: 'JetBrains Mono',

  // Type scale (pt)
  sizeHero: 64,
  sizeH1: 48,
  sizeH2: 32,
  sizeBody: 16,
  sizeMicro: 11,

  // Spacing (inches)
  pageMarginX: 0.8,
  pageMarginY: 0.6,
  pageNumberY: 6.9,
};

// ---------------------------------------------------------------------------
// HELPERS
// ---------------------------------------------------------------------------
function chrome(slide, pageNumber, totalPages, deckTitle) {
  // Top-left deck title
  slide.addText(deckTitle, {
    x: DESIGN.pageMarginX, y: DESIGN.pageMarginY, w: 6, h: 0.3,
    fontFace: DESIGN.fontMono, fontSize: DESIGN.sizeMicro,
    color: DESIGN.muted, charSpacing: 4,
  });
  // Top-right page number
  slide.addText(`${String(pageNumber).padStart(2, '0')} / ${String(totalPages).padStart(2, '0')}`, {
    x: 6.5, y: DESIGN.pageMarginY, w: 6, h: 0.3,
    fontFace: DESIGN.fontMono, fontSize: DESIGN.sizeMicro,
    color: DESIGN.muted, align: 'right',
  });
}

function hr(slide, y) {
  slide.addShape(pptx.ShapeType.line, {
    x: DESIGN.pageMarginX, y, w: 13.333 - 2 * DESIGN.pageMarginX, h: 0,
    line: { color: DESIGN.rule, width: 0.75 },
  });
}

// ---------------------------------------------------------------------------
// SLIDES — one block per slide. Replace placeholders with the deck content.
// ---------------------------------------------------------------------------

const TOTAL = 8;  // update to match the deck's actual slide count
const DECK_TITLE = 'Demo Deck — Replace';

// === Slide 1 — cover ========================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DESIGN.paper };
  chrome(slide, 1, TOTAL, DECK_TITLE);

  slide.addText('Replace with your cover headline', {
    x: DESIGN.pageMarginX, y: 1.8, w: 11.7, h: 2.5,
    fontFace: DESIGN.fontDisplay, fontSize: DESIGN.sizeHero,
    color: DESIGN.ink, valign: 'middle',
  });

  slide.addText('A short subtitle that explains what this deck is about.', {
    x: DESIGN.pageMarginX, y: 4.5, w: 11.7, h: 0.6,
    fontFace: DESIGN.fontBody, fontSize: DESIGN.sizeBody + 2,
    color: DESIGN.ink,
  });

  // Accent rule
  slide.addShape(pptx.ShapeType.rect, {
    x: DESIGN.pageMarginX, y: 5.5, w: 0.6, h: 0.08,
    fill: { color: DESIGN.accent }, line: { type: 'none' },
  });

  slide.addText('AUTHOR · 2026', {
    x: DESIGN.pageMarginX, y: DESIGN.pageNumberY, w: 6, h: 0.3,
    fontFace: DESIGN.fontMono, fontSize: DESIGN.sizeMicro,
    color: DESIGN.muted, charSpacing: 4,
  });
}

// === Slide 2 — quote / lede ================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DESIGN.paper };
  chrome(slide, 2, TOTAL, DECK_TITLE);
  hr(slide, 1.2);

  slide.addText('"Place a meaningful quote here that\nbreaks across two lines for rhythm."', {
    x: DESIGN.pageMarginX, y: 2.0, w: 11.7, h: 3.5,
    fontFace: DESIGN.fontDisplay, fontSize: DESIGN.sizeH1,
    color: DESIGN.ink, valign: 'top',
    breakLine: true,
  });

  slide.addText('— Source / attribution', {
    x: DESIGN.pageMarginX, y: 5.8, w: 11.7, h: 0.4,
    fontFace: DESIGN.fontBody, fontSize: DESIGN.sizeBody,
    color: DESIGN.muted, italic: true,
  });
}

// === Slide 3 — stat ledger ==================================================
{
  const slide = pptx.addSlide();
  slide.background = { color: DESIGN.paper };
  chrome(slide, 3, TOTAL, DECK_TITLE);

  slide.addText('Key numbers', {
    x: DESIGN.pageMarginX, y: 1.0, w: 11.7, h: 0.6,
    fontFace: DESIGN.fontDisplay, fontSize: DESIGN.sizeH2,
    color: DESIGN.ink,
  });
  hr(slide, 1.7);

  const stats = [
    { value: '127%', label: 'YoY growth' },
    { value: '4.2x', label: 'engagement' },
    { value: '€8.6M', label: 'ARR' },
  ];
  stats.forEach((s, i) => {
    const x = DESIGN.pageMarginX + i * 4.0;
    slide.addText(s.value, {
      x, y: 2.4, w: 3.8, h: 1.5,
      fontFace: DESIGN.fontDisplay, fontSize: 56,
      color: DESIGN.ink,
    });
    slide.addText(s.label, {
      x, y: 4.0, w: 3.8, h: 0.4,
      fontFace: DESIGN.fontMono, fontSize: DESIGN.sizeMicro,
      color: DESIGN.muted, charSpacing: 4,
    });
  });
}

// === Slide 4-N — repeat the pattern =========================================
// For each remaining slide, pick the matching layout (text-heavy / list / table
// / image / before-after / closing) and emit the appropriate combination of
// addText, addShape, addTable, addImage calls.
//
// Reference design.md for spacing/color rules. Match the hero rhythm: insert
// a cover/chapter-break/big-quote slide every 3-4 body slides.

// ---------------------------------------------------------------------------
// WRITE
// ---------------------------------------------------------------------------
await pptx.writeFile({ fileName: '../deck-editable.pptx' });
console.log('✓ Wrote ../deck-editable.pptx');
console.log(`  Slides: ${TOTAL}`);
console.log('  All text is double-click-editable in PowerPoint.');
