import { createFileRoute, notFound } from "@tanstack/react-router";
import { DigitalVisual } from "../components/digital-visuals";
import { researchMedia } from "../lib/media-registry";
import { useEffect, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { Breadcrumbs, CTASection, Eyebrow } from "../components/page-sections";
import { ResearchGate } from "../components/research-gate";
import { Button } from "../components/ui/button";
import { pageHead } from "../lib/seo";
import { getPaperBySlug } from "../lib/research";
import { track } from "../lib/analytics";

export const Route = createFileRoute("/research/$slug")({
  loader: ({ params }) => {
    const paper = getPaperBySlug(params.slug);
    if (!paper) throw notFound();
    return { paper };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return pageHead("Research unavailable", "The requested research could not be found.", "/research");
    const { paper } = loaderData;
    const path = `/research/${paper.slug}`;
    const base = pageHead(paper.seoTitle.replace(/ \| Xyncwave$/, ""), paper.metaDescription, path);
    return {
      ...base,
      meta: [...base.meta, { name: "author", content: "XWC Research" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Report",
                headline: paper.title,
                description: paper.excerpt,
                datePublished: "2026-11-06",
                author: { "@type": "Organization", name: "XWC Research / Xyncwave Corporation LLP" },
                publisher: { "@type": "Organization", name: "Xyncwave Corporation LLP" },
                mainEntityOfPage: path,
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Research", item: "/research" },
                  { "@type": "ListItem", position: 2, name: paper.title, item: path },
                ],
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
  const { paper } = Route.useLoaderData();
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    track("whitepaper_preview_view", { asset_id: paper.assetId });
  }, [paper.assetId]);

  const openGate = () => {
    track("whitepaper_gate_open", { asset_id: paper.assetId });
    setGateOpen(true);
  };

  return (
    <>
      <Breadcrumbs items={[{ label: "Research", to: "/research" }, { label: paper.title }]} />
      <header className="bg-surface-hero">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_.9fr]"><div className="min-w-0">
            <Eyebrow>Research white paper · {paper.asOf}</Eyebrow>
            <h1 className="hero-title">{paper.title}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">{paper.subtitle}</p>
            <p className="mt-6 text-sm leading-6 text-muted-foreground">{paper.audience}</p>
            <div className="mt-8">
              <Button size="lg" onClick={openGate}>
                {paper.gateCta}
                <ArrowRight />
              </Button>
            </div>
          </div>{researchMedia[paper.slug] && <DigitalVisual media={researchMedia[paper.slug]} eager className="aspect-[16/10]"/>}</div>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-5 py-section lg:px-8">
        <section>
          <h2 className="text-3xl font-medium">From the report</h2>
          {paper.preview.map((paragraph, i) => (
            <p key={i} className="mt-6 text-lg leading-8 text-muted-foreground">{paragraph}</p>
          ))}
          <div className="mt-10 border border-border bg-secondary p-7 sm:p-9">
            <FileText className="size-8 text-primary" />
            <h3 className="mt-4 text-xl font-medium">The full report continues for {paper.sections.length} sections</h3>
            <p className="mt-3 leading-7 text-muted-foreground">
              The complete {paper.title} includes the full analysis, original frameworks, decision checklists and the evidence register. Enter your details and we will email you the PDF.
            </p>
            <Button className="mt-6" onClick={openGate}>
              {paper.gateCta}
              <ArrowRight />
            </Button>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-medium">Questions the report helps you answer</h2>
          <ul className="mt-7 space-y-4">
            {paper.keyQuestions.map((question) => (
              <li key={question} className="flex gap-3 leading-7 text-muted-foreground">
                <span className="mt-2.5 h-0.5 w-5 shrink-0 bg-primary" />
                {question}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-medium">Inside the report</h2>
          <ol className="mt-7 space-y-3">
            {paper.sections.map((section, i) => (
              <li key={section.id} className="flex gap-4 border-b border-border pb-3">
                <span className="text-sm font-medium text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-medium">{section.title}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16 border border-border p-7 sm:p-9">
          <h2 className="text-xl font-medium">Scope and method</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{paper.scopeNote}</p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-medium">Selected sources</h2>
          <ul className="mt-7 space-y-4">
            {paper.bibliography.map((source) => (
              <li key={source.url} className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-foreground">{source.institution} ({source.year}).</span>{" "}
                <a href={source.url} target="_blank" rel="noopener noreferrer" className="link-sweep text-primary">{source.title}</a>
                {source.note ? ` — ${source.note}` : ""}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <CTASection
        title="Reviewing a related initiative?"
        body="Bring the operational or engineering question this research raised. We will help you frame the next step."
        cta={paper.afterCta}
        to="/contact"
      />
      <ResearchGate paper={paper} open={gateOpen} onOpenChange={setGateOpen} />
    </>
  );
}
