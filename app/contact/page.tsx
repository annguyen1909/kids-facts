import Link from "next/link";
import {
  Clock3,
  ImageIcon,
  Link2,
  Mail,
  MessageCircle,
  School,
  Shield,
} from "lucide-react";
import { InfoCallout, InfoFeatureCard, InfoSection } from "@/components/layout/info-section";
import { InfoPageShell } from "@/components/layout/info-page-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildPageMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";

export const metadata = buildPageMetadata({
  title: "Contact",
  description:
    `Contact ${siteConfig.name} for corrections, feedback, image licensing questions, or general inquiries.`,
  path: "/contact",
});

const contactReasons = [
  {
    icon: MessageCircle,
    title: "Factual corrections",
    description:
      "Something on an animal page is wrong or outdated? Send the page URL and what should change.",
    tone: "forest" as const,
  },
  {
    icon: Link2,
    title: "Broken links or images",
    description:
      "Tell us if a photo no longer loads or if attribution looks incorrect on any page.",
    tone: "sky" as const,
  },
  {
    icon: ImageIcon,
    title: "Image licensing",
    description:
      "Photographers and rights holders can reach us about attribution, takedown, or replacement.",
    tone: "warm" as const,
  },
  {
    icon: School,
    title: "Educators & families",
    description:
      "Suggestions for animals to cover, classroom or home learning ideas, or accessibility feedback.",
    tone: "default" as const,
  },
  {
    icon: Mail,
    title: "General feedback",
    description:
      "What works, what is confusing, or what you would like to see added next on the site.",
    tone: "sky" as const,
  },
];

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  const xHandle = siteConfig.socials.x;
  const xUrl = `https://x.com/${xHandle.replace("@", "")}`;

  return (
    <InfoPageShell
      title="Contact"
      path="/contact"
      eyebrow="Get in touch"
      tone="forest"
      intro="Questions, corrections, and feedback are welcome. We read every message when time allows."
      chips={[{ label: "Email replies" }, { label: "Small solo project" }]}
    >
      <div className="info-contact-card overflow-hidden rounded-[1.75rem] border border-[rgba(61,143,110,0.22)] bg-[var(--surface-strong)] shadow-[var(--shadow)]">
        <div className="info-contact-card__header bg-gradient-to-br from-[var(--forest-surface-deep)] via-[var(--forest-surface)] to-[color-mix(in_srgb,var(--sky)_35%,var(--forest-surface))] px-6 py-7 text-white sm:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.15rem] bg-white/15 backdrop-blur-sm">
              <Mail className="h-7 w-7" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-white/75">
                Best way to reach us
              </p>
              <p className="mt-2 break-all font-serif text-3xl font-bold tracking-tight sm:text-4xl">
                {email}
              </p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/82 sm:text-base">
                Use a clear subject line — for example, &ldquo;Lion page correction&rdquo; or
                &ldquo;Image license question&rdquo; — so we can respond faster.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 px-6 py-5 sm:px-8">
          <a href={`mailto:${email}`} className={cn(buttonVariants({ size: "lg" }))}>
            Send an email
          </a>
          <a
            href={xUrl}
            rel="noopener noreferrer"
            target="_blank"
            className={cn(buttonVariants({ size: "lg", variant: "secondary" }))}
          >
            Message on {xHandle}
          </a>
        </div>
      </div>

      <div>
        <p className="eyebrow eyebrow--light">How we can help</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--forest-deep)] sm:text-3xl">
          What to contact us about
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {contactReasons.map((item) => (
            <InfoFeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>

      <InfoCallout title="Response time" tone="warm">
        <p>
          This is a small, independently run project. We try to reply within a few business days,
          but busy periods can take longer. Urgent licensing or legal matters should say so in the
          subject line.
        </p>
      </InfoCallout>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoSection icon={Clock3} title="Social updates" tone="sky">
          <p>
            Follow along on{" "}
            <a href={xUrl} rel="noopener noreferrer" target="_blank">
              {xHandle}
            </a>
            . Direct messages are fine for short notes, but email is better for detailed corrections
            or attachments.
          </p>
        </InfoSection>

        <InfoSection icon={Shield} title="Privacy" tone="forest">
          <p>
            If you email us, we use your message only to respond and improve the site. Read our{" "}
            <Link href="/privacy">Privacy Policy</Link> for details on how information is handled.
          </p>
        </InfoSection>
      </div>

      <InfoCallout tone="sky">
        <p>
          <strong className="text-[var(--forest-deep)]">No postal mail required.</strong> We do not
          list a physical office address. Email is the official contact method for this site — that
          is normal for independent web projects and is sufficient for AdSense and most affiliate
          programs.
        </p>
      </InfoCallout>
    </InfoPageShell>
  );
}
