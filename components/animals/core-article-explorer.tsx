import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { MdxSnippet } from "@/components/mdx/mdx-snippet";
import { splitMdxSections } from "@/lib/core-article";
import { cn } from "@/lib/utils";
import type { AnimalImage } from "@/lib/types";

function SectionCard({
  title,
  body,
  image,
}: {
  title: string;
  body: string;
  image?: AnimalImage;
}) {
  return (
    <article
      className={cn(
        "core-section-card flex flex-col overflow-hidden rounded-[1.35rem] border border-[var(--line)] bg-white shadow-[0_10px_28px_rgba(23,49,39,0.06)]",
        image ? "w-full sm:max-w-xl" : "w-fit max-w-prose",
      )}
    >
      {image ? (
        <AnimalImageFrame
          src={image.src}
          alt={image.alt}
          aspect="gallery"
          sizes="(max-width: 768px) 100vw, 28rem"
          className="shrink-0 border-b border-[var(--line)]"
        />
      ) : null}

      <div className="p-4 sm:p-5">
        <h3 className="text-xl font-bold leading-snug text-[var(--forest-deep)]">{title}</h3>
        <div className="mt-3">
          <MdxSnippet source={body} />
        </div>
      </div>
    </article>
  );
}

export async function CoreArticleExplorer({
  source,
  sectionImages = {},
}: {
  source: string;
  sectionImages?: Record<string, AnimalImage>;
}) {
  const sections = splitMdxSections(source);
  if (!sections.length) return null;

  const [intro, ...topicSections] = sections;

  return (
    <div className="space-y-4">
      <article className="w-fit max-w-3xl rounded-[1.5rem] border border-[var(--line)] bg-white p-5 shadow-[var(--shadow)] sm:p-7">
        <p className="eyebrow eyebrow--light">Start here</p>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-[var(--forest-deep)] sm:text-3xl">
          {intro.title}
        </h3>
        <div className="mt-3">
          <MdxSnippet source={intro.body} />
        </div>
      </article>

      {topicSections.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {topicSections.map((section) => (
            <SectionCard
              key={section.title}
              title={section.title}
              body={section.body}
              image={sectionImages[section.title]}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
