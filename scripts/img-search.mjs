#!/usr/bin/env node
/**
 * Wikimedia Commons image research + verification helper.
 *
 *   node scripts/img-search.mjs search "<query>" [limit]
 *   node scripts/img-search.mjs verify "File:Some title.jpg" ["File:..."]
 *
 * Prints title, canonical upload URL, dimensions, license, artist, and a
 * trimmed description so images can be curated by hand.
 */
const API = "https://commons.wikimedia.org/w/api.php";
const UA = "WildlifeDB/1.0 (image-research; contact@wildlifedb.local)";

function stripHtml(value = "") {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function apiGet(params, attempt = 1) {
  const url = `${API}?${new URLSearchParams(params).toString()}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if ((res.status === 429 || res.status === 503) && attempt <= 6) {
    const wait = (parseInt(res.headers.get("retry-after") || "0", 10) || attempt * 3) * 1000;
    await new Promise((r) => setTimeout(r, wait));
    return apiGet(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

function render(page) {
  const info = page.imageinfo?.[0];
  if (!info?.url) return null;
  const meta = info.extmetadata ?? {};
  return {
    title: page.title,
    url: info.url,
    width: info.width,
    height: info.height,
    mime: info.mime,
    license: stripHtml(meta.LicenseShortName?.value ?? ""),
    licenseUrl: stripHtml(meta.LicenseUrl?.value ?? ""),
    artist: stripHtml(meta.Artist?.value ?? meta.Credit?.value ?? "Unknown"),
    description: stripHtml(meta.ImageDescription?.value ?? "").slice(0, 220),
    pageUrl: info.descriptionurl,
  };
}

function print(c) {
  if (!c) return;
  console.log("--------------------------------------------------");
  console.log(`Title:    ${c.title}`);
  console.log(`Size:     ${c.width} x ${c.height}  (${c.mime})`);
  console.log(`License:  ${c.license}  ${c.licenseUrl}`);
  console.log(`Artist:   ${c.artist}`);
  console.log(`URL:      ${c.url}`);
  if (c.description) console.log(`Desc:     ${c.description}`);
}

async function search(query, limit) {
  const data = await apiGet({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit || 20),
    prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime",
  });
  const pages = Object.values(data.query?.pages ?? {});
  pages.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  console.log(`Query: "${query}" — ${pages.length} results`);
  for (const p of pages) {
    const c = render(p);
    if (c && /jpeg|jpg|png/i.test(c.mime || "")) print(c);
  }
}

async function verify(titles) {
  const data = await apiGet({
    action: "query",
    format: "json",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "url|size|extmetadata|mime",
  });
  const pages = Object.values(data.query?.pages ?? {});
  for (const p of pages) {
    if (p.missing !== undefined) {
      console.log("--------------------------------------------------");
      console.log(`MISSING:  ${p.title}`);
      continue;
    }
    print(render(p));
  }
}

async function main() {
  const [mode, ...rest] = process.argv.slice(2);
  if (mode === "search") {
    const limit = Number(rest[rest.length - 1]);
    const hasLimit = Number.isFinite(limit);
    const query = hasLimit ? rest.slice(0, -1).join(" ") : rest.join(" ");
    await search(query, hasLimit ? limit : 20);
  } else if (mode === "verify") {
    await verify(rest);
  } else {
    console.log('Usage: node scripts/img-search.mjs search "<query>" [limit]');
    console.log('       node scripts/img-search.mjs verify "File:Title.jpg" ...');
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
