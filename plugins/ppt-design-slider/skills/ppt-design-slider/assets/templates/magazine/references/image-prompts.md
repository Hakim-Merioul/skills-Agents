# GPT-M 2.0 Image Prompts

Used in the Codex environment to generate PPT images for this skill. Prompts only set the tone — do not write them as long explanations. First determine image placement and ratio, then choose the type.

## General Rules

- First determine the current deck style: Style A = digital magazine × e-ink; Style B = Swiss International Style / Swiss Style
- Style A baseline: digital magazine × e-ink — restrained, authentic, generous whitespace, suited for landscape web PPT
- Style B baseline: Swiss International Typographic Style — 12/16 column grids, Helvetica/Inter sensibility, single high-saturation accent, square pure color, hairlines, extreme whitespace
- Text language in infographics, charts, and redesigned screenshots must follow the user's language: Chinese decks use Chinese, English decks use English
- Do not generate cartoons, 3D, neon-tech, SaaS template aesthetics, over-decorated imagery, or fake logos
- Images must leave headroom for titles or body text overlays — do not fill every pixel with detail
- Images on the same page or in the same group must use the same ratio, the same visual scale, and the same margin density
- Images are embedded assets in the PPT — they are not standalone slides: do not generate headers, footers, page numbers, title bars, corner labels, attributions, decorative borders, or slide chrome
- After generation, save to `images/` with the naming convention `{page-number}-{semantic-name}.{ext}`

## Ratio Selection

| Use Case | Recommended Ratio | HTML Placement |
|------|---------|-----------|
| Act cover / full-screen hero visual | 16:9 | `.frame-img.r-16x9` or hero background reference |
| Swiss banner / Image Hero | 16:9 or 21:9 | P22 top cover / `.frame-img.r-21x9` |
| Left-text right-image main image | 16:10 or 4:3 | `.frame-img.r-16x10` / `.frame-img.r-4x3` |
| Infographic / system diagram | 16:9 or 16:10 | Original screenshots use `.fit-contain`; regenerated to slot use `.frame-img.r-16x9` / `.frame-img.r-16x10` filled to container |
| Redesigned screenshot / UI scene image | 16:10 or 21:9 | Original screenshots use `.fit-contain`; regenerated to S15/S16 use `.frame-img.r-21x9` filled to container |
| Mixed-layout small insert | 3:2 or 3:4 | `.frame-img.r-3x2` / `.frame-img.r-3x4` |
| Image grid | Uniform landscape | `.frame-img.h-22` / `.frame-img.h-26` |
| Small panel group | Uniform landscape | `.frame-img.h-16` / `.frame-img.h-18` |

For infographics and redesigned screenshots from uncontrolled original assets, prefer `fit-contain` to prevent text from being clipped. If GPT-M 2.0 is regenerating to a specific slot, generate at that slot's exact ratio and fill the container — never let a small image float inside a white frame.
For documentary photos, default to `cover` to preserve the compositional tension.

## Image Standardization Strategy

### A. Choose the Target Slot First

Do not generate an image and then try to fit it in the page. Decide the image placement first:

1. Hero visual: 16:9
2. Left-text right-image: 16:10 or 4:3
3. Infographic / redesigned screenshot: 16:9 or 16:10, using `fit-contain`
4. Multi-image grid / panel group: uniform height class — mixing heights within a group is forbidden

### B. Handling User's Original Images / Screenshots

Original screenshot ratios are typically uncontrollable — do not treat them directly as a final visual standard. Process them in this order:

1. If the original content needs to be faithfully reproduced, first read `screenshot-framing.md` and use a CleanShot X-style programmatic adaptation: target-ratio canvas + styled background + proportionally scaled screenshot + semantic padding/alignment
2. If the original ratio is close to the target slot, place it directly in a uniform `.frame-img` using `cover` or `fit-contain`
3. If a UI image becomes a very long strip when stretched to full width, break it into 2–3 same-size panels; each panel uses the same height class
4. If the original is too tall, too narrow, too long, and cannot be resolved through adaptation, then regenerate it as a "redesigned screenshot / UI scene image" to the target ratio
5. If the original must be kept, use `fit-contain` inside a uniform frame — accept the whitespace, and do not crop critical text

### C. Generation Prompt Suffix

Append a specification constraint at the end of every image prompt:

```text
Output must be a [16:9/16:10/4:3/3:2] landscape composition, subject centered but with generous margins, medium visual density, matching the same visual scale and margin density as other images in this group. Keep only the core image content itself — do not generate headers, footers, titles, page numbers, corner labels, attributions, decorative borders, ultra-wide strips, portrait format, or non-standard ratios.
```

When multiple images are needed on the same page, add:

```text
This is one image in a group. Please maintain the same canvas ratio, element scale, margins, line weight, and annotation density as the other images in this group.
```

## Type 1: Documentary Photography

Used to add immediacy, emotion, and real-world anchoring.

```text
Generate a landscape documentary photograph, subject: [page concept]. Style like Fujifilm / Leica editorial documentary — natural light, low saturation, subtle film grain, authentic work or life setting, restrained with a human warmth. Suited for digital magazine × e-ink PPT with headroom for title overlay. No commercial posing, sci-fi interfaces, AI robots, logos, or watermarks. Output must be a [16:9/16:10/4:3] landscape composition, subject centered but with generous margins, medium visual density. Keep only the core photograph itself — do not generate headers, footers, titles, page numbers, corner labels, attributions, decorative borders, ultra-wide strips, portrait format, or non-standard ratios.
```

## Type 2: Magazine-Style Infographic

Used to explain concepts, processes, comparisons, and system relationships.

```text
Generate a landscape magazine-style infographic explaining: [concept/process/relationship]. E-ink style — predominantly black, white, and grey with a small amount of low-saturation accent color, fine lines, grids, numbering, short labels, generous whitespace. Text in the image must be in [Chinese/English] and remain brief and readable. No cartoons, 3D, neon-tech, or template aesthetics. Output must be a [16:9/16:10] landscape composition, subject centered but with generous margins, medium visual density. Keep only the core infographic itself — do not generate headers, footers, titles, page numbers, corner labels, attributions, decorative borders, ultra-wide strips, portrait format, or non-standard ratios.
```

## Type 3: Process / Pipeline Diagram

Used to clearly show a journey from A to B to C.

```text
Generate a landscape process infographic illustrating: [Step 1] → [Step 2] → [Step 3] → [Result]. Style is digital magazine × e-ink — thin arrows, segmented numbering, short annotations, restrained whitespace. Text in the image must be in [Chinese/English]. Keep only the core process diagram itself — no headers, footers, titles, page numbers, corner labels, attributions, or decorative borders. Ratio: 16:9.
```

## Type 4: Comparison Diagram

Used for before/after, old vs new mode, or two-approach contrasts.

```text
Generate a landscape comparison infographic — left side shows [old model], right side shows [new model]. Style like analytical diagrams in a premium independent magazine — black, white, grey, and one low-saturation accent color, thin dividing lines, short labels, clear hierarchy. Text in the image must be in [Chinese/English]. Keep only the core comparison diagram itself — no headers, footers, titles, page numbers, corner labels, attributions, or decorative borders. Ratio: 16:9.
```

## Type 5: System Relationship Diagram

Used for relationships between multiple roles, tools, or modules.

```text
Generate a landscape system relationship diagram showing how [roles/tools/modules] connect. E-ink magazine style — nodes, thin lines, arrows, numbering, and brief annotations, clear structure, generous whitespace. Text in the image must be in [Chinese/English]. Keep only the core relationship diagram itself — no headers, footers, titles, page numbers, corner labels, attributions, or decorative borders. Ratio: 16:9.
```

## Type 6: Redesigned Screenshot / UI Scene Image

Used to process real screenshots, code, design files, or workspaces into unified visual assets.

```text
Generate a landscape UI scene image, redesigning [screenshot/interface/workspace content] into a visual suitable for a magazine-style PPT. Preserve the feel of a real product workflow — use paper-colored background, thin frames, grids, sparse annotations, and restrained shadows. Text in the image must be in [Chinese/English], short and clear. No real brand logos, flashy dashboards, neon gradients, or hyper-skeuomorphic elements. Output must be a 16:10 landscape composition, subject centered but with generous margins, medium visual density. Keep only the core UI canvas itself — do not generate headers, footers, titles, page numbers, corner labels, attributions, decorative borders, ultra-wide strips, portrait format, or non-standard ratios.
```

## Type 7: Data Billboard

Used to highlight one key number or a small number of metrics.

```text
Generate a landscape data billboard visual, core number: [number], meaning: [meaning]. Style is e-ink magazine layout — oversized serif number, sparse short annotations, thin lines, whitespace, and paper texture. Text in the image must be in [Chinese/English]. Keep only the core data visual itself — no headers, footers, titles, page numbers, corner labels, attributions, or decorative borders. Ratio: 16:9.
```

---

## Style B: Swiss International Style Image Rules

When the deck uses `assets/template-swiss.html` / `layouts-swiss.md`, prioritize the following set of prompts. They are paired with GPT-M 2.0 and aim to generate images that can be placed directly into the registered layout slots — especially the S22 top banner, and S15/S16 multi-image grids.

### Swiss Image Hard Rules

- Visual anchors: International Typographic Style / Swiss modernism / Helvetica / Josef Müller-Brockmann / Massimo Vignelli
- Composition: strict 12/16 column grid, asymmetric whitespace, left-aligned, hairlines, square modules
- Color: only black, white, grey, and **one** theme accent (default IKB blue; replace with the corresponding accent if the user chose lemon yellow/green/safety orange)
- Forbidden: gradients, shadows, rounded corners, glassmorphism, neon, 3D, cartoons, SaaS template aesthetics, fake logos, decorative borders
- Images must not contain PPT shell elements: no headers, footers, page numbers, title bars, corner labels, attributions, or outer frames
- UI / infographic text must be short and language-consistent (Chinese or English); real photos should avoid text where possible
- Determine the layout slot before generating: single large image use `s22-hero-21x9`; multi-image grid use `s15-grid-21x9` or `s16-brief-21x9`
- 21:9 images must place the core subject within the central 70% safe zone, with generous margins on all sides — never push a face, key node, or UI text to the edge

### Swiss Type 1: Documentary Photo / Case Hero Image

Used for S22 Image Hero to add a real-world scene anchor.

```text
Generate a 21:9 ultra-wide landscape documentary photograph, subject: [page concept]. Style is Swiss editorial documentary — high contrast, low saturation, calm and restrained, authentic office/urban/product-in-use setting, generous negative space, subject positioned within the central 70% safe zone, suited for placement in the top banner of a Swiss International Style PPT. No AI robots, sci-fi interfaces, commercial posing, logos, watermarks, or text. Keep only the core photograph itself — no headers, footers, titles, page numbers, corner labels, attributions, decorative borders, or PPT shell elements.
```

### Swiss Type 2: Infographic / System Diagram

Used to explain concepts, architecture, processes, data-presentation separation, and other abstract content.

```text
Generate a landscape Swiss Style infographic explaining: [concept/process/system relationship]. Use Helvetica/Inter-sensibility sans-serif short labels, 12/16 column grid, square modules, 1px hairlines, black/white/grey, and one [IKB blue/lemon yellow/lime green/safety orange] accent. Text in the image must be in [Chinese/English] — no more than 8 characters/words per label. No gradients, shadows, rounded corners, 3D, cartoons, neon, or SaaS template aesthetics. Output ratio is [21:9/16:10], subject centered but with generous whitespace. Keep only the core infographic itself — no headers, footers, titles, page numbers, corner labels, attributions, decorative borders, or PPT shell elements.
```

### Swiss Type 3: Redesigned Screenshot / UI Scene Image

Used to redraw screenshots, workspaces, code, and dashboards as unified Swiss-style visuals.

```text
Generate a landscape UI scene image redesigning [screenshot/interface/workspace content] into Swiss International Typographic Style. Use a minimal dashboard/workspace structure — square panels, hairlines, 12-column grid, sparse [IKB blue/lemon yellow/lime green/safety orange] accent, no shadows, no rounded corners. Text in the image must be in [Chinese/English], short and clear — no real brand logos. Output must be a 16:10 landscape composition, medium visual density, suited for placement in `.frame-img.r-16x10.fit-contain`. Keep only the core UI canvas itself — no headers, footers, titles, page numbers, corner labels, attributions, decorative borders, or PPT shell elements.
```

### Swiss Type 4: Multi-Grid Single Asset

Used for S15/S16 image grid adaptation — generate one image at a time when a group of 2–6 images will be placed side by side.

```text
Generate a landscape evidence image, subject: [Evidence A/B/C]. This is one image in a Swiss Style group — maintain square modules, black/white/grey, single [IKB blue/lemon yellow/lime green/safety orange] accent, consistent margins, consistent line weight, consistent visual scale. Text in the image must be in [Chinese/English] — brief labels only. Output must be a [21:9/16:10] landscape composition suited for placement in a S15/S16 uniform image slot. Keep only the core image itself — no headers, footers, titles, page numbers, corner labels, attributions, decorative borders, or PPT shell elements.
```

### Swiss Type 5: Minimal Chart / Data Block

Used for small data explanation images within S21 or S15/S16 image slots.

```text
Generate a landscape Swiss Style data chart, core data: [number/comparison/ranking], meaning: [description]. Use oversized sans-serif numbers, 1px hairlines, square color blocks, black/white/grey, and one [IKB blue/lemon yellow/lime green/safety orange] accent — like a data layout in a Swiss poster. Text in the image must be in [Chinese/English] — only necessary labels. No gradients, shadows, rounded corners, 3D, or decorative borders. Ratio: [16:9/16:10]. Keep only the core data chart itself — no headers, footers, titles, page numbers, corner labels, attributions, or PPT shell elements.
```
