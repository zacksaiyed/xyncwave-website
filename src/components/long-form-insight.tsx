import { useEffect } from "react";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import type { ArticleSection, BatchArticle } from "../lib/insights-batch";
import { track } from "../lib/analytics";
import { SmartLink } from "./app-link";
import { Button, buttonVariants } from "./ui/button";
import { cn } from "../lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { DigitalVisual } from "./digital-visuals";
import { getInsightMedia, internalMedia } from "../lib/media-registry";
import { InsightAssessment } from "./insight-assessment";
import { InsightDiagram } from "./insight-diagrams";
import { ContinueExploring, type ExploreItem } from "./continue-exploring";
import { SafetyChecklist } from "./safety-checklist";
import { InsightAuthor } from "./insight-author";

const fmt = (d: string) =>
  new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
export function LongFormInsight({ article }: { article: BatchArticle }) {
  useEffect(() => {
    track("article_view", { article_slug: article.slug, topic_cluster: article.cluster });
  }, [article.slug, article.cluster]);
  const related: ExploreItem[] = article.related.map((item) => ({
    type: item.to.includes("case-studies")
      ? "Case study"
      : item.to.includes("industries")
        ? "Industry"
        : item.to.includes("solutions")
          ? "Solution"
          : "Insight",
    title: item.label,
    body: "Continue into the related decision, operating context, or verified evidence.",
    to: item.to,
  }));
  function linkTrack(to: string) {
    track(to.includes("case-studies") ? "case_study_click" : "internal_link_click", {
      article_slug: article.slug,
      topic_cluster: article.cluster,
      destination: to,
    });
  }
  return (
    <>
      <article className="article-page">
        <header className="bg-surface-hero">
          <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
              <SmartLink to="/insights" className="hover:text-primary">
                Insights
              </SmartLink>
              <span aria-hidden="true"> / </span>
              <span>{article.cluster}</span>
            </nav>
            <div className="mt-12 grid items-end gap-10 lg:grid-cols-[1.08fr_.92fr]">
              <div className="min-w-0">
                <p className="type-eyebrow text-primary">
                  {article.cluster} · {article.read}
                </p>
                <h1 className="hero-title mt-5">{article.title}</h1>
                <p className="type-lead mt-7 text-muted-foreground">{article.excerpt}</p>
                <InsightAuthor slug={article.slug} date={fmt(article.published)} />
              </div>
              <DigitalVisual
                media={getInsightMedia(article.slug, article.cluster)}
                eager
                className="aspect-[16/10]"
              />
            </div>
          </div>
        </header>
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-section lg:grid-cols-[260px_minmax(0,760px)] lg:px-8 xl:grid-cols-[280px_minmax(0,800px)]">
          <aside className="min-w-0">
            <details className="rounded-control border border-border bg-background p-5 lg:hidden">
              <summary className="cursor-pointer font-medium">Table of contents</summary>
              <nav className="mt-5 grid gap-1" aria-label="Table of contents">
                {article.toc.map((item) => (
                  <a
                    href={`#${tocTarget(item.id)}`}
                    key={item.id}
                    onClick={() =>
                      track("toc_click", {
                        article_slug: article.slug,
                        topic_cluster: article.cluster,
                        target: item.id,
                      })
                    }
                    className="border-l border-border py-2 pl-3 text-sm leading-5 text-muted-foreground hover:border-primary hover:text-primary"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </details>
            <nav
              className="hidden border-l border-border pl-4 lg:sticky lg:top-28 lg:grid lg:max-h-[calc(100vh-8rem)] lg:gap-1 lg:overflow-y-auto"
              aria-label="Article sections"
            >
              <p className="mb-3 text-sm font-medium">In this article</p>
              {article.toc.map((item) => (
                <a
                  href={`#${tocTarget(item.id)}`}
                  key={item.id}
                  onClick={() =>
                    track("toc_click", {
                      article_slug: article.slug,
                      topic_cluster: article.cluster,
                      target: item.id,
                    })
                  }
                  className="py-1.5 text-sm leading-5 text-muted-foreground hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <div className="min-w-0">
            <section
              aria-labelledby="direct-answer"
              className="reading-measure border-l-2 border-primary pl-6 sm:pl-8"
            >
              <p className="text-xs font-medium text-primary">Direct answer</p>
              <h2 id="direct-answer" className="mt-3 text-2xl font-medium">
                {article.directQuestion}
              </h2>
              <p className="mt-4 text-lg leading-8">{article.directAnswer}</p>
            </section>
            <section className="reading-measure mt-12 rounded-card border border-border bg-secondary p-6 sm:p-8">
              <p className="text-xs font-medium text-primary">Key takeaways</p>
              <ul className="mt-5 space-y-4">
                {article.takeaways.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <Check className="mt-1 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
            <div className="article-copy mt-16">
              {article.sections.map((section, index) => (
                <div key={section.id}>
                  <ArticleSectionView section={section} article={article} linkTrack={linkTrack} />
                  {index === 0 && (
                    <InsightDiagram slug={article.slug} cluster={article.cluster} />
                  )}{" "}
                  {!article.assessmentAfter && section.id === "fragmentation-tax" && (
                    <AssessmentBlock article={article} />
                  )}{" "}
                  {!article.assessmentAfter && section.id === "score" && (
                    <AssessmentBlock article={article} />
                  )}{" "}
                  {article.assessmentAfter === section.id && <AssessmentBlock article={article} />}
                </div>
              ))}
            </div>
            {article.slug === "staff-augmentation-vs-dedicated-team-vs-outsourcing" && (
              <AssessmentBlock article={article} />
            )}
            <section id="faq" className="mt-20 scroll-mt-28">
              <p className="text-xs font-medium text-primary">Buyer questions</p>
              <h2 className="mt-3 text-3xl font-medium sm:text-4xl">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="mt-8 border-t border-border">
                {article.faq.map(([q, a], i) => (
                  <AccordionItem value={`faq-${i}`} key={q}>
                    <AccordionTrigger>{q}</AccordionTrigger>
                    <AccordionContent>
                      <p>{a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
            <section id="sources" className="mt-20 scroll-mt-28 border-t border-border pt-12">
              <p className="text-xs font-medium text-primary">Evidence register</p>
              <h2 className="mt-3 text-3xl font-medium">Research & Sources</h2>
              <ol className="mt-8 space-y-6">
                {article.sources.map((source, i) => (
                  <li key={source.url} className="grid gap-2 sm:grid-cols-[42px_1fr]">
                    <span className="text-sm text-primary">0{i + 1}</span>
                    <div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-start gap-2 font-medium text-foreground hover:text-primary"
                      >
                        {source.name}, {source.year}: {source.title}
                        <ExternalLink className="mt-1 size-4 shrink-0" />
                      </a>
                      {source.note && (
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {source.note}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
            <section className="mt-20 border-y border-border py-12">
              {article.finalEyebrow && (
                <p className="mb-3 text-xs font-medium text-primary">{article.finalEyebrow}</p>
              )}
              <h2 className="text-3xl font-medium">{article.finalHeadline}</h2>
              <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{article.finalBody}</p>
              <a
                href="#article-assessment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-7 h-auto whitespace-normal py-3 text-center",
                )}
                onClick={() =>
                  track("cta_click", {
                    article_slug: article.slug,
                    topic_cluster: article.cluster,
                    cta_position: "final",
                    lead_magnet: article.assessment.title,
                  })
                }
              >
                {article.finalCta}
                <ArrowRight />
              </a>
            </section>
          </div>
        </div>
      </article>
      <ContinueExploring items={related} title="Continue with the next useful decision" />
    </>
  );
}
const legacyAssessmentTargets: Record<string, string> = {
  check: "article-assessment",
  mapper: "article-assessment",
  planner: "article-assessment",
};
function tocTarget(id: string) {
  return legacyAssessmentTargets[id] ?? id;
}
function AssessmentBlock({ article }: { article: BatchArticle }) {
  const aliases = article.toc
    .filter((item) => legacyAssessmentTargets[item.id])
    .map((item) => item.id);
  return (
    <section
      id="article-assessment"
      className="relative mt-20 scroll-mt-28 rounded-card bg-secondary p-5 sm:p-8"
    >
      {aliases.map((id) => (
        <span key={id} id={id} className="absolute scroll-mt-28" aria-hidden="true" />
      ))}
      <p className="text-xs font-medium text-primary">Interactive planning tool</p>
      <h2 className="mt-3 text-3xl font-medium sm:text-4xl">{article.assessment.title}</h2>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{article.assessment.intro}</p>
      <div className="mt-8">
        <InsightAssessment article={article} />
      </div>
    </section>
  );
}
function ArticleSectionView({
  section,
  article,
  linkTrack,
}: {
  section: ArticleSection;
  article: BatchArticle;
  linkTrack: (to: string) => void;
}) {
  return (
    <section
      id={section.id}
      className={`article-section scroll-mt-28 ${section.variant ? `article-section-${section.variant}` : ""}`}
    >
      <h2>{section.title}</h2>
      {section.answer && <p className="article-answer">{section.answer}</p>}
      {section.paragraphs?.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {internalMedia[`${article.slug}:${section.id}`] && (
        <DigitalVisual
          media={internalMedia[`${article.slug}:${section.id}`]}
          className="my-8 aspect-[16/10]"
        />
      )}
      {section.bullets && (
        <ul>
          {section.bullets.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      )}
      {section.subsections?.map((sub) => (
        <div className="article-subsection" key={sub.title}>
          <h3>{sub.title}</h3>
          {sub.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {sub.bullets && (
            <ul>
              {sub.bullets.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {section.table && (
        <div
          className="article-table-wrap"
          role="region"
          aria-label={`${section.title} comparison`}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {section.table.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={`${i}-${j}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {section.checklist && (
        <SafetyChecklist items={section.checklist} slug={article.slug} cluster={article.cluster} />
      )}
      {section.links && (
        <div className="article-links">
          {section.links.map((link) => (
            <SmartLink key={link.to} to={link.to} onClick={() => linkTrack(link.to)}>
              {link.label}
              <ArrowRight />
            </SmartLink>
          ))}
        </div>
      )}
    </section>
  );
}
