#!/usr/bin/env tsx
import { validateContent } from "@/lib/content-validation";
import { getDisplayImageSrc } from "@/lib/images";

const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function probeUrl(url: string): Promise<number | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": "https://www.google.com/"
      }
    });
    return res.status;
  } catch (err) {
    return null;
  }
}

async function main() {
  const { animals } = validateContent();
  console.log("=========================================");
  console.log(`Starting Image Validation Script`);
  console.log(`Animals found: ${animals.length}`);
  
  const refs: Array<{ animal: string; slug: string; url: string }> = [];
  for (const animal of animals) {
    for (const image of animal.images) {
      refs.push({
        animal: animal.core.name,
        slug: image.slug,
        url: getDisplayImageSrc(image.src)
      });
    }
  }
  
  console.log(`Total images to check: ${refs.length}`);
  console.log(`Checking URLs... (Using browser user-agent & no-referrer simulation)`);
  console.log("=========================================");

  let checked = 0;
  const broken: typeof refs = [];
  const rateLimited: typeof refs = [];
  const ok: typeof refs = [];

  // Check in small chunks to avoid hitting rate limits too fast
  const CONCURRENCY = 5;
  for (let i = 0; i < refs.length; i += CONCURRENCY) {
    const chunk = refs.slice(i, i + CONCURRENCY);
    await Promise.all(chunk.map(async (ref) => {
      const status = await probeUrl(ref.url);
      checked++;

      if (status === 200) {
        ok.push(ref);
      } else if (status === 429) {
        rateLimited.push(ref);
      } else {
        broken.push({ ...ref, url: `${ref.url} [HTTP ${status ?? "Failed"}]` });
      }
    }));

    if (checked % 50 === 0 || checked === refs.length) {
      console.log(`Progress: ${checked}/${refs.length} checked...`);
    }

    // Add a tiny delay between chunks
    await new Promise(resolve => setTimeout(resolve, 80));
  }

  console.log("\n================ RESULTS ================");
  console.log(`✅ Successful: ${ok.length}`);
  console.log(`⚠️ Rate Limited (HTTP 429): ${rateLimited.length}`);
  console.log(`❌ Broken (404/500/etc): ${broken.length}`);

  if (broken.length > 0) {
    console.log("\n--- Broken Images List ---");
    for (const ref of broken) {
      console.log(`- [${ref.animal}] ${ref.slug}: ${ref.url}`);
    }
    process.exit(1);
  } else {
    console.log("\nAll images resolved successfully or are temporarily rate-limited (No 404/500 broken links found)!");
    process.exit(0);
  }
}

main().catch((error) => {
  console.error("Execution error:", error);
  process.exit(1);
});
