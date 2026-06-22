import { getAllAnimals } from "@/lib/content";
import { getImageSitemapEntries } from "@/lib/images";
import { escapeXml } from "@/lib/xml";

export function GET() {
  const entries = getImageSitemapEntries(getAllAnimals());
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (entry) => `<url>
  <loc>${escapeXml(entry.pageUrl)}</loc>
  <image:image>
    <image:loc>${escapeXml(entry.loc)}</image:loc>
    <image:title>${escapeXml(entry.title)}</image:title>
    <image:caption>${escapeXml(entry.caption)}</image:caption>
  </image:image>
</url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
