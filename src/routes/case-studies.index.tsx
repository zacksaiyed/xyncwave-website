import {
  getInsightMedia,
  getCaseStudyMedia,
  caseStudyMedia,
  type MediaEntry,
} from "../lib/media-registry";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { CTASection, Hero } from "../components/page-sections";
import { DigitalVisual, visuals } from "../components/digital-visuals";
import { pageHead } from "../lib/seo";
import { caseStudies } from "../lib/case-studies";
export const Route = createFileRoute("/case-studies/")({
  head: () =>
    pageHead(
      "Technology transformation case studies",
      "Real problems, practical technology, and connected outcomes from Xyncwave delivery experiences.",
      "/case-studies",
    ),
  component: Page,
});
function Page() {
  return (
    <>
      <Hero
        eyebrow="Transformation experience"
        title="Real problems. Practical technology. Long-term delivery."
        description="Explore how operating constraints become connected systems and how delivery capability can expand around real demand."
      />
      <section className="py-section">
        <div className="mx-auto max-w-7xl space-y-24 px-5 lg:px-8">
          <Story
            to="/case-studies/track-trace"
            media={caseStudyMedia["track-trace"]}
            tag="Digitalization · Field service"
            title="From fragmented field work to one connected operational platform."
            problem="Support, technician work, stock movement, communication, and job evidence needed one shared operational flow."
            outcome="A connected web and mobile platform with clearer task status, structured records, and operational visibility."
          />
          {caseStudies.map((c, i) => (
            <Story
              key={c.slug}
              reverse={i % 2 === 0}
              to={`/case-studies/${c.slug}`}
              media={getCaseStudyMedia(c.slug, c.category)}
              tag={c.category}
              title={c.title}
              problem={c.cardProblem}
              outcome={c.cardTransformation}
            />
          ))}
          <Story
            reverse={caseStudies.length % 2 === 0}
            to="/case-studies/engineering-capacity"
            media={caseStudyMedia["engineering-capacity"]}
            tag="Engineering capacity"
            title="Scaling delivery capacity around real demand."
            problem="Delivery needs can grow faster than permanent hiring without becoming predictable enough for fixed overhead."
            outcome="A flexible model spanning specialist support, delivery pods, and project teams with clear ownership."
          />
        </div>
      </section>
      <CTASection />
    </>
  );
}
function Story({
  to,
  media,
  tag,
  title,
  problem,
  outcome,
  reverse = false,
}: {
  to: string;
  media: MediaEntry | undefined;
  tag: string;
  title: string;
  problem: string;
  outcome: string;
  reverse?: boolean;
}) {
  return (
    <article className="grid overflow-hidden rounded-card border border-border bg-secondary lg:grid-cols-2">
      <DigitalVisual
        media={media}
        className={`min-h-[360px] rounded-none border-0 ${reverse ? "lg:order-2" : ""}`}
      />
      <div className="flex flex-col justify-center p-8 sm:p-12">
        <p className="type-eyebrow text-primary">{tag}</p>
        <h2 className="editorial-title mt-6">{title}</h2>
        <dl className="mt-9 space-y-6">
          <div>
            <dt className="type-meta text-muted-foreground">The problem</dt>
            <dd className="mt-2 leading-7">{problem}</dd>
          </div>
          <div>
            <dt className="type-meta text-muted-foreground">The transformation</dt>
            <dd className="mt-2 leading-7">{outcome}</dd>
          </div>
        </dl>
        <SmartLink
          to={to}
          className="link-sweep mt-9 inline-flex items-center gap-2 font-semibold text-primary"
        >
          See the Transformation <ArrowRight className="arrow-nudge size-4" />
        </SmartLink>
      </div>
    </article>
  );
}
