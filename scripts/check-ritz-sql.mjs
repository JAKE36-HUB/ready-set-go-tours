import { readFileSync } from "node:fs"

const sql = readFileSync("scripts/ritz-carlton-masai-mara-packages.sql", "utf8")
let fail = false

if (/\$\$/.test(sql)) {
  console.error("FAIL: dollar-quote blocks should NOT be used in this script")
  fail = true
}

const smart = sql.match(/[\u2013\u2014\u2018\u2019\u201c\u201d]/)
if (smart) {
  console.error(`FAIL: non-ASCII dash/quote present: ${smart[0]} (${smart[0].codePointAt(0).toString(16)})`)
  fail = true
}

if (sql.split("'").length % 2 !== 1) {
  console.error("FAIL: odd number of single quotes - unbalanced string literal")
  fail = true
}

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
  if (!sql.includes(needle)) {
    console.error(`MISS: ${needle}`)
    fail = true
  }
}

// no occurrence of a single quote that is not escaped (i.e. "abc'd" instead of "abc''d")
for (const [i, line] of sql.split("\n").entries()) {
  const clean = line.replace(/'{2}/g, "")
  const leading = clean.split("'").length - 1
  if (line.trim() !== "" && !line.includes("--") && leading % 2 === 1 && leading > 0) {
    console.error(`WARN line ${i + 1}: possible unescaped quote -> ${line.trim().slice(0, 70)}`)
    fail = true
  }
}

console.log(fail ? "FAILURES FOUND" : "PASS: script is ASCII-only, dollar-quote-free and balanced")
process.exit(fail ? 1 : 0)