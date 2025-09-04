import * as fs from "fs";
import * as path from "path";

const args = new Map<string,string>(
  process.argv.slice(2).map(a => {
    const [k,v] = a.split("=");
    return [k.replace(/^--/,""), v ?? "true"];
  })
);

const dupPath  = path.resolve(args.get("dup")  || "reports/dupes/duplicates.json");
const nearPath = path.resolve(args.get("near") || "reports/dupes/near-duplicates.json");
const maxExact = Number(args.get("maxExact") ?? "0");
const maxNear  = Number(args.get("maxNear")  ?? "0");

function readJson(p: string) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  if (!fs.existsSync(dupPath) || !fs.existsSync(nearPath)) {
    console.error(`[dup-guard] Reportet mungojnë. Ekzekuto fillimisht: npm run dupes`);
    process.exit(2);
  }

  const dup  = readJson(dupPath);
  const near = readJson(nearPath);

  const exactGroups = (dup.groups ?? []) as string[][];
  const exactCount  = exactGroups.reduce((sum,g)=> sum + Math.max(0, g.length-1), 0);
  const nearPairs   = (near.pairs ?? []) as {a:string;b:string;similarity:number}[];

  console.log(`[dup-guard] Exact duplicates: ${exactCount} (limit ${maxExact})`);
  console.log(`[dup-guard] Near duplicates: ${nearPairs.length} (limit ${maxNear})`);

  if (exactCount > maxExact || nearPairs.length > maxNear) {
    console.error("\n[dup-guard] ❌ Ka dublikime mbi pragjet e lejuara!");
    process.exit(1);
  }

  console.log("\n[dup-guard] ✅ OK — nuk ka dublikime mbi pragjet.");
}

main();
