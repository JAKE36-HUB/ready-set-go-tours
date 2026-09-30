/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const constants = fs.readFileSync("src/lib/constants.ts", "utf8");
const posts = constants.slice(constants.indexOf("BLOG_POSTS"));
const footer = fs.readFileSync("src/lib/footerLinks.ts", "utf8");

// Read GUIDE_SLUGS (the declared source of truth), not the label map keys, so
// that deleting a slug from the array is detected.
const slugArray = footer.match(/GUIDE_SLUGS\s*=\s*\[([\s\S]*?)\]/);
if (!slugArray) {
  console.error("FAIL: could not find GUIDE_SLUGS in src/lib/footerLinks.ts");
  process.exit(1);
}
const registered = [...slugArray[1].matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1]);
const labelled = [...footer.matchAll(/^\s*"([a-z0-9-]+)":/gm)].map((m) => m[1]);
const allSlugs = [...posts.matchAll(/slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1]);
const guideIndex = path.join(".next", "server", "app", "travel-guide.html");

let failed = false;

if (!fs.existsSync(guideIndex)) {
  console.log("SKIP: run `npm run build` first (no /travel-guide output found).");
  process.exit(0);
}

const rendered = [
  ...new Set(
    [...fs.readFileSync(guideIndex, "utf8").matchAll(/href="\/travel-guide\/([a-z0-9-]+)"/g)].map(
      (m) => m[1]
    )
  ),
];

// Count real pages (skip Next internals) per guide, to prove the footer is sitewide.
const INTERNAL = new Set(["_global-error", "_not-found", "_error"]);
const realPages = fs
  .readdirSync(".next/server/app", { recursive: true })
  .map(String)
  .filter((f) => f.endsWith(".html"))
  .map((f) => f.replace(/\\/g, "/"))
  .filter((f) => !INTERNAL.has(path.basename(f, ".html")));

const sitewide = new Map();
for (const rel of realPages) {
  const s = fs.readFileSync(path.join(".next/server/app", rel), "utf8");
  // Count PAGES containing the link, not raw occurrences (the RSC flight payload
  // embeds a second copy of the markup, which would double the tally).
  const slugsOnPage = new Set(
    [...s.matchAll(/href="\/travel-guide\/([a-z0-9-]+)"/g)].map((x) => x[1])
  );
  for (const slugOnPage of slugsOnPage) {
    sitewide.set(slugOnPage, (sitewide.get(slugOnPage) || 0) + 1);
  }
}
const totalRealPages = realPages.length;

console.log(`Guides registered in footerLinks.ts: ${registered.length}`);
console.log(`Guides rendered on /travel-guide:    ${rendered.length}`);
console.log(`Real (non-internal) pages built:     ${totalRealPages}\n`);

for (const slug of rendered) {
  const inFooter = registered.includes(slug);
  const siteCount = sitewide.get(slug) || 0;
  if (!inFooter) {
    console.log(`  MISSING FROM FOOTER  ${slug}  (appears on ${siteCount} pages)`);
    failed = true;
  } else if (siteCount < totalRealPages) {
    console.log(`  PARTIAL  ${slug.padEnd(34)} footer link on ${siteCount}/${totalRealPages} pages`);
    failed = true;
  } else {
    console.log(`  ok  ${slug.padEnd(34)} footer link on ${siteCount}/${totalRealPages} pages`);
  }
}

const dead = registered.filter((s) => !rendered.includes(s));
if (dead.length) {
  console.log(`\n  STALE ENTRIES (footer links to non-existent guides): ${dead.join(", ")}`);
  failed = true;
}

const unknown = registered.filter((s) => !allSlugs.includes(s));
if (unknown.length) {
  console.log(`\n  NOT IN BLOG_POSTS: ${unknown.join(", ")}`);
  failed = true;
}

const unlabelled = registered.filter((s) => !labelled.includes(s));
if (unlabelled.length) {
  console.log(`\n  MISSING A LABEL: ${unlabelled.join(", ")}`);
  failed = true;
}

if (failed) {
  console.log("\nFAIL: sitewide footer link coverage is out of date.");
  process.exit(1);
}
console.log("\nPASS: every travel guide is linked from the sitewide footer.");
