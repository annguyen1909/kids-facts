This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Content validation

After adding or editing animal images, run the full content check before opening a PR:

```bash
npm run content:check
```

This runs schema/reference validation (`content:validate:local`) and live Wikimedia URL checks (`content:validate-urls`). CI runs the same command on every pull request.

### Image workflow

1. **Add or update images** using Commons-backed scripts so `src` and `source.sourceUrl` stay in sync:
   - `scripts/lib/update-wikimedia-animal-images.mjs` (`applyWikimediaUpdates`) — preferred for batch fixes
   - `scripts/update-animal-images-api.mjs` — single-animal config-driven updates
2. **Repair stale URLs** if manifests were edited manually or Commons paths changed:
   ```bash
   npm run content:repair-urls
   ```
3. **Validate locally** (fast, no network):
   ```bash
   npm run content:validate:local
   ```
4. **Full check** (schema + remote URL HEAD requests):
   ```bash
   npm run content:check
   ```

Guardrails that prevent common failures:

- `lib/wikimedia-image.ts` resolves Commons file titles from `sourceUrl` and fetches canonical `src` via the Commons API.
- `normalizeLicenseUrl()` converts protocol-relative or Commons-file license links into valid `https://creativecommons.org/...` URLs.
- `lib/image-integrity.ts` rejects core images that duplicate gallery `src` values.
- `lib/validate-image-urls.ts` validates live `src` URLs against the Commons file referenced by `sourceUrl`.
