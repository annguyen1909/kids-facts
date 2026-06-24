import Link from "next/link";
import { FileText, Globe2, Scale, ShieldCheck } from "lucide-react";
import { InfoPageShell } from "@/components/layout/info-page-shell";
import { InfoSection } from "@/components/layout/info-section";
import { buildPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    `Terms of Use for ${siteConfig.name} — rules for using our educational animal website, content, and images.`,
  path: "/terms",
});

export default function TermsPage() {
  const email = siteConfig.contactEmail;

  return (
    <InfoPageShell
      title="Terms of Use"
      path="/terms"
      eyebrow="Site rules"
      tone="light"
      intro={`These terms explain how you may use ${siteConfig.name} and what you can expect from us.`}
      lastUpdated={siteConfig.legalLastUpdated}
      chips={[{ label: "Educational use" }, { label: "Independent site" }]}
    >
      <InfoSection id="acceptance" icon={FileText} title="Using this website" tone="forest">
        <p>
          By visiting {siteConfig.name}, you agree to these Terms of Use and our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please stop using the
          site.
        </p>
        <p>
          The site is provided for general educational and personal browsing.
        </p>
      </InfoSection>

      <InfoSection id="content" icon={Scale} title="Educational content" tone="sky">
        <p>
          We work hard to publish accurate, accessible animal facts, but science changes and
          mistakes can happen. Content is provided <strong>as is</strong> for learning and
          exploration — not as medical, veterinary, or professional advice.
        </p>
        <p>
          If you spot an error, please tell us through the{" "}
          <Link href="/contact">contact page</Link> so we can review and update the page.
        </p>
      </InfoSection>

      <InfoSection id="images" icon={ShieldCheck} title="Photos and attribution" tone="warm">
        <p>
          Many images are used under open licenses (such as Wikimedia Commons) or with required
          attribution shown on the page. Do not reuse site images without checking the license and
          credit line for that specific photo.
        </p>
        <p>
          The site design, written text, and original layout are protected. You may link to our
          pages, but please do not copy entire articles for republication without permission.
        </p>
      </InfoSection>

      <InfoSection id="conduct" icon={Globe2} title="Fair use and conduct" tone="default">
        <ul>
          <li>Do not attempt to break, scrape, or overload the site.</li>
          <li>Do not use the site for unlawful, harmful, or misleading purposes.</li>
          <li>Do not imply that {siteConfig.name} endorses you without our consent.</li>
        </ul>
      </InfoSection>

      <InfoSection id="links" icon={Globe2} title="Third-party links" tone="sky">
        <p>
          We link to external websites (museums, stores, social platforms, and reference sources).
          We are not responsible for their content, policies, or availability.
        </p>
      </InfoSection>

      <InfoSection id="ads" icon={FileText} title="Ads and affiliate links" tone="forest">
        <p>
          The site may show advertising or affiliate links to help cover running costs. We aim to
          keep ads away from the main reading flow where possible. Purchases through affiliate links
          may earn us a small commission at no extra cost to you.
        </p>
      </InfoSection>

      <InfoSection id="changes" icon={Scale} title="Changes and availability" tone="warm">
        <p>
          We may update pages, features, or these terms at any time. Continued use after changes
          means you accept the updated terms. We do not guarantee uninterrupted access to the
          site.
        </p>
      </InfoSection>

      <InfoSection id="contact" icon={ShieldCheck} title="Contact" tone="forest">
        <p>
          Questions about these terms: <a href={`mailto:${email}`}>{email}</a>
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
