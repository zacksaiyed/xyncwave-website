import { SolutionOutcome } from "../components/solution-outcome";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Breadcrumbs, CTASection, Eyebrow, SectionIntro } from "../components/page-sections";
import { ContinueExploring } from "../components/continue-exploring";
import { pageHead } from "../lib/seo";
import { caseStudyMedia } from "../lib/media-registry";
import { breadcrumbSchema, jsonLdScript } from "../lib/structured-data";

export const Route = createFileRoute("/case-studies/engineering-capacity")({
  head: () => {
    const path = "/case-studies/engineering-capacity";
    const image = caseStudyMedia["engineering-capacity"]?.src;
    const base = pageHead(
      "Engineering delivery capacity case study",
      "Explore a flexible engineering support model for technology businesses facing delivery demand, specialist gaps, and hiring constraints.",
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
            { name: "Engineering Capacity", path },
          ]),
        }),
      ],
    };
  },
  component: Page,
});

function Page() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Case studies", to: "/case-studies" },
          { label: "Engineering Capacity" },
        ]}
      />
      <section className="bg-surface-hero">
        <div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 lg:px-8 lg:py-20">
          <div className="max-w-4xl">
            <Eyebrow>Case study · Engineering capacity</Eyebrow>
            <h1 className="hero-title">
              Scaling delivery capacity without rebuilding the entire engineering organization.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">
              A flexible model for technology businesses that need additional engineers, technical
              leadership, or delivery support around current demand.
            </p>
          </div>
        </div>
      </section>
      <section className="py-section">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-2 lg:px-8">
          <SectionIntro
            eyebrow="The challenge"
            title="Internal hiring could not be the only path to delivery."
            body="Client demand, specialist needs, and deadlines can move faster than permanent recruitment. The organization needed a way to add capability without losing delivery visibility or ownership."
          />
          <div className="space-y-7">
            {[
              "Additional engineers around active delivery needs",
              "Developers, technical leads, or architects where the work requires them",
              "Planned overlap with US working hours where required",
              "Ongoing support and flexible delivery structures",
            ].map((x) => (
              <div className="flex gap-4 border-b border-border pb-7" key={x}>
                <Check className="mt-1 size-5 shrink-0 text-primary" />
                <p className="text-lg font-semibold leading-7">{x}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Delivery model"
            title="Capability shaped around ownership, not headcount."
          />
          <div className="mt-14 grid border-y border-border md:grid-cols-3">
            <Model
              title="Specialist support"
              body="Add a specific capability into an established team with clear internal ownership."
            />
            <Model
              title="Dedicated pod"
              body="Create a stable cross-functional stream where priorities change but continuity matters."
            />
            <Model
              title="Project delivery"
              body="Give a defined outcome clearer delivery responsibility, governance, and acceptance."
            />
          </div>
        </div>
      </section>
      <section className="bg-surface-inverse py-section text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>How the engagement works</Eyebrow>
              <h2 className="editorial-title">A visible extension of the delivery system.</h2>
            </div>
            <div className="grid gap-7">
              {[
                "Clarify the capability and delivery constraint",
                "Define ownership, communication, and timezone overlap",
                "Integrate engineers into the appropriate cadence",
                "Review delivery fit and adjust capacity as needs change",
              ].map((x, i) => (
                <div
                  key={x}
                  className="grid grid-cols-[2rem_1fr] gap-5 border-t border-primary-foreground/15 pt-5"
                >
                  <span className="text-xs font-bold text-primary">0{i + 1}</span>
                  <p className="text-lg font-semibold">{x}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SolutionOutcome
        intro="Delivery capacity now scales with demand: engineers and technical leadership join the existing cadence while product ownership stays firmly with the internal team."
        outcomes={[
          "Added delivery capacity around active commitments",
          "Access to specialist skills without permanent hiring",
          "Flexible team scaling as priorities change",
          "Dedicated support for backlog and client work",
          "Clearer delivery ownership and communication",
          "Internal product ownership preserved",
          "Planned overlap with US working hours",
        ]}
      />
      <ContinueExploring
        title="Explore the delivery decision"
        items={[
          {
            type: "Insight",
            title: "Staff augmentation vs. a dedicated team",
            body: "Choose based on ownership, uncertainty, and duration.",
            to: "/insights/staff-augmentation-vs-dedicated-team-vs-outsourcing",
          },
          {
            type: "Solution",
            title: "Engineering Capacity",
            body: "Add the capability the work actually needs.",
            to: "/solutions/engineering-capacity",
          },
          {
            type: "Industry",
            title: "Technology & IT Services",
            body: "Support client delivery without premature permanent overhead.",
            to: "/industries/technology-it-services",
          },
        ]}
      />
      <CTASection
        title="What do you need to deliver?"
        body="Bring the deadline, backlog, specialist gap, or client commitment. We will help you think through the delivery options."
        cta="Tell Us What You Need to Deliver"
      />
    </>
  );
}
function Model({ title, body }: { title: string; body: string }) {
  return (
    <div className="border-b border-border py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-4 leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}
