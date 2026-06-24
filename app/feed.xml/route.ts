import { getPublishedAnimals } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { escapeXml } from "@/lib/xml";

export function GET() {
  const latestUpdated = getPublishedAnimals()
    .map((animal) => animal.core.updatedAt)
    .sort()
    .at(-1);
  const items = getPublishedAnimals()
    .map(
      (animal) => `<item>
  <title>${escapeXml(animal.core.name)} — Animal Facts</title>
  <link>${escapeXml(siteConfig.url)}/animals/${escapeXml(animal.core.slug)}</link>
  <guid>${escapeXml(siteConfig.url)}/animals/${escapeXml(animal.core.slug)}</guid>
  <pubDate>${new Date(animal.core.publishedAt).toUTCString()}</pubDate>
  <description><![CDATA[${animal.core.summary}]]></description>
</item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${escapeXml(siteConfig.url)}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <atom:link href="${escapeXml(siteConfig.url)}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date(latestUpdated ?? Date.now()).toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
