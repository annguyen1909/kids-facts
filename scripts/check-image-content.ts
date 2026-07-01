#!/usr/bin/env tsx
import { validateContent } from "@/lib/content-validation";

// Helper to normalize text for keyword matching
function normalizeText(text: any): string {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s]/g, " "); // Replace punctuation with space
}

async function main() {
  const { animals } = validateContent();
  console.log("=========================================");
  console.log("   Image Quality & Relevance Checker");
  console.log(`   Scanning ${animals.length} animals...`);
  console.log("=========================================\n");

  let totalImages = 0;
  let issuesCount = 0;

  for (const animal of animals) {
    // Generate keywords for matching
    const keywordsSet = new Set<string>();
    
    // Add words from animal name
    normalizeText(animal.core.name).split(/\s+/).forEach(w => {
      if (w.length > 2) keywordsSet.add(w);
    });
    
    // Add words from scientific name
    if (animal.core.scientificName) {
      normalizeText(animal.core.scientificName).split(/\s+/).forEach(w => {
        if (w.length > 2) keywordsSet.add(w);
      });
    }

    // Add common names
    (animal.core.commonNames || []).forEach(name => {
      normalizeText(name).split(/\s+/).forEach(w => {
        if (w.length > 2) keywordsSet.add(w);
      });
    });

    const keywords = Array.from(keywordsSet);
    const animalIssues: string[] = [];

    for (const image of animal.images) {
      totalImages++;
      const imageIssues: string[] = [];

      // 1. Resolution Check
      const width = image.width || 0;
      const height = image.height || 0;
      if (width === 0 || height === 0) {
        imageIssues.push("❌ Missing dimensions (0x0)");
      } else {
        if (width < 1024 || height < 600) {
          imageIssues.push(`⚠️ Low resolution: ${width}x${height} (Recommended min: 1024x600)`);
        }
        
        // Aspect Ratio Check
        const ratio = width / height;
        if (ratio > 2.5) {
          imageIssues.push(`⚠️ Aspect ratio too wide: ${ratio.toFixed(2)}`);
        } else if (ratio < 0.4) {
          imageIssues.push(`⚠️ Aspect ratio too narrow: ${ratio.toFixed(2)}`);
        }
      }

      // 2. Metadata Quality Check
      if (!image.alt || image.alt.trim().length < 10) {
        imageIssues.push(`⚠️ Alt text is too short/missing: "${image.alt || ""}"`);
      }
      if (!image.caption || image.caption.trim().length < 15) {
        imageIssues.push(`⚠️ Caption is too short/missing: "${image.caption || ""}"`);
      }

      // 3. Content Relevance Check (Keyword matching)
      const altNorm = normalizeText(image.alt || "");
      const captionNorm = normalizeText(image.caption || "");
      const srcNorm = normalizeText(image.src || "");
      const slugNorm = normalizeText(image.slug || "");

      const matchedKeyword = keywords.find(keyword => 
        altNorm.includes(keyword) || 
        captionNorm.includes(keyword) || 
        srcNorm.includes(keyword) ||
        slugNorm.includes(keyword)
      );

      if (!matchedKeyword && keywords.length > 0) {
        imageIssues.push(`❌ Relevance mismatch: Name/Keywords [${keywords.join(", ")}] not found in Alt, Caption, or URL`);
      }

      if (imageIssues.length > 0) {
        animalIssues.push(`  - Image "${image.slug}" (${image.imageType}):\n` + imageIssues.map(iss => `      ${iss}`).join("\n"));
      }
    }

    if (animalIssues.length > 0) {
      issuesCount += animalIssues.length;
      console.log(`🐾 Animal: ${animal.core.name} (${animal.core.slug})`);
      console.log(animalIssues.join("\n"));
      console.log("-----------------------------------------");
    }
  }

  console.log("=========================================");
  console.log(`Scan completed.`);
  console.log(`Total images scanned: ${totalImages}`);
  console.log(`Images with quality/relevance issues: ${issuesCount}`);
  console.log("=========================================");
}

main().catch(console.error);
