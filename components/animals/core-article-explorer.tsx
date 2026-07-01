import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { MdxSnippet } from "@/components/mdx/mdx-snippet";
import { splitMdxSections } from "@/lib/core-article";
import type { AnimalImage } from "@/lib/types";

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
    <article className="mx-auto w-full max-w-3xl">
      {/* Editorial Intro */}
      <div className="mb-12 sm:mb-16">
        <span className="inline-flex rounded-full bg-[var(--forest-deep)]/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[var(--forest-deep)] ring-1 ring-inset ring-[var(--forest-deep)]/20 mb-6">
          Start here
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[var(--forest-deep)] mb-6">
          {intro.title}
        </h2>
        {/* Drop cap effect on first paragraph can be achieved with Tailwind prose if needed, 
            but for now we use an elegant, slightly larger intro font */}
        <div className="prose prose-lg sm:prose-xl prose-p:text-[var(--foreground)] prose-p:leading-relaxed prose-p:font-medium prose-p:text-[color-mix(in_srgb,var(--foreground)_85%,transparent)] max-w-none">
          <MdxSnippet source={intro.body} />
        </div>
      </div>

      {topicSections.length > 0 && (
        <div className="w-16 h-px bg-[var(--line)] mb-12 sm:mb-16 mx-auto" aria-hidden="true" />
      )}

      {/* Article Flow */}
      <div className="flex flex-col gap-12 sm:gap-16">
        {topicSections.map((section) => {
          const image = sectionImages[section.title];
          return (
            <section key={section.title} className="flex flex-col gap-6">
              <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--forest-deep)]">
                {section.title}
              </h3>
              
              {image ? (
                <figure className="my-4 overflow-hidden rounded-[1.5rem] bg-[var(--surface-strong)] shadow-md ring-1 ring-black/5">
                  <AnimalImageFrame
                    src={image.src}
                    alt={image.alt}
                    updatedAt={image.updatedAt}
                    aspect="card"
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]"
                  />
                  {image.caption ? (
                    <figcaption className="px-4 py-3 text-sm text-[var(--muted)] text-center border-t border-[var(--line)] bg-[var(--surface-strong)]/30">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              <div className="prose prose-base sm:prose-lg prose-p:text-[var(--muted)] prose-p:leading-relaxed max-w-none">
                <MdxSnippet source={section.body} />
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}
