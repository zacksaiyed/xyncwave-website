import { SmartLink, type AppPath } from "./app-link";
import { ArrowRight } from "lucide-react";
import type { Industry, Solution } from "../lib/content";
import { industries, solutions } from "../lib/content";
import {
  Breadcrumbs,
  CTASection,
  FAQSection,
  Hero,
  SectionIntro,
  TriggerSection,
} from "./page-sections";
import { ContinueExploring } from "./continue-exploring";
import { relatedForIndustry, relatedForSolution } from "../lib/content-relations";
import { DigitalVisual, visuals } from "./digital-visuals";
import { IndustryLandingPage } from "./industry-landing-page";

export function SolutionPage({ solution }: { solution: Solution }) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Solutions", to: "/solutions" },
          { label: solution.title },
        ]}
      />
      <Hero
        eyebrow={solution.eyebrow}
        title={solution.heroTitle}
        description={solution.short}
        primary={solution.primaryCta}
      />
      <CommercialJourney content={solution} />
      <ContinueExploring
        title={`Continue the ${solution.title.toLowerCase()} decision`}
        items={relatedForSolution(solution.slug)}
      />
      <FAQSection eyebrow="Buyer questions" title={solution.faqTitle} items={solution.faq} />
      <CTASection title={solution.finalTitle} body={solution.finalBody} cta={solution.finalCta} />
    </>
  );
}

export function IndustryPage({ industry }: { industry: Industry }) {
  return <IndustryLandingPage industry={industry} />;
}

function CommercialJourney({ content }: { content: Solution | Industry }) {
  return (
    <>
      <section className="py-section">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <SectionIntro eyebrow={content.openingEyebrow} title={content.openingTitle} />
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{content.openingBody}</p>
        </div>
      </section>
      <section className="bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Operational friction"
            title={content.frictionsHeading}
            body={content.frictionsIntro}
          />
          <div className="mt-12 grid border-t border-border md:grid-cols-2">
            {content.frictions.map((item, i) => (
              <div
                key={item.title}
                className="border-b border-border py-8 md:px-8 md:odd:border-r md:odd:pl-0"
              >
                <span className="text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-medium">{item.title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <SectionIntro
            eyebrow="Business consequence"
            title={content.consequenceTitle}
            body={content.consequenceBody}
          />
          <div className="rounded-card border border-border bg-secondary p-8 sm:p-10">
            <p className="type-eyebrow text-primary">A stronger operating model</p>
            <h2 className="editorial-title mt-5">{content.futureTitle}</h2>
            <p className="type-body mt-5 text-muted-foreground">{content.futureBody}</p>
          </div>
        </div>
      </section>
      <section className="bg-surface-inverse py-section text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro eyebrow="A connected sequence" title="How the work can move" />
          <div className="mt-12 grid gap-px bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
            {content.futureSteps.map((step, i) => (
              <div key={step} className="bg-surface-inverse p-7">
                <span className="text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-4 font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Xyncwave relevance"
            title={content.relevanceTitle}
            body={content.relevanceBody}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {content.capabilities.map((item, i) => (
              <div className="rounded-card border border-border p-8" key={item.title}>
                <span className="type-meta text-primary">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="type-card-title mt-6">{item.title}</h3>
                <p className="type-body mt-4 text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-secondary py-section">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.7fr_1.3fr] lg:px-8">
          <SectionIntro
            eyebrow="Practical applications"
            title={content.useCasesTitle}
            body={content.useCasesIntro}
          />
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {content.useCases.map((item, i) => (
              <li key={item} className="flex gap-4 border-t border-border py-5">
                <span className="text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <TriggerSection
        eyebrow="Signals for action"
        title={content.triggersHeading}
        body={content.triggersIntro}
        triggers={content.triggers}
      />
      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="A practical engagement"
            title={content.engagementTitle}
            body={content.engagementBody}
          />
          <div className="mt-12 grid border-y border-border md:grid-cols-2 lg:grid-cols-4">
            {content.engagement.map((step, i) => (
              <div
                key={step.title}
                className="border-b border-border py-8 md:px-7 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-inverse py-section text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-medium text-primary">Relevant proof</p>
            <h2 className="mt-5 text-3xl font-medium">{content.proofTitle}</h2>
          </div>
          <div>
            <p className="leading-7 text-primary-foreground/70">{content.proofBody}</p>
            {content.proofTo && content.proofLink && (
              <SmartLink
                to={content.proofTo as AppPath}
                className="mt-7 inline-flex items-center gap-2 font-medium text-primary"
              >
                {content.proofLink}
                <ArrowRight className="size-4" />
              </SmartLink>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

export function ListingPage({ type }: { type: "solutions" | "industries" }) {
  const data = type === "solutions" ? solutions : industries;
  const noun = type === "solutions" ? "business constraint" : "operating environment";
  return (
    <>
      <Hero
        eyebrow={type}
        title={
          type === "solutions"
            ? "Technology shaped around the problem—not the trend."
            : "Industry context changes what good technology looks like."
        }
        description={`Choose the ${noun} closest to yours. Each path explains the problem, practical opportunity, and sensible next step.`}
      />
      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="divide-y divide-border border-y border-border">
            {data.map((x, i) => (
              <SmartLink
                key={x.slug}
                to={`/${type}/${x.slug}` as AppPath}
                className="hover-row group grid py-8 transition-colors duration-300 hover:bg-secondary md:grid-cols-[90px_1fr_1fr_auto] md:items-center md:gap-8 md:px-6"
              >
                <span className="text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-4 text-2xl font-medium transition-colors duration-300 group-hover:text-primary md:mt-0">
                  {x.title}
                </h2>
                <p className="mt-3 leading-7 text-muted-foreground md:mt-0">{x.short}</p>
                <ArrowRight className="arrow-nudge mt-6 size-5 text-primary md:mt-0" />
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-secondary py-section">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-2 lg:px-8">
          <DigitalVisual
            src={type === "solutions" ? visuals.hero : visuals.trackTrace}
            alt="Connected digital systems architecture"
            className="min-h-[400px]"
          />
          <div className="flex items-center p-8 sm:p-12">
            <div>
              <p className="text-xs font-medium text-primary">Business problem first</p>
              <p className="mt-6 text-3xl font-medium leading-tight sm:text-4xl">
                The right intervention may be smaller—and more useful—than a transformation
                programme.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
