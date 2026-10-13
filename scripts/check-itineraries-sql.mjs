import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, "tour-packages-itineraries.sql"), "utf8");

const EXPECTED_SLUGS = [
  "maasai-mara-3-days-group",
  "mara-nakuru-4-days-group",
  "mara-nakuru-naivasha-5-days-group",
  "mara-nakuru-amboseli-6-days-group",
  "mara-nakuru-naivasha-amboseli-7-days-group",
  "mara-nakuru-naivasha-amboseli-8-days-group",
  "ultimate-kenya-safari",
  "tanzania-northern-circuit",
  "kenya-tanzania-combo",
  "amboseli-tsavo-gateway",
  "hells-gate-naivasha",
  "mount-kenya-trekking-3-days",
  "mount-kenya-lakes-trek-4-days",
  "mount-kenka-sirimon-chogoria-5-days",
  "masai-mara-luxury-safari-4-days",
  "tanzania-luxury-serengeti-ngorongoro",
  "kilimanjaro-machame-6-days",
  "kilimanjaro-machame-7-days",
  "kilimanjaro-lemosho-8-days",
  "3-days-ritz-carlton-masai-mara-flying-package",
  "4-days-ritz-carlton-masai-mara-flying-package",
];

const errors = [];
const slugs = [];
const notesCount = [];
const itineraryCounts = [];

for (const m of sql.matchAll(/WHERE slug = '([^']+)'/g)) slugs.push(m[1]);

const blocks = [...sql.matchAll(/UPDATE tour_packages SET itinerary = \$\$\s*(\[[\s\S]*?\])\s*\$\$::jsonb/g)];
const notesBlocks = [...sql.matchAll(/notes = \$notes\$\s*([\s\S]*?)\s*\$notes\$\nWHERE slug/g)];

if (blocks.length !== EXPECTED_SLUGS.length) {
  errors.push(`Expected ${EXPECTED_SLUGS.length} itinerary blocks, found ${blocks.length}`);
}

for (let i = 0; i < blocks.length; i++) {
  const slug = slugs[i];
  const raw = blocks[i][1];
  let json;
  try {
    json = JSON.parse(raw);
  } catch (e) {
    errors.push(`${slug}: itinerary JSON parse failed: ${e.message}`);
    continue;
  }
  itineraryCounts.push({ slug, days: json.length });
  if (!Array.isArray(json) || json.length === 0) {
    errors.push(`${slug}: itinerary must be a non-empty array`);
    continue;
  }
  json.forEach((d, idx) => {
    if (typeof d.day !== "string" || !/^Day \d+$/.test(d.day)) {
      errors.push(`${slug} [${idx}]: day must be "Day N", got "${d.day}"`);
    } else {
      const n = Number(d.day.split(" ")[1]);
      if (n !== idx + 1) errors.push(`${slug}: expected "Day ${idx + 1}", got "${d.day}"`);
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
    if (/[—–“”]/.test(text)) errors.push(`${slug} [${d.day}]: non-ASCII character present`);
    if (text.includes("$$")) errors.push(`${slug} [${d.day}]: contains $$ delimiter`);
  });
}

for (let i = 0; i < notesBlocks.length; i++) {
  const slug = slugs[i];
  const notes = notesBlocks[i][1];
  notesCount.push({ slug, len: notes.length });
  if (!notes.trim()) errors.push(`${slug}: notes is empty`);
  if (/[—–“”]/.test(notes)) errors.push(`${slug}: notes contains non-ASCII characters`);
  if (notes.includes("$$") || notes.includes("$notes$")) errors.push(`${slug}: notes contains reserved delimiter`);
}

for (const slug of EXPECTED_SLUGS) {
  if (!slugs.includes(slug)) errors.push(`Missing slug in SQL: ${slug}`);
}
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length) errors.push(`Duplicate slugs in SQL: ${[...new Set(dupes)].join(", ")}`);

console.log(`Blocks: ${blocks.length} itinerary, ${notesBlocks.length} notes, ${slugs.length} slugs.`);
console.table([...new Map(itineraryCounts.map((x) => [x.slug, `itinerary ${x.days} days`])).entries()].map(([slug, v]) => ({ slug, summary: v })));

if (errors.length) {
  console.error("\nVALIDATION FAILED:");
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log("\nVALIDATION PASSED: all 21 packages have valid itineraries and notes.");