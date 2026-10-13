import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "beach-packages.sql"), "utf8");

const EXPECTED = [
  { slug: "diani-beach", days: 5 },
  { slug: "zanzibar-island", days: 6 },
  { slug: "watamu-marine-park", days: 4 },
  { slug: "mombasa-north-coast", days: 4 },
  { slug: "malindi-watamu", days: 5 },
  { slug: "lamu-archipelago", days: 5 },
  { slug: "pemba-island", days: 5 },
  { slug: "mafia-island", days: 6 },
];

const errors = [];

const slugMatches = [...sql.matchAll(/VALUES \(\s*\n\s*'[^']*',\s*\n\s*'([^']+)',\s*\n\s*'beach',/g)];
const slugs = slugMatches.map((m) => m[1]);

const blocks = [...sql.matchAll(/\$\$\s*(\[[\s\S]*?\])\s*\$\$::jsonb/g)];
const notesBlocks = [...sql.matchAll(/\$notes\$\s*([\s\S]*?)\s*\$notes\$/g)];

if (slugs.length !== EXPECTED.length) {
  errors.push(`Expected ${EXPECTED.length} beach inserts, found ${slugs.length}`);
}
if (blocks.length !== EXPECTED.length * 2) {
  errors.push(`Expected ${EXPECTED.length * 2} JSON blocks (itinerary + optional), found ${blocks.length}`);
}
if (notesBlocks.length !== EXPECTED.length) {
  errors.push(`Expected ${EXPECTED.length} notes blocks, found ${notesBlocks.length}`);
}

const summary = [];

for (let i = 0; i < Math.min(slugs.length, EXPECTED.length); i++) {
  const slug = slugs[i];
  const expectedDays = EXPECTED.find((e) => e.slug === slug)?.days;
  if (!expectedDays) errors.push(`Unexpected slug: ${slug}`);

  const raw = blocks[i * 2]?.[1];
  if (!raw) {
    errors.push(`${slug}: missing itinerary block`);
    continue;
  }
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    errors.push(`${slug}: itinerary JSON parse failed: ${e.message}`);
    continue;
  }
  if (!Array.isArray(json) || json.length === 0) {
    errors.push(`${slug}: itinerary must be a non-empty array`);
    continue;
  }
  if (expectedDays && json.length !== expectedDays) {
    errors.push(`${slug}: expected ${expectedDays} itinerary days, found ${json.length}`);
  }
  summary.push({ slug, days: json.length });

  json.forEach((d, idx) => {
    if (typeof d.day !== "string" || !/^Day \d+$/.test(d.day)) {
      errors.push(`${slug} [${idx}]: day must be "Day N", got "${d.day}"`);
    } else if (Number(d.day.split(" ")[1]) !== idx + 1) {
      errors.push(`${slug}: expected "Day ${idx + 1}", got "${d.day}"`);
    }
    for (const k of ["title", "description"]) {
      if (typeof d[k] !== "string" || !d[k].trim()) errors.push(`${slug} [${d.day}]: missing ${k}`);
    }
    if (d.meals !== undefined && typeof d.meals !== "string") errors.push(`${slug} [${d.day}]: meals must be string`);
    if (d.accommodation !== undefined && typeof d.accommodation !== "string") errors.push(`${slug} [${d.day}]: accommodation must be string`);
    for (const k of ["activities", "highlights"]) {
      if (d[k] !== undefined && (!Array.isArray(d[k]) || d[k].some((x) => typeof x !== "string"))) {
        errors.push(`${slug} [${d.day}]: ${k} must be string array`);
      }
    }
    const text = [d.title, d.description, d.meals, d.accommodation, ...(d.activities || []), ...(d.highlights || [])]
      .filter(Boolean)
      .join(" ");
    if (/[^\x00-\x7F]/.test(text)) errors.push(`${slug} [${d.day}]: non-ASCII character present`);
    if (text.includes("$$")) errors.push(`${slug} [${d.day}]: contains $$ delimiter`);
  });

  const rawOpt = blocks[i * 2 + 1]?.[1];
  if (!rawOpt) {
    errors.push(`${slug}: missing optional_activities block`);
  } else {
    try {
      const opt = JSON.parse(rawOpt);
      if (!Array.isArray(opt)) errors.push(`${slug}: optional_activities must be an array`);
      else {
        opt.forEach((o, idx) => {
          if (typeof o.name !== "string" || !o.name.trim()) errors.push(`${slug} opt[${idx}]: missing name`);
          if (o.price !== null && typeof o.price !== "number") errors.push(`${slug} opt[${idx}]: price must be number or null`);
          if (typeof o.price_text !== "string" || !o.price_text.trim()) errors.push(`${slug} opt[${idx}]: missing price_text`);
          if (o.name && /[^\x00-\x7F]/.test(o.name + o.price_text)) errors.push(`${slug} opt[${idx}]: non-ASCII character present`);
        });
      }
    } catch (e) {
      errors.push(`${slug}: optional_activities JSON parse failed: ${e.message}`);
    }
  }

  const notes = notesBlocks[i]?.[1];
  if (!notes) {
    errors.push(`${slug}: missing notes block`);
  } else {
    if (!notes.trim()) errors.push(`${slug}: notes is empty`);
    if (/[^\x00-\x7F]/.test(notes)) errors.push(`${slug}: notes contains non-ASCII characters`);
    if (notes.includes("$$") || notes.includes("$notes$")) errors.push(`${slug}: notes contains reserved delimiter`);
  }
}

for (const e of EXPECTED) {
  if (!slugs.includes(e.slug)) errors.push(`Missing slug in SQL: ${e.slug}`);
}
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) errors.push(`Duplicate slugs in SQL: ${[...new Set(dupes)].join(", ")}`);

console.log(`Inserts: ${slugs.length}, JSON blocks: ${blocks.length}, notes: ${notesBlocks.length}.`);
console.table(summary);

if (errors.length) {
  console.error("\nVALIDATION FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(`\nVALIDATION PASSED: all ${EXPECTED.length} beach packages have valid itineraries, optional activities and notes.`);
