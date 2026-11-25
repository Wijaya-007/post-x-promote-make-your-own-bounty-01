// Entry ini adalah post X itu sendiri: program ini hanya menyalin alamat
// post dari POST.json ke /output supaya gate membacanya. House membaca
// post langsung dari X, program ini tidak mengunduh atau mengubah apa pun.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const raw = readFileSync(join(botDir, "POST.json"), "utf8");
const data = JSON.parse(raw);

function pickUrl(data) {
  for (const field of ["url", "post_url"]) {
    const value = data[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

const url = pickUrl(data);

const pattern = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+$/;
if (typeof url !== "string" || !pattern.test(url)) {
  console.error(`Invalid X post URL: ${url}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "POST.json"), JSON.stringify({ url }) + "\n", "utf8");
console.log(`Wrote POST.json with url: ${url}`);
