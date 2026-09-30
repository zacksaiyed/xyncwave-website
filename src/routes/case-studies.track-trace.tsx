import { SolutionOutcome } from "../components/solution-outcome";
import { DigitalVisual } from "../components/digital-visuals";
import { caseStudyMedia, internalMedia } from "../lib/media-registry";
import { createFileRoute } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { Button } from "../components/ui/button";
import { Breadcrumbs, CTASection, Eyebrow, SectionIntro } from "../components/page-sections";
import { ContinueExploring } from "../components/continue-exploring";
import { pageHead } from "../lib/seo";
import { breadcrumbSchema, jsonLdScript } from "../lib/structured-data";

export const Route = createFileRoute("/case-studies/track-trace")({
  head: () => {
    const path = "/case-studies/track-trace";
    const image = caseStudyMedia["track-trace"]?.src;
    const base = pageHead(
      "Connected field service platform case study",
      "See how Xyncwave connected technician work, stock movement, communication, and operational visibility using ERPNext/Frappe, Flutter, and AWS.",
      path,
      { type: "article", ...(image ? { image } : {}) },
    );
    return {
      ...base,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          ...breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case Studies", path: "/case-studies" },
            { name: "Track & Trace", path },
          ]),
        }),
      ],
    };
  },
  component: Page,
});

const problemBlocks = [
  "Information spread across operational touchpoints",
  "Manual coordination between support and field teams",
  "Stock allocation, replacement, and transfer events to trace",
  "Limited shared visibility into task status and completion",
];
const modules = [
  "Support dashboard",
  "Technician task workflow",
  "Stock allocation and transfers",
  "Task chat and alerts",
  "Job-card PDF",
  "Role-based records and APIs",
];
const stages = ["Understand", "Map", "Architect", "Build", "Integrate", "Deploy", "Improve"];

function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Case studies", to: "/case-studies" },
          { label: "Track & Trace" },
        ]}
      />
      <section className="bg-surface-hero">
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Eyebrow>Case study · Field service operations</Eyebrow>
            <h1 className="hero-title">
              From fragmented field work to one connected operational platform.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              A web and mobile system connecting support coordination, technician execution, stock
              movement, communication, evidence, and operational status.
            </p>
          </div>
        </div>
      </section>
      <section className="py-section">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8">
          <SectionIntro
            eyebrow="Client context"
            title="A platform shaped around real operational movement."
          />
          <div className="grid gap-8 sm:grid-cols-2">
            <Fact
              label="Business context"
              value="Field-service and logistics software operations"
            />
            <Fact
              label="Experience"
              value="Support coordinators, technicians, stock, tasks, and job evidence"
            />
            <Fact label="Web platform" value="ERPNext / Frappe" />
            <Fact
              label="Mobile and application layer"
              value="Flutter with an AWS serverless application layer"
            />
          </div>
        </div>
      </section>
      <section className="bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="The challenge"
            title="The operation needed one dependable flow of work."
            body="Support activity, field execution, stock use, communication, and completion evidence needed to move through a shared system rather than separate touchpoints."
          />
          <div className="mt-14 grid border-t border-border md:grid-cols-2">
            {problemBlocks.map((x, i) => (
              <div
                key={x}
                className="border-b border-border py-9 md:px-9 md:odd:border-r md:odd:pl-0"
              >
                <span className="text-xs font-bold text-primary">0{i + 1}</span>
                <p className="mt-6 text-xl font-semibold leading-8">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-surface-inverse py-section text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <Eyebrow>The solution</Eyebrow>
              <h2 className="editorial-title">One connected operational system.</h2>
              <p className="mt-7 max-w-xl text-lg leading-8 text-primary-foreground/65">
                The verified platform combines a Frappe-based web application with a Flutter
                technician experience and APIs supported by an AWS serverless application layer.
              </p>
              <DigitalVisual
                media={internalMedia["track-trace-solution"]}
                className="mt-10 aspect-[16/10]"
              />
            </div>
            <div className="grid border-y border-primary-foreground/15 sm:grid-cols-2">
              {modules.map((x) => (
                <div
                  key={x}
                  className="flex gap-3 border-b border-primary-foreground/15 py-6 sm:px-6"
                >
                  <Check className="mt-1 size-5 shrink-0 text-primary" />
                  <span className="font-semibold">{x}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-px bg-primary-foreground/15 sm:grid-cols-4 lg:grid-cols-7">
            {stages.map((x, i) => (
              <div className="bg-surface-inverse p-5" key={x}>
                <span className="text-xs text-primary">0{i + 1}</span>
                <p className="mt-4 font-semibold">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <SectionIntro
              eyebrow="How it works"
              title="A job stays visible from assignment to completion."
              body="The technician workflow follows Assigned → Ready to Start → Arrived → In Progress → Completed, with operational records and evidence connected around the task."
            />
            <div className="border-l-2 border-primary pl-7">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Verified operational outcomes
              </p>
              <ul className="mt-6 space-y-4">
                {[
                  "Centralized task and support information",
                  "Connected field and support workflows",
                  "Structured stock allocation, replacement, and transfer records",
                  "Clearer task status and completion evidence",
                  "More consistent operational visibility",
                ].map((x) => (
                  <li key={x} className="flex gap-3 leading-7">
                    <Check className="mt-1 size-5 shrink-0 text-primary" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <SolutionOutcome
        muted
        intro="Support coordination, technician execution and stock movement now run through one connected platform, so every job carries consistent status and evidence from assignment to completion."
        outcomes={[
          "Connected operational visibility across support and field teams",
          "Reduced manual status coordination between teams",
          "Consistent task and stock information across web and mobile",
          "Clearer handoffs from assignment to job-card completion",
          "A structured reporting foundation built on shared records",
          "Role-based APIs that ease ERP, finance and customer-system integration",
        ]}
      />
      <ContinueExploring
        title="Follow the connected operations journey"
        items={[
          {
            type: "Insight",
            title: "Logistics digital transformation in Africa",
            body: "Where to start when operational handoffs stop scaling.",
            to: "/insights/logistics-digital-transformation-africa",
          },
          {
            type: "Insight",
            title: "System integration strategy",
            body: "How connected operations decide what moves, who owns it and when.",
            to: "/insights/system-integration-strategy",
          },
          {
            type: "Insight",
            title: "Digitalizing Excel-based workflows",
            body: "A practical path from scattered records to connected work.",
            to: "/insights/digital-transformation-fragmented-systems",
          },
          {
            type: "Solution",
            title: "Digital Transformation",
            body: "Connect workflows, systems, and operational data.",
            to: "/solutions/digital-transformation",
          },
          {
            type: "Industry",
            title: "Logistics & Supply Chain",
            body: "See how connected information changes operational visibility.",
            to: "/industries/logistics",
          },
        ]}
      />
      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-sm text-muted-foreground">Facing a similar challenge?</p>
          <Button
            className="mt-5 h-auto w-full whitespace-normal py-4 text-center sm:w-auto"
            size="lg"
            asChild
          >
            <SmartLink to="/start-a-conversation">
              Tell Us Where Your Operations Are Breaking Down <ArrowRight className="shrink-0" />
            </SmartLink>
          </Button>
        </div>
      </section>
      <CTASection
        title="Bring us the disconnected process."
        body="Tell us where information, work, or visibility is breaking down. We will help frame the technology options."
        cta="Bring Us Your Challenge"
      />
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-border pt-5">
      <p className="text-xs font-bold uppercase text-primary">{label}</p>
      <p className="mt-3 text-lg font-semibold leading-7">{value}</p>
    </div>
  );
}
