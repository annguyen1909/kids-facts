import { siteConfig } from "@/lib/site-config";

export function GET() {
  const clientId = siteConfig.adsenseClientId;
  if (!clientId) {
    return new Response("AdSense client ID not configured.", { status: 404 });
  }

  const body = `google.com, ${clientId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
