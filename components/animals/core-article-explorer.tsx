import { AnimalImageFrame } from "@/components/ui/animal-image-frame";
import { MdxSnippet } from "@/components/mdx/mdx-snippet";
import { splitMdxSections } from "@/lib/core-article";
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
    <article className="core-section-card">
      {image ? (
        <AnimalImageFrame
          src={image.src}
          alt={image.alt}
          aspect="card"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 22rem"
          className="core-section-card__media"
        />
      ) : null}

      <div className="core-section-card__body">
        <h3 className="core-section-card__title">{title}</h3>
        <div className="core-section-card__content">
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
    <div className="core-article-explorer">
      <article className="core-article-intro">
        <p className="eyebrow eyebrow--light">Start here</p>
        <h3 className="core-article-intro__title">{intro.title}</h3>
        <div className="core-article-intro__content">
          <MdxSnippet source={intro.body} />
        </div>
      </article>

      {topicSections.length > 0 ? (
        <div className="core-article-grid">
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
