import { Hero, CTASection, SectionIntro } from "./page-sections";
export function StaticPage({
  eyebrow,
  title,
  description,
  sections,
  cta = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections?: { title: string; body: string; items?: string[] }[];
  cta?: boolean;
}) {
  return (
    <>
      <Hero eyebrow={eyebrow} title={title} description={description} />
      {sections && sections.length > 0 && (
        <section className="py-section">
          <div className="mx-auto max-w-5xl px-5 lg:px-8">
            <div className="space-y-14">
              {sections.map((s, i) => (
                <div
                  key={s.title}
                  className="grid gap-6 border-t border-border pt-9 md:grid-cols-[180px_1fr]"
                >
                  <p className="type-meta text-primary">0{i + 1}</p>
                  <div>
                    <h2 className="editorial-title">{s.title}</h2>
                    <p className="type-body mt-5 text-muted-foreground">{s.body}</p>
                    {s.items && (
                      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                        {s.items.map((x) => (
                          <li key={x} className="rounded-control bg-secondary p-4 font-medium">
                            {x}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      {cta && <CTASection />}
    </>
  );
}
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="bg-surface-hero">
        <div className="mx-auto flex min-h-[420px] max-w-3xl items-center px-5 py-16">
          <div>
            <p className="type-eyebrow text-primary">Legal</p>
            <h1 className="hero-title mt-4">{title}</h1>
            <p className="type-meta mt-4 text-muted-foreground">Last updated: {updated}</p>
          </div>
        </div>
      </header>
      <article className="mx-auto max-w-3xl px-5 py-section">
        <div className="reading-measure space-y-8 leading-7 text-muted-foreground [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-foreground">
          {children}
        </div>
      </article>
    </>
  );
}
