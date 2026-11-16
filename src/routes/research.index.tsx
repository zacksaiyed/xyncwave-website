import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { DigitalVisual } from "../components/digital-visuals";
import { researchMedia } from "../lib/media-registry";
import { CTASection, Hero } from "../components/page-sections";
import { pageHead } from "../lib/seo";
import { researchPapers } from "../lib/research";

export const Route = createFileRoute("/research/")({
  head: () => pageHead("Research", "Original Xyncwave research on logistics technology in Southern Africa and engineering readiness for US fintechs.", "/research"),
  component: Page,
});

function Page() {
  return (
    <>
      <Hero
        eyebrow="Xyncwave research"
        title="Research for operators and engineering leaders making systems decisions."
        description="Evidence-grounded white papers on the operational and engineering questions our clients bring to us. Each report is free — we email the full PDF after a short form."
      />
      <section className="py-section">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:px-8">
          {researchPapers.map((paper) => (
            <SmartLink
              key={paper.slug}
              to={`/research/${paper.slug}`}
              className="hover-card group flex flex-col justify-between overflow-hidden border border-border bg-secondary"
            >
              {researchMedia[paper.slug] && <DigitalVisual media={researchMedia[paper.slug]} className="aspect-[16/9] rounded-none border-0"/>}
              <div className="flex flex-1 flex-col justify-between p-8 sm:p-10"><div>
                <p className="text-xs font-medium text-primary">Research white paper · {paper.asOf}</p>
                <h2 className="mt-5 text-2xl font-medium leading-tight sm:text-3xl">{paper.title}</h2>
                <p className="mt-5 leading-7 text-muted-foreground">{paper.excerpt}</p>
                <p className="mt-6 text-sm leading-6 text-muted-foreground">{paper.audience}</p>
              </div>
              <span className="link-sweep mt-8 inline-flex items-center gap-2 font-medium text-primary">
                Read the preview <ArrowRight className="arrow-nudge size-4" />
              </span></div>
            </SmartLink>
          ))}
        </div>
      </section>
      <CTASection
        title="Working through a systems decision?"
        body="Bring the operational or engineering question you are weighing. We will help you frame the options."
        cta="Discuss the Challenge"
      />
    </>
  );
}
