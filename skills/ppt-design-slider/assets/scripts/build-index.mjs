#!/usr/bin/env node
// Scan assets/templates/*/template.json and produce a unified index.json catalog.
// Run from the skill root: `node assets/scripts/build-index.mjs`
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');
const TEMPLATES_DIR = path.join(SKILL_ROOT, 'assets', 'templates');
const INDEX_OUT = path.join(SKILL_ROOT, 'index.json');

const slugs = await fs.readdir(TEMPLATES_DIR);
const templates = [];

for (const slug of slugs) {
  if (slug.startsWith('.')) continue;
  const tmplDir = path.join(TEMPLATES_DIR, slug);
  const stat = await fs.stat(tmplDir);
  if (!stat.isDirectory()) continue;

  const jsonPath = path.join(tmplDir, 'template.json');
  try {
    const data = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    if (!data.slug) data.slug = slug;
    templates.push(data);
  } catch (e) {
    console.warn(`Skip ${slug}: ${e.message}`);
  }
}

// Stable sort by tier first (flagship templates float to the top of the catalog), then name.
templates.sort((a, b) => {
  if (a.tier !== b.tier) return a.tier === 'flagship' ? -1 : 1;
  return (a.name || a.slug).localeCompare(b.name || b.slug);
});

const index = {
  schema_version: 2,
  generated_at: new Date().toISOString(),
  template_count: templates.length,
  templates,
};

await fs.writeFile(INDEX_OUT, JSON.stringify(index, null, 2));
console.log(`Built index.json with ${templates.length} templates`);
