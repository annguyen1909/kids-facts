export default function Loading() {
  return (
    <div className="section-shell py-16" aria-busy="true" aria-live="polite">
      <p className="sr-only">Loading page content</p>
      <div className="page-loading">
        <div className="page-loading__hero">
          <div className="page-loading__line page-loading__line--eyebrow" />
          <div className="page-loading__line page-loading__line--title" />
          <div className="page-loading__line page-loading__line--intro" />
        </div>
        <div className="page-loading__grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="page-loading__card" />
          ))}
        </div>
      </div>
    </div>
  );
}
