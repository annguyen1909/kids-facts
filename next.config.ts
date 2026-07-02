import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  outputFileTracingExcludes: {
    "**/*": ["public/**/*", "scripts/**/*", "assets/**/*", "docs/**/*"]
  },
  experimental: {
    mdxRs: true,
    viewTransition: true,
  },
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      {
        source: "/animals/:slug/gallery/:topic",
        destination: "/animals/:slug#gallery",
        permanent: true,
      },
      {
        source: "/animals/:slug/gallery",
        destination: "/animals/:slug#gallery",
        permanent: true,
      },
      {
        source:
          "/animals/:slug/:page(diet|habitat|behavior|life-cycle|babies|predators-and-threats|adaptations|lifespan|size|conservation-status|where-does-it-live|what-does-it-eat)",
        destination: "/animals/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "inaturalist-open-data.s3.amazonaws.com" },
      { protocol: "https", hostname: "static.inaturalist.org" },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
