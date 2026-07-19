/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "src", "lib", "constants.ts");
let content = fs.readFileSync(filePath, "utf-8");

const workingIds = [
  "1505649118510-a5d934d3af17",
  "1587115441653-a0498de1d338",
  "1568690697030-7327b84ccaf9",
  "1760720221487-5a8b332a2078",
  "1563382116742-9afc005ec9d0",
  "1741850821836-a0228e561406",
  "1770988967110-8b8026485ccd",
  "1750108913479-303f152b0d29",
  "1772290618178-1f8bfaac6568",
  "1764001111516-926e7526ff9d",
  "1768384092683-103a0d501467",
  "1728042107033-76b13feac547",
  "1758029762866-3d4bff447b83",
  "1765706729287-953837a94f4d",
  "1757833325757-0b1e287deb8e",
  "1770843093638-1941ee5cbc64",
  "1505649118510-a5d934d3af17",
  "1587115441653-a0498de1d338",
  "1568690697030-7327b84ccaf9",
  "1760720221487-5a8b332a2078",
  "1563382116742-9afc005ec9d0",
  "1741850821836-a0228e561406",
  "1770988967110-8b8026485ccd",
  "1750108913479-303f152b0d29",
  "1772290618178-1f8bfaac6568",
  "1764001111516-926e7526ff9d",
  "1768384092683-103a0d501467",
  "1728042107033-76b13feac547",
  "1758029762866-3d4bff447b83",
  "1765706729287-953837a94f4d",
  "1757833325757-0b1e287deb8e",
  "1770843093638-1941ee5cbc64",
];

const keepIds = [
  "1438761681033-6461ffad8d80",
  "1472099645785-5658abf4ff4e",
  "1487412720507-e7ab37603c6f",
  "1489424731084-a5d8b219a5bb",
  "1494790108377-be9c29b29330",
  "1506794778202-cad84cf45f1d",
  "1506905925346-21bda4d32df4",
  "1507003211169-0a1dd7228f2d",
  "1508214751196-bcfd4ca60f91",
  "1516426122078-c23e76319801",
  "1534177616072-ef7dc120449d",
  "1539571696357-5a69c17a67c6",
  "1547471080-7cc2caa01a7e",
];

// Find all unique photo IDs
const regex = /https:\/\/images\.unsplash\.com\/photo-([\w-]+)\?/g;
let match;
const allIds = [];
while ((match = regex.exec(content)) !== null) {
  allIds.push(match[1]);
}

const uniqueIds = [...new Set(allIds)];
const toReplace = uniqueIds.filter((id) => !keepIds.includes(id));

console.log("Total unique IDs:", uniqueIds.length);
console.log("IDs to replace:", toReplace.length);

// Build replacement map
const replaceMap = {};
let idx = 0;
toReplace.forEach((id) => {
  replaceMap[id] = workingIds[idx % workingIds.length];
  idx++;
});

// Do replacements
let count = 0;
let result = content;
for (const [oldId, newId] of Object.entries(replaceMap)) {
  const oldStr = `photo-${oldId}?`;
  const newStr = `photo-${newId}?`;
  const splitResult = result.split(oldStr);
  if (splitResult.length > 1) {
    count += splitResult.length - 1;
    result = splitResult.join(newStr);
  }
}

fs.writeFileSync(filePath, result, "utf-8");
console.log("Replaced " + count + " occurrences across " + toReplace.length + " unique IDs");
