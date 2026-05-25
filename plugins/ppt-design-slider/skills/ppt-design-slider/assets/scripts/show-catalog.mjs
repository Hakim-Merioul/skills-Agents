#!/usr/bin/env node
/**
 * show-catalog.mjs — Deterministic catalog view of the 36 embedded templates.
 *
 * The SKILL.md workflow runs this BEFORE asking the user any questions, so the
 * 36 design options surface consistently — not dependent on the model reading
 * the catalog correctly from prose. Two output formats:
 *
 *   - markdown (default): grouped, human-readable list with name + one-liner tagline
 *   - json: machine-readable, useful for programmatic filtering
 *
 * USAGE:
 *   node show-catalog.mjs                  # markdown to stdout
 *   node show-catalog.mjs --format json    # full JSON dump of index.json
 *   node show-catalog.mjs --filter dark    # only templates with 'dark' or 'scheme: dark'
 *   node show-catalog.mjs --filter swiss   # only the swiss flagship
 *
 * The filter is a free-text query that matches against slug, name, mood, tone,
 * occasion, best_for, and scheme — case-insensitive substring match.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const INDEX_PATH = path.join(SKILL_ROOT, 'index.json');

function parseArgs() {
  const args = { format: 'markdown', filter: null };
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    const k = a[i].replace(/^--/, '');
    if (k === 'format' || k === 'filter') args[k] = a[++i];
    else if (k === 'help' || k === 'h') args.help = true;
  }
  return args;
}

function matchesFilter(t, q) {
  if (!q) return true;
  const haystack = [
    t.slug,
    t.name,
    t.scheme,
    t.formality,
    t.density,
    t.tier,
    ...(Array.isArray(t.mood) ? t.mood : []),
    ...(Array.isArray(t.tone) ? t.tone : []),
    ...(Array.isArray(t.occasion) ? t.occasion : []),
    t.best_for || '',
  ].join(' ').toLowerCase();
  return haystack.includes(q.toLowerCase());
}

function categorize(templates) {
  const flagship = templates.filter(t => t.tier === 'flagship');
  const editorial = templates.filter(t => t.tier !== 'flagship');

  const buckets = {
    'Warm + editorial': [],
    'Confident + modern': [],
    'Dark / nocturnal': [],
    'Playful / retro': [],
    'Editorial / institutional': [],
    'Civic / activist': [],
    'Other': [],
  };

  const moodToBucket = (mood) => {
    const m = (Array.isArray(mood) ? mood.join(' ') : (mood || '')).toLowerCase();
    if (m.includes('civic') || m.includes('activist') || m.includes('protest')) return 'Civic / activist';
    if (m.includes('playful') || m.includes('retro') || m.includes('pixel') || m.includes('zine')) return 'Playful / retro';
    if (m.includes('dark') || m.includes('nocturnal') || m.includes('moody') || m.includes('inky')) return 'Dark / nocturnal';
    if (m.includes('institutional') || m.includes('archival') || m.includes('ledger')) return 'Editorial / institutional';
    if (m.includes('warm') || m.includes('humanist') || m.includes('soft') || m.includes('pastel')) return 'Warm + editorial';
    if (m.includes('confident') || m.includes('modern') || m.includes('brutal') || m.includes('bold')) return 'Confident + modern';
    return null;
  };

  for (const t of editorial) {
    const b = moodToBucket(t.mood) ||
      (t.scheme === 'dark' ? 'Dark / nocturnal' : null) ||
      'Other';
    buckets[b].push(t);
  }

  return { flagship, buckets };
}

function renderMarkdown(templates, filter) {
  const filtered = templates.filter(t => matchesFilter(t, filter));
  if (filter && filtered.length === 0) {
    return `# No templates match filter: "${filter}"\n\nTry a different keyword. Run without --filter to see all 36.`;
  }

  const { flagship, buckets } = categorize(filtered);
  const lines = [];

  lines.push(filter
    ? `# Template catalog (filter: "${filter}", ${filtered.length} match${filtered.length === 1 ? '' : 'es'})`
    : `# Template catalog (${templates.length} designs)`);
  lines.push('');
  lines.push('Pick a template by `slug` (the code in backticks). Or say "recommend" and I\'ll ask about occasion + mood and propose 3 candidates.');
  lines.push('');

  if (flagship.length) {
    lines.push('## Flagship templates');
    lines.push('Themed mega-templates with their own layout grammar, motion system, and validator.');
    lines.push('');
    for (const t of flagship) {
      lines.push(`- \`${t.slug}\` — **${t.name}**: ${t.tagline}`);
    }
    lines.push('');
  }

  for (const [bucket, list] of Object.entries(buckets)) {
    if (!list.length) continue;
    lines.push(`## ${bucket} (${list.length})`);
    lines.push('');
    list.sort((a, b) => (a.name || a.slug).localeCompare(b.name || b.slug));
    for (const t of list) {
      const mood = Array.isArray(t.mood) ? t.mood.slice(0, 3).join(', ') : '';
      const scheme = t.scheme ? ` · ${t.scheme}` : '';
      lines.push(`- \`${t.slug}\` — **${t.name}** (${mood}${scheme}): ${t.tagline || t.best_for || ''}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push('');
  lines.push('**Next step:** Reply with the slug you want (e.g. `monochrome`), or say "recommend" / "I don\'t know" / a free-text brief, and I\'ll propose 3 candidates.');

  return lines.join('\n');
}

async function main() {
  const args = parseArgs();
  if (args.help) {
    console.log('Usage: node show-catalog.mjs [--format markdown|json] [--filter <query>]');
    return;
  }

  let data;
  try {
    data = JSON.parse(await fs.readFile(INDEX_PATH, 'utf8'));
  } catch (e) {
    console.error(`Cannot read index.json at ${INDEX_PATH}: ${e.message}`);
    console.error('Run `node assets/scripts/build-index.mjs` first to generate it.');
    process.exit(1);
  }

  const templates = data.templates || [];

  if (args.format === 'json') {
    const filtered = templates.filter(t => matchesFilter(t, args.filter));
    console.log(JSON.stringify({ template_count: filtered.length, templates: filtered }, null, 2));
  } else {
    console.log(renderMarkdown(templates, args.filter));
  }
}

main().catch(e => { console.error(e); process.exit(1); });
