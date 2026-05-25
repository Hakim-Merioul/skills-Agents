#!/usr/bin/env node
/**
 * init-deck.mjs — Harness script. Sets up a deck workspace from a chosen template.
 *
 * Replaces 6+ ad-hoc bash commands the agent would otherwise have to issue (and
 * could get wrong). After this runs, the workspace has everything needed to
 * render PDF / PPTX without the agent having to manage paths or dependencies.
 *
 * USAGE:
 *   node init-deck.mjs --slug <template-slug> --project <path>
 *
 *   --slug      Template slug from index.json (e.g. "monochrome", "swiss")
 *   --project   Path to the project workspace where the deck will live.
 *               The deck goes in <project>/deck/.
 *   --dry-run   Print what would happen without doing it.
 *   --force     Overwrite an existing <project>/deck/ (default: fail if exists)
 *
 * WHAT IT DOES (idempotent except for --force overwrite):
 *   1. Validates the slug exists in index.json (exits 1 with a list of valid slugs if not)
 *   2. Creates <project>/deck/
 *   3. Copies the template folder into <project>/deck/ (including assets, references,
 *      design.md, template.json, template.html)
 *   4. Renames template.html → index.html
 *   5. Copies all export scripts + package.json into <project>/deck/scripts/
 *   6. Writes <project>/deck/_brief.md placeholder (the user's outline goes here)
 *   7. Writes <project>/deck/NEXT_STEPS.md with the exact commands to run next
 *
 * After this runs, the agent should:
 *   - cd <project>/deck/scripts && npm install && npx playwright install chromium
 *   - Read <project>/deck/design.md (the template's rulebook)
 *   - Help the user fill _brief.md or paste their content
 *   - Edit index.html sections per the plan
 *   - Run the export scripts from <project>/deck/scripts/
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const INDEX_PATH = path.join(SKILL_ROOT, 'index.json');
const TEMPLATES_DIR = path.join(SKILL_ROOT, 'assets', 'templates');
const SCRIPTS_DIR = path.join(SKILL_ROOT, 'assets', 'scripts');

function parseArgs() {
  const args = { dryRun: false, force: false };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i].replace(/^--/, '');
    if (k === 'help' || k === 'h') return { help: true };
    if (k === 'dry-run') { args.dryRun = true; continue; }
    if (k === 'force') { args.force = true; continue; }
    if (k === 'slug' || k === 'project') args[k] = a[++i];
  }
  return args;
}

function usage() {
  console.log(`Usage: node init-deck.mjs --slug <template-slug> --project <path> [--dry-run] [--force]

Examples:
  node init-deck.mjs --slug monochrome --project ./my-deck
  node init-deck.mjs --slug swiss --project /tmp/q3-review --force
  node init-deck.mjs --slug pink-script --project . --dry-run

Run \`node show-catalog.mjs\` first to see the 36 available slugs.`);
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function copyDir(src, dst) {
  await fs.cp(src, dst, { recursive: true });
}

async function main() {
  const args = parseArgs();

  if (args.help) { usage(); return; }
  if (!args.slug || !args.project) {
    console.error('ERROR: --slug and --project are both required.\n');
    usage();
    process.exit(1);
  }

  // 1. Validate slug
  let index;
  try {
    index = JSON.parse(await fs.readFile(INDEX_PATH, 'utf8'));
  } catch (e) {
    console.error(`Cannot read ${INDEX_PATH}: ${e.message}`);
    console.error('Run `node assets/scripts/build-index.mjs` first.');
    process.exit(1);
  }

  const template = index.templates.find(t => t.slug === args.slug);
  if (!template) {
    console.error(`ERROR: Unknown slug "${args.slug}".`);
    console.error(`\nValid slugs (${index.templates.length} total):`);
    for (const t of index.templates) console.error(`  - ${t.slug}`);
    console.error('\nRun `node show-catalog.mjs` for a categorized view with descriptions.');
    process.exit(1);
  }

  const templateDir = path.join(TEMPLATES_DIR, args.slug);
  if (!(await exists(templateDir))) {
    console.error(`ERROR: Template directory missing on disk: ${templateDir}`);
    console.error('The index.json is out of sync with assets/templates/. Run build-index.mjs.');
    process.exit(1);
  }

  // 2. Resolve project & deck directory
  const projectDir = path.resolve(args.project);
  const deckDir = path.join(projectDir, 'deck');

  if (await exists(deckDir)) {
    if (!args.force) {
      console.error(`ERROR: ${deckDir} already exists. Use --force to overwrite, or pick a different --project path.`);
      process.exit(1);
    }
    if (!args.dryRun) await fs.rm(deckDir, { recursive: true, force: true });
  }

  const summary = {
    slug: args.slug,
    template_name: template.name,
    tier: template.tier,
    pptx_editable: template.pptx_editable,
    deck_dir: deckDir,
    actions: [],
  };

  // 3. Create deck dir + copy template
  summary.actions.push(`mkdir -p ${deckDir}`);
  summary.actions.push(`cp -R ${templateDir}/. ${deckDir}/`);

  if (!args.dryRun) {
    await fs.mkdir(deckDir, { recursive: true });
    await copyDir(templateDir, deckDir);
  }

  // 4. Rename template.html → index.html
  const tmplHtml = path.join(deckDir, 'template.html');
  if (!args.dryRun && (await exists(tmplHtml))) {
    await fs.rename(tmplHtml, path.join(deckDir, 'index.html'));
  }
  summary.actions.push(`mv ${deckDir}/template.html ${deckDir}/index.html`);

  // 5. Copy scripts
  const scriptsTarget = path.join(deckDir, 'scripts');
  summary.actions.push(`mkdir -p ${scriptsTarget} && cp ${SCRIPTS_DIR}/* ${scriptsTarget}/`);
  if (!args.dryRun) {
    await fs.mkdir(scriptsTarget, { recursive: true });
    const scripts = await fs.readdir(SCRIPTS_DIR);
    for (const s of scripts) {
      await fs.copyFile(path.join(SCRIPTS_DIR, s), path.join(scriptsTarget, s));
    }
  }

  // 6. Write _brief.md placeholder
  const briefPath = path.join(deckDir, '_brief.md');
  const briefBody = `# Deck brief

Paste your outline, talk notes, source content, or stream-of-consciousness here.
The agent will use this to draft a slide-by-slide plan before writing HTML.

## Audience / occasion
(Who's this for? Founder pitch, classroom, internal share, client review, …)

## Key message / takeaway
(If they remember one thing, what should it be?)

## Content
(Paste your raw content below.)


`;
  if (!args.dryRun) await fs.writeFile(briefPath, briefBody);
  summary.actions.push(`write ${briefPath}`);

  // 7. Write NEXT_STEPS.md
  const nextStepsPath = path.join(deckDir, 'NEXT_STEPS.md');
  const nextSteps = `# Next steps for ${template.name} deck

Template: \`${args.slug}\` (${template.tier}) — ${template.tagline || ''}

## 1. Install export dependencies (one-time, in this workspace)

\`\`\`bash
cd ${deckDir}/scripts
npm install
npx playwright install chromium
cd ..
\`\`\`

## 2. Read the design rulebook

Open \`${deckDir}/design.md\`. This is the rulebook — fonts, palette, decorative
vocabulary, hero rhythm, image rules, hard constraints. Every later decision
about slides references this file.

${template.layouts_doc ? `Also read \`${deckDir}/${template.layouts_doc}\` for the layout grammar.` : ''}

## 3. Fill the brief

Edit \`${deckDir}/_brief.md\` with the deck's audience, occasion, key message, and
raw content. The agent uses this to plan slides.

## 4. Draft a slide table (before writing HTML)

| # | Layout | Headline | Body content | Image slot |
|---|---|---|---|---|

Share the table with the user. Wait for sign-off before writing slide HTML.

## 5. Edit index.html

Duplicate sections matching the slide plan. Replace placeholder text + images
with the user's content. Match the design.md rulebook exactly — no font
substitutions, no new colors, no layout mash-ups.

${template.slug === 'swiss' ? `\n**Swiss-specific:** every body slide MUST declare \`data-layout="Sxx"\` (S01–S22).\nRun \`node scripts/validate-deck.mjs index.html\` periodically to catch violations.\n` : ''}

## 6. Export

\`\`\`bash
cd ${deckDir}

# PDF (always works, every template) — recommended default
node scripts/export-pdf.mjs --slides index.html --out deck.pdf

# PPTX (universal image-based fallback — works for every template)
node scripts/export-pptx-image.mjs --slides index.html --out deck.pptx

${template.pptx_editable ? `# PPTX (editable text) — this template supports editable export
node scripts/export-pptx-editable.mjs --slides index.html --out deck-editable.pptx
` : `# PPTX (editable text) is NOT available for this template — it relies on
# gradients/WebGL/decorative SVG that don't survive editable export.
`}
\`\`\`

After export, open each output (\`open deck.pdf\`, \`open deck.pptx\`) and verify
it matches the HTML visually.
`;
  if (!args.dryRun) await fs.writeFile(nextStepsPath, nextSteps);
  summary.actions.push(`write ${nextStepsPath}`);

  // Final report
  if (args.dryRun) {
    console.log('DRY RUN — no changes made. Would do:');
    for (const a of summary.actions) console.log(`  - ${a}`);
    return;
  }

  console.log(`\n✓ Deck workspace ready: ${deckDir}`);
  console.log(`  Template: ${template.name} (${args.slug}, ${template.tier})`);
  console.log(`  PPTX editable: ${template.pptx_editable ? 'yes' : 'no (image-based only)'}`);
  console.log(`  Files: ${summary.actions.length} actions completed`);
  console.log(`\nRead ${nextStepsPath} for the exact commands to run next.`);
}

main().catch(e => { console.error(e); process.exit(1); });
