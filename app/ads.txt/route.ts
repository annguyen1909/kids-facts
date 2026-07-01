import { siteConfig } from "@/lib/site-config";

export function GET() {
  const publisherId = siteConfig.adsensePublisherId;
  if (!publisherId) {
    return new Response("AdSense client ID not configured.", { status: 404 });
  }

  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
