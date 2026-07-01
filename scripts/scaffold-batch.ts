#!/usr/bin/env node
import { scaffoldAnimal } from "@/lib/scaffold-animal";

// Usage: npx tsx scripts/scaffold-batch.ts <slug> "<Display Name>"
const [slug, name] = process.argv.slice(2);

if (!slug || !name) {
  console.error('Usage: npx tsx scripts/scaffold-batch.ts <slug> "<Display Name>"');
  process.exit(1);
}

const result = scaffoldAnimal(slug, { name, force: true });
console.log(`Scaffolded ${result.name} (${result.slug}) at ${result.contentDirectory}`);
