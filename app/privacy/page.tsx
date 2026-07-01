import Link from "next/link";
import {
  Cookie,
  Database,
  ExternalLink,
  Globe2,
  Megaphone,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { InfoSection } from "@/components/layout/info-section";
import { InfoPageShell } from "@/components/layout/info-page-shell";
import { PrivacySettingsControl } from "@/components/layout/privacy-settings-control";
import { buildPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    `Privacy Policy for ${siteConfig.name} — how we handle cookies, advertising, analytics, and visitor data on our educational animal website.`,
  path: "/privacy",
});

const toc = [
  { id: "overview", label: "Overview" },
  { id: "who-we-are", label: "Who we are" },
  { id: "information", label: "Information we collect" },
  { id: "cookies", label: "Cookies" },
  { id: "advertising", label: "Advertising" },
  { id: "affiliate", label: "Affiliate links" },
  { id: "third-party", label: "Third-party content" },
  { id: "privacy-settings", label: "Privacy settings" },
  { id: "use", label: "How we use data" },
  { id: "retention", label: "Data retention" },
  { id: "rights", label: "Your choices" },
  { id: "international", label: "International visitors" },
  { id: "changes", label: "Policy changes" },
  { id: "contact", label: "Contact" },
];

export default function PrivacyPage() {
  const email = siteConfig.contactEmail;

  return (
    <InfoPageShell
      title="Privacy Policy"
      path="/privacy"
      eyebrow="Your privacy"
      tone="light"
      intro={`This policy explains what ${siteConfig.name} collects, how we use it, and the choices you have.`}
      lastUpdated={siteConfig.legalLastUpdated}
      chips={[
        { label: "General audience" },
        { label: "Educational site" },
        { label: "Privacy settings", href: "#privacy-settings" },
      ]}
      toc={toc}
    >
      <InfoSection id="overview" icon={ShieldCheck} title="Overview" tone="forest">
        <p>
          {siteConfig.name} ({siteConfig.url}) is an educational website about animals for families,
          students, teachers, and curious readers. We take privacy seriously and keep data collection
          to what is needed to run and improve the site.
        </p>
      </InfoSection>

      <InfoSection id="who-we-are" icon={UserRound} title="Who we are" tone="sky">
        <p>
          The site is operated independently under the name {siteConfig.organizationName}. For
          privacy questions, contact us at{" "}
          <a href={`mailto:${email}`}>{email}</a> or visit our{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </InfoSection>

      <InfoSection id="information" icon={Database} title="Information we collect" tone="default">
        <h3 className="text-lg font-extrabold text-[var(--forest-deep)]">Information you send us</h3>
        <p>
          If you email us, we receive whatever you choose to share (your email address, message
          content, and any attachments). We use that information only to respond and improve the
          site.
        </p>
        <h3 className="mt-5 text-lg font-extrabold text-[var(--forest-deep)]">
          Information collected automatically
        </h3>
        <p>
          Like most websites, our hosting and analytics providers may log technical data such as
          browser type, device type, general location (city/country level), pages visited, and
          referring URL. We do not ask visitors to create accounts or submit personal profiles to
          read animal pages.
        </p>
      </InfoSection>

      <InfoSection id="cookies" icon={Cookie} title="Cookies and similar technologies" tone="sky">
        <p>We and our partners may use cookies, local storage, or similar tools to:</p>
        <ul>
          <li>remember basic preferences;</li>
          <li>measure traffic and page performance;</li>
          <li>serve and limit ads;</li>
          <li>prevent fraud and abuse.</li>
        </ul>
        <p>
          Non-essential analytics and advertising scripts load only after you accept the consent
          banner. You can also control cookies through your browser settings. Blocking cookies may
          affect how some features work.
        </p>
      </InfoSection>

      <InfoSection id="advertising" icon={Megaphone} title="Advertising (Google AdSense)" tone="forest">
        <p>
          We may show ads from Google AdSense or similar networks to help support the site. Google
          and its partners may use cookies to serve ads based on your visits to this and other
          websites, but we defer those ad scripts until you give consent on this site.
        </p>
        <ul>
          <li>
            Google&apos;s advertising policies:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              rel="noopener noreferrer"
              target="_blank"
            >
              How Google uses data in advertising
            </a>
          </li>
          <li>
            Opt out of personalized advertising:{" "}
            <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
              Google Ads Settings
            </a>
          </li>
          <li>
            Industry opt-out (US):{" "}
            <a href="https://optout.aboutads.info" rel="noopener noreferrer" target="_blank">
              aboutads.info
            </a>
          </li>
        </ul>
      </InfoSection>

      <InfoSection id="affiliate" icon={ExternalLink} title="Affiliate links" tone="warm">
        <p>
          Some pages may include affiliate links (for example, to books or educational products).
          If you click an affiliate link and make a purchase, we may earn a small commission at no
          extra cost to you. Affiliate partners may use their own cookies; their policies apply
          when you leave our site.
        </p>
      </InfoSection>

      <InfoSection id="third-party" icon={Globe2} title="Third-party content and links" tone="default">
        <p>
          Animal photos may be hosted or linked from services such as Wikimedia Commons. External
          sites we link to (museums, conservation groups, stores) have separate privacy practices.
          We are not responsible for those third-party policies.
        </p>
      </InfoSection>

      <InfoSection id="privacy-settings" icon={ShieldCheck} title="Privacy settings" tone="warm">
        <p>
          You can change your optional analytics and advertising preference here at any time.
        </p>
        <div className="mt-4">
          <PrivacySettingsControl />
        </div>
      </InfoSection>

      <InfoSection id="use" icon={Scale} title="How we use information" tone="sky">
        <ul>
          <li>operate and secure the website;</li>
          <li>understand which pages are useful;</li>
          <li>fix errors and improve content;</li>
          <li>respond to messages you send us;</li>
          <li>comply with legal obligations.</li>
        </ul>
        <p>
          <strong>We do not sell your personal information.</strong>
        </p>
      </InfoSection>

      <InfoSection id="retention" icon={Database} title="Data retention" tone="default">
        <p>
          Server logs are kept only as long as needed for security and analytics, then rotated or
          deleted according to our hosting provider&apos;s schedule. Email correspondence is kept
          only as long as needed to handle your request.
        </p>
      </InfoSection>

      <InfoSection id="rights" icon={ShieldCheck} title="Your choices and rights" tone="forest">
        <p>
          Depending on where you live, you may have rights to access, correct, or delete personal
          data we hold about you. Email <a href={`mailto:${email}`}>{email}</a> to make a request.
          We may need to verify your identity before acting on it.
        </p>
      </InfoSection>

      <InfoSection id="international" icon={Globe2} title="International visitors" tone="sky">
        <p>
          The site is published in English and may be accessed worldwide. Data may be processed in
          countries where our hosting and service providers operate, including the United States.
        </p>
      </InfoSection>

      <InfoSection id="changes" icon={Scale} title="Changes to this policy" tone="warm">
        <p>
          We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date
          in the hero will change when we do. Continued use of the site after changes means you
          accept the revised policy.
        </p>
      </InfoSection>

      <InfoSection id="contact" icon={UserRound} title="Contact" tone="forest">
        <p>
          Privacy questions: <a href={`mailto:${email}`}>{email}</a>
        </p>
      </InfoSection>
    </InfoPageShell>
  );
}
