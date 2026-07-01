import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";

const WIKIMEDIA_API = "https://commons.wikimedia.org/w/api.php";

async function searchWikimedia(query, attempt = 1) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    list: "search",
    srsearch: query,
    srnamespace: "6", // File namespace
    srlimit: "40"
  });

  const url = `${WIKIMEDIA_API}?${params.toString()}`;
  
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "KidsFactsBot/1.0 (annguyen19@gmail.com) Node/fetch"
      }
    });

    if (res.status === 429 || res.status === 503) {
      const retryAfter = parseInt(res.headers.get("retry-after") || "15", 10);
      console.warn(`Wikimedia rate limit (${res.status}) hit in search. Waiting ${retryAfter} seconds before retry (attempt ${attempt}/5)...`);
      await new Promise(r => setTimeout(r, retryAfter * 1000));
      return searchWikimedia(query, attempt + 1);
    }

    if (!res.ok) {
      const text = await res.text();
      console.warn(`Wikimedia search HTTP error ${res.status}: ${text.slice(0, 100)}`);
      if (attempt <= 5) {
        console.warn(`Retrying in 10 seconds...`);
        await new Promise(r => setTimeout(r, 10000));
        return searchWikimedia(query, attempt + 1);
      }
      throw new Error(`Wikimedia search HTTP error ${res.status}`);
    }

    const data = await res.json();
    const results = data.query?.search ?? [];
    return results.map(r => r.title);
  } catch (err) {
    if (attempt <= 5) {
      console.warn(`Network/JSON error in search. Retrying in 15 seconds (attempt ${attempt}/5)...`, err.message);
      await new Promise(r => setTimeout(r, 15000));
      return searchWikimedia(query, attempt + 1);
    }
    throw err;
  }
}


const REQUIRED_ROLES = [
  { key: "hero", type: "hero", pages: ["gallery"] },
  { key: "habitat", type: "habitat", pages: ["gallery"] },
  { key: "diet", type: "diet", pages: ["gallery"] },
  { key: "baby", type: "baby", pages: ["gallery"] },
  { key: "family", type: "family", pages: ["gallery"] },
  { key: "range", type: "range", pages: ["gallery"] },
  { key: "size", type: "size", pages: ["gallery"] },
  { key: "closeup", type: "closeup", pages: ["gallery"] },
  { key: "fun-fact", type: "fun-fact", pages: ["gallery"] },
  { key: "core-habitat", type: "habitat", pages: ["core"] },
  { key: "core-diet", type: "diet", pages: ["core"] },
  { key: "core-family", type: "family", pages: ["core"] },
  { key: "core-baby", type: "baby", pages: ["core"] },
  { key: "core-range", type: "range", pages: ["core"] }
];

function getAltCaption(role, name) {
  switch (role) {
    case "hero":
      return {
        alt: `A beautiful portrait of a ${name} in the wild`,
        caption: `The ${name} is a highly adapted species with unique behaviors.`
      };
    case "habitat":
    case "core-habitat":
      return {
        alt: `A ${name} navigating its natural environment`,
        caption: `They make their home in diverse habitats where they can find shelter and thrive.`
      };
    case "diet":
    case "core-diet":
      return {
        alt: `A ${name} finding or consuming food`,
        caption: `Finding food is a major part of the daily routine for a ${name}.`
      };
    case "baby":
    case "core-baby":
      return {
        alt: `A young or baby ${name} showing early development`,
        caption: `Baby ${name}s must learn to survive and adapt from a young age.`
      };
    case "family":
    case "core-family":
      return {
        alt: `A group of ${name}s interacting with each other`,
        caption: `While often solitary, some ${name}s interact with others of their species.`
      };
    case "range":
    case "core-range":
      return {
        alt: `A ${name} traveling across its geographic range`,
        caption: `Their geographic range covers various regions suited to their survival.`
      };
    case "size":
      return {
        alt: `A photo showing the size of a ${name}`,
        caption: `The size of a ${name} can vary depending on its age and environment.`
      };
    case "closeup":
      return {
        alt: `A detailed close-up showing the physical features of a ${name}`,
        caption: `A close-up view reveals the intricate details of a ${name}'s body.`
      };
    case "fun-fact":
      return {
        alt: `A ${name} showing a unique behavior or adaptation`,
        caption: `Did you know that the ${name} has amazing features that help it survive?`
      };
    default:
      return {
        alt: `A ${name} in the wild`,
        caption: `An interesting view of a ${name}.`
      };
  }
}

async function main() {
  const slug = process.argv[2];
  const searchQuery = process.argv[3];
  const commonName = process.argv[4];

  if (!slug || !searchQuery || !commonName) {
    console.error("Usage: node scripts/auto-populate-images.mjs <slug> <search-query> <common-name>");
    process.exit(1);
  }

  console.log(`Starting auto-population for ${slug} (${searchQuery} / ${commonName})...`);

  // 1. Search scientific name
  let files = await searchWikimedia(searchQuery);
  
  // Filter only images (must have .jpg, .jpeg, .png, case insensitive)
  files = files.filter(f => /\.(jpe?g|png)$/i.test(f));

  console.log(`Found ${files.length} image files with scientific query.`);

  // 2. Fallback search with common name if we don't have 14 unique files
  if (files.length < 14) {
    console.log("Not enough images found. Searching using common name...");
    const extraFiles = await searchWikimedia(commonName);
    const extraFiltered = extraFiles.filter(f => /\.(jpe?g|png)$/i.test(f));
    for (const file of extraFiltered) {
      if (!files.includes(file)) {
        files.push(file);
      }
    }
    console.log(`Total unique files after common name fallback: ${files.length}`);
  }

  if (files.length < 14) {
    console.error(`Error: Only found ${files.length} images. We need at least 14.`);
    process.exit(1);
  }

  // 3. Map first 14 files to REQUIRED_ROLES
  const config = {};
  for (let i = 0; i < 14; i++) {
    const roleConfig = REQUIRED_ROLES[i];
    const fileTitle = files[i];
    const { alt, caption } = getAltCaption(roleConfig.key, commonName);
    
    config[roleConfig.key] = {
      fileTitle,
      imageType: roleConfig.type,
      featuredOnPages: roleConfig.pages,
      alt,
      caption,
      location: "Unknown"
    };
  }

  // 4. Save scripts/<slug>-images.json
  const configPath = path.join(process.cwd(), "scripts", `${slug}-images.json`);
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf8");
  console.log(`Wrote image configuration to ${configPath}`);

  // 5. Run the update script to download/write detail JSONs
  console.log(`Running update-animal-images-api.mjs for ${slug}...`);
  try {
    execSync(`node scripts/update-animal-images-api.mjs ${slug} ${configPath}`, { stdio: "inherit" });
    console.log(`Successfully completed image metadata generation for ${slug}!`);
  } catch (err) {
    console.error(`Error running update script for ${slug}:`, err.message);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
