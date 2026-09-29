import { createFileRoute, notFound } from "@tanstack/react-router";
import { getBatchArticle } from "../lib/insights-batch";
import { LongFormInsight } from "../components/long-form-insight";
import { articles } from "../lib/content";
import { pageHead } from "../lib/seo";
import { ArrowRight, Check } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { Button } from "../components/ui/button";
import { CTASection, Eyebrow } from "../components/page-sections";
import { ContinueExploring } from "../components/continue-exploring";
import { articleRelations } from "../lib/content-relations";
import { getInsightVisual } from "../components/digital-visuals";
import { getInsightAuthor } from "../lib/insight-authors";
import { InsightAuthor } from "../components/insight-author";

const bodies: Record<
  string,
  {
    intro: string;
    takeaway: string;
    sections: { title: string; body: string }[];
    checklist: string[];
    cta: string;
  }
> = {};

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const batch = getBatchArticle(params.slug);
    if (batch) return { kind: "batch" as const, batch };
    const article = articles.find((a) => a.slug === params.slug);
    const body = bodies[params.slug];
    if (!article || !body) throw notFound();
    return { kind: "legacy" as const, article, body };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return pageHead(
        "Insight unavailable",
        "The requested insight could not be found.",
        "/insights",
      );
    if (loaderData.kind === "legacy") {
      const a = loaderData.article;
      const author = getInsightAuthor(a.slug);
      const path = `/insights/${a.slug}`;
      const base = pageHead(a.title, a.excerpt, path, "article");
      return {
        ...base,
        meta: [...base.meta, ...(author ? [{ name: "author", content: author.name }] : [])],
        scripts: [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: a.title,
              author: author
                ? {
                    "@type": "Person",
                    name: author.name,
                    jobTitle: author.role,
                    worksFor: { "@type": "Organization", name: "Xyncwave Corporation LLP" },
                  }
                : { "@type": "Organization", name: "Xyncwave Insights" },
              publisher: { "@type": "Organization", name: "Xyncwave Corporation LLP" },
              mainEntityOfPage: path,
            }),
          },
        ],
      };
    }
    const a = loaderData.batch;
    const path = `/insights/${a.slug}`;
    const author = getInsightAuthor(a.slug);
    return {
      meta: [
        { title: a.seoTitle },
        { name: "description", content: a.metaDescription },
        { property: "og:title", content: a.seoTitle },
        { property: "og:description", content: a.metaDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: path },
        { name: "twitter:card", content: "summary_large_image" },
        ...(author ? [{ name: "author", content: author.name }] : []),
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: a.title,
                datePublished: a.published,
                dateModified: a.modified,
                author: author
                  ? {
                      "@type": "Person",
                      name: author.name,
                      jobTitle: author.role,
                      worksFor: { "@type": "Organization", name: "Xyncwave Corporation LLP" },
                    }
                  : { "@type": "Organization", name: "Xyncwave Insights" },
                publisher: { "@type": "Organization", name: "Xyncwave Corporation LLP" },
                image: getInsightVisual(a.slug),
                mainEntityOfPage: path,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Insights", item: "/insights" },
                  { "@type": "ListItem", position: 2, name: a.title, item: path },
                ],
              },
              {
                "@type": "FAQPage",
                mainEntity: a.faq.map(([q, answer]) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: { "@type": "Answer", text: answer },
                })),
              },
            ],
          }),
        },
      ],
    };
  },
  component: Page,
});
function Page() {
  const data = Route.useLoaderData();
  if (data.kind === "batch") return <LongFormInsight article={data.batch} />;
  const { article, body } = data;
  const related = articleRelations[article.slug] ?? [];
  return (
    <>
      <article>
        <header className="bg-surface-hero">
          <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 lg:px-8">
            <div className="max-w-4xl">
              <SmartLink to="/insights" className="text-sm font-medium text-primary">
                Technology intelligence
              </SmartLink>
              <p className="type-eyebrow mt-10 text-primary">
                {article.category} · {article.read}
              </p>
              <h1 className="hero-title mt-6">{article.title}</h1>
              <p className="type-lead mt-7 text-muted-foreground">{body.intro}</p>
              <InsightAuthor slug={article.slug} />
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-4xl px-5 py-section">
          <section className="reading-measure border-l-2 border-primary pl-7">
            <p className="type-eyebrow text-primary">Executive takeaway</p>
            <p className="mt-4 text-2xl font-medium leading-9">{body.takeaway}</p>
          </section>
          <div className="mt-16 space-y-16">
            {body.sections.map((s, i) => (
              <section key={s.title} className="grid gap-5 md:grid-cols-[70px_1fr]">
                <span className="text-sm font-medium text-primary">0{i + 1}</span>
                <div>
                  <h2 className="editorial-title">{s.title}</h2>
                  <p className="type-lead mt-5 text-muted-foreground">{s.body}</p>
                </div>
              </section>
            ))}
          </div>
          <section className="mt-16 rounded-card border border-border bg-secondary p-7">
            <Eyebrow>Decision checklist</Eyebrow>
            <h2 className="editorial-title">A practical way to start</h2>
            <ul className="mt-7 space-y-4">
              {body.checklist.map((x) => (
                <li className="flex gap-3" key={x}>
                  <Check className="size-5 text-primary" />
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <Button size="lg" asChild className="mt-10">
            <SmartLink to="/start-a-conversation">
              {body.cta}
              <ArrowRight />
            </SmartLink>
          </Button>
        </div>
      </article>
      <ContinueExploring items={related} />
      <CTASection />
    </>
  );
}
