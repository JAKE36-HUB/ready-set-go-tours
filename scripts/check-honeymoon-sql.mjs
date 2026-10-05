import { readFileSync } from "node:fs"

const sql = readFileSync("scripts/honeymoon-kenya-ultra-luxury.sql", "utf8")
const m = sql.match(/\$\$\s*(\[[\s\S]*?\])\s*\$\$\s*::jsonb/)
if (!m) {
  console.error("FAIL: dollar-quoted JSON block not found")
  process.exit(1)
}

let arr
try {
  arr = JSON.parse(m[1])
} catch (e) {
  console.error("FAIL: invalid JSON ->", e.message)
  process.exit(1)
}

console.log("JSON valid. days =", arr.length)
for (const d of arr) console.log(`  ${d.day} | ${d.title}`)

const bad = arr.filter((d) => !d.day || !d.title || !d.description)
console.log(bad.length === 0 ? "PASS: all entries have day/title/description" : `FAIL: ${bad.length} entries missing fields`)

// sanity checks against the brief
const expected = [
  "Nairobi to Lake Naivasha",
  "Lake Naivasha — Full Day",
  "Lake Naivasha to Maasai Mara",
  "Maasai Mara — Full Day",
  "Maasai Mara to Nairobi",
]
const titles = arr.map((d) => d.title)
const ok = expected.every((t) => titles.includes(t))
console.log(ok ? "PASS: matches the 5-day brief" : `FAIL: titles differ -> ${JSON.stringify(titles)}`)

for (const needle of ["Loldia House", "Ritz-Carlton", "10900", "5-days-enchanting-kenya-honeymoon-ultra-luxury-safari", "ON CONFLICT"]) {
  console.log(`${sql.includes(needle) ? "ok  " : "MISS"} ${needle}`)
}