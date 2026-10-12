import { readFileSync } from "node:fs"

const sql = readFileSync("scripts/ritz-carlton-masai-mara-packages.sql", "utf8")

const blocks = [...sql.matchAll(/\$\$([\s\S]*?)\$\$/g)].map((m) => m[1])
console.log(`dollar-quoted blocks: ${blocks.length} (${blocks.length >= 6 ? "ok, at least one per array + 2 descriptions" : "TOO FEW"})`)
for (const b of blocks) {
  if (b.includes("$$")) {
    console.error("FAIL: nested $$ inside a dollar-quoted block: " + b.slice(0, 40))
    process.exit(1)
  }
}
console.log("PASS: no nested $$")

// must contain no unescaped single quotes outside dollar blocks (rare case)
for (const needle of [
  "3-days-ritz-carlton-masai-mara-flying-package",
  "4-days-ritz-carlton-masai-mara-flying-package",
  "6400",
  "9200",
  "4,890",
  "6,900",
  "7,900",
  "10,500",
  "ON CONFLICT (slug) DO UPDATE",
  "chef''s table",
  "The Ritz-Carlton, Masai Mara",
  "Lazizi Welfare Foundation",
  "Keekorok",
  "Canon professional cameras",
]) {
  console.log(`${sql.includes(needle) ? "ok  " : "MISS"} ${needle}`)
}

// every `meals`/description string kept its apostrophe safe
const badApostrophe = sql.match(/[$(]'[^']*(\u2019|')/g)
console.log(badApostrophe && badApostrophe.length ? `WARN unexpected quotes: ${badApostrophe.join(" | ")}` : "PASS: no stray quotes outside $$ block")