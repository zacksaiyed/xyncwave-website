import { ArrowRight, Compass, GitBranch, Globe2, Shapes, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { track } from "../lib/analytics";
import { Eyebrow } from "./page-sections";
import { SmartLink, type AppPath } from "./app-link";
import {
  founder,
  teamMembers,
  companyNews,
  type FounderMedia,
  type TeamMember,
} from "../lib/about-content";

function FounderMediaFrame({ media }: { media: FounderMedia }) {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div
        aria-hidden
        className="absolute -left-10 -top-10 size-72 rounded-full bg-primary/10 blur-2xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-6 -right-6 h-3/4 w-3/4 rounded-3xl border border-border bg-surface-strong"
      />
      <div aria-hidden className="absolute -left-4 top-1/3 h-px w-24 bg-primary" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted">
        {media.type === "video" && media.videoSrc ? (
          <video
            className="size-full object-cover"
            src={media.videoSrc}
            poster={media.posterSrc ?? media.imageSrc}
            controls
            muted
            playsInline
            preload="metadata"
            aria-label={media.alt}
          />
        ) : (
          <img
            src={media.imageSrc}
            alt={media.alt}
            width={1024}
            height={1280}
            loading="lazy"
            className="size-full object-cover"
            style={{ objectPosition: "center 25%" }}
          />
        )}
      </div>
    </div>
  );
}

export function FounderFeature() {
  return (
    <section
      aria-labelledby="founder-heading"
      className="overflow-hidden border-t border-border py-section"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <div className="lg:col-span-7">
          <FounderMediaFrame media={founder.media} />
        </div>
        <div className="min-w-0 lg:col-span-5">
          <Eyebrow>Founder</Eyebrow>
          <h2 id="founder-heading" className="editorial-title">
            Building Xyncwave around practical technology, clear thinking and accountable delivery.
          </h2>
          <div className="mt-8 border-l-2 border-primary pl-5">
            <p className="text-xl font-semibold">{founder.name}</p>
            <p className="text-sm text-muted-foreground">{founder.role}</p>
          </div>
          <div className="mt-8 space-y-5 leading-7 text-muted-foreground">
            {founder.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 border-t border-border pt-6 text-sm font-medium">
            {founder.principles.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const shapeClass: Record<TeamMember["shape"], string> = {
  portrait: "aspect-[4/5] rounded-card",
  circle: "aspect-square rounded-full",
  square: "aspect-square rounded-3xl",
};

function Portrait({
  m,
  size = "w-full",
  geometry,
}: {
  m: TeamMember;
  size?: string;
  geometry?: "circle" | "square" | "line";
}) {
  return (
    <figure className={`group relative ${size}`}>
      <div className="relative">
        {geometry === "circle" && (
          <div
            aria-hidden
            className="absolute -right-5 -top-5 size-2/3 rounded-full bg-primary/10 transition-transform duration-300 group-hover:translate-x-1"
          />
        )}
        {geometry === "square" && (
          <div
            aria-hidden
            className="absolute -bottom-4 -left-4 size-3/4 rounded-card border border-border bg-surface-strong transition-transform duration-300 group-hover:-translate-x-1"
          />
        )}
        {geometry === "line" && (
          <div aria-hidden className="absolute -left-6 top-6 h-px w-16 bg-primary" />
        )}
        <div
          className={`relative overflow-hidden border border-border bg-muted transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/50 ${shapeClass[m.shape]}`}
        >
          <img
            src={m.image}
            alt={`Portrait of ${m.name}, ${m.role}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            style={{ objectPosition: m.focalPoint }}
          />
        </div>
      </div>
      <figcaption className={`mt-4 ${m.shape === "circle" ? "text-center" : ""}`}>
        <p className="font-semibold">{m.name}</p>
        <p className="text-sm leading-5 text-muted-foreground">{m.role}</p>
      </figcaption>
    </figure>
  );
}

export function TeamComposition() {
  const [a, b, c, d, e, f, g, h, i] = teamMembers as [
    TeamMember,
    TeamMember,
    TeamMember,
    TeamMember,
    TeamMember,
    TeamMember,
    TeamMember,
    TeamMember,
    TeamMember,
  ];
  return (
    <section aria-labelledby="team-heading" className="overflow-hidden bg-secondary py-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow>People at Xyncwave</Eyebrow>
          <h2 id="team-heading" className="editorial-title">
            Different disciplines. One delivery mindset.
          </h2>
          <p className="type-lead mt-5 text-muted-foreground">
            Xyncwave brings together people working across transformation, applications, cloud, data
            and growth. The team is deliberately multidisciplinary because the business problems we
            work on rarely stay inside one technical function.
          </p>
        </div>
        {/* Desktop / tablet: three offset columns (controlled asymmetry) */}
        <div className="mt-16 hidden gap-10 md:grid md:grid-cols-3 lg:gap-14">
          <div className="flex flex-col gap-16">
            <Portrait m={a} geometry="square" />
            <Portrait m={d} size="w-10/12 self-end" />
            <Portrait m={g} size="w-9/12" geometry="circle" />
          </div>
          <div className="flex flex-col items-center gap-16 pt-24">
            <Portrait m={b} size="w-9/12" geometry="circle" />
            <Portrait m={e} size="w-7/12" />
            <Portrait m={h} size="w-11/12" geometry="line" />
          </div>
          <div className="flex flex-col gap-16 pt-10">
            <Portrait m={c} size="w-11/12 self-end" geometry="line" />
            <Portrait m={f} size="w-10/12" geometry="square" />
            <Portrait m={i} size="w-full" />
          </div>
        </div>
        {/* Mobile: two staggered columns */}
        <div className="mt-12 grid grid-cols-2 gap-x-5 md:hidden">
          <div className="flex flex-col gap-10">
            {[a, d, e, g, i].map((m) => (
              <Portrait key={m.name} m={m} />
            ))}
          </div>
          <div className="flex flex-col gap-10 pt-12">
            {[b, c, f, h].map((m) => (
              <Portrait key={m.name} m={m} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CompanyNews() {
  const [lead, ...rest] = companyNews;
  if (!lead) return null;
  return (
    <section aria-labelledby="news-heading" className="py-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow>Company news</Eyebrow>
          <h2 id="news-heading" className="editorial-title">
            What's moving at Xyncwave.
          </h2>
          <p className="type-lead mt-5 text-muted-foreground">
            Company updates, new capabilities, delivery stories and the work shaping what comes
            next.
          </p>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
          <article className="group min-w-0">
            <div className="digital-visual aspect-[16/10] overflow-hidden rounded-card bg-muted">
              <img src={lead.image} alt="" loading="lazy" className="size-full object-cover" />
            </div>
            <p className="mt-6 text-xs font-medium text-muted-foreground">
              {lead.date} · <span className="text-primary">{lead.category}</span>
            </p>
            <h3 className="mt-3 text-2xl font-medium sm:text-3xl">{lead.title}</h3>
            <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{lead.excerpt}</p>
            {lead.href && (
              <SmartLink
                to={lead.href as AppPath}
                className="link-sweep mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                Read more
                <ArrowRight className="arrow-nudge size-4" />
              </SmartLink>
            )}
          </article>
          <div className="flex min-w-0 flex-col divide-y divide-border border-t border-border lg:border-t-0">
            {rest.map((n) => (
              <article
                key={n.title}
                className="group grid grid-cols-[1fr_7rem] gap-5 py-7 first:pt-7 lg:first:pt-0"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    {n.date} · <span className="text-primary">{n.category}</span>
                  </p>
                  <h3 className="mt-2 text-lg font-medium leading-snug">{n.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{n.excerpt}</p>
                  {n.href && (
                    <SmartLink
                      to={n.href as AppPath}
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      Read more
                      <ArrowRight className="size-4" />
                    </SmartLink>
                  )}
                </div>
                <div className="digital-visual aspect-square overflow-hidden rounded-card bg-muted">
                  <img src={n.image} alt="" loading="lazy" className="size-full object-cover" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const deliveryPillars = [
  {
    icon: Compass,
    title: "Context before code",
    body: "Every request arrives with a history — grown workarounds, platforms carrying important rules, roadmaps competing for capacity. We map that operating context before choosing any technology.",
  },
  {
    icon: GitBranch,
    title: "Built to be maintained",
    body: "Useful software outlives the demonstration. Coherent architecture, testable behavior, controlled releases and a clear path for future change — engineering as a long-term responsibility.",
  },
  {
    icon: Shapes,
    title: "Engagements that fit the work",
    body: "A focused discovery, a workflow application, a product team or a delivery partnership — the model follows the uncertainty of the work, never the reverse.",
  },
  {
    icon: Globe2,
    title: "Global by design",
    body: "Distributed delivery works when communication windows, decision owners, tools and escalation are designed deliberately. Geography never removes the need for visible accountability.",
  },
  {
    icon: ShieldCheck,
    title: "Proof you can inspect",
    body: "We separate verified delivery facts from aspiration. What cannot be supported by evidence is not published — credibility should remain inspectable.",
  },
];

export function DeliveryPrinciples() {
  return (
    <section aria-labelledby="principles-heading" className="border-t border-border py-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow>How Xyncwave works</Eyebrow>
          <h2 id="principles-heading" className="editorial-title">
            Five commitments behind every engagement.
          </h2>
        </div>
        <ol className="mt-14 grid gap-px overflow-hidden rounded-card border border-border bg-border md:grid-cols-2 lg:grid-cols-5">
          {deliveryPillars.map((p, i) => (
            <li
              key={p.title}
              className="group flex flex-col bg-background p-7 transition-colors duration-200 hover:bg-secondary"
            >
              <div className="flex items-center justify-between">
                <span aria-hidden className="grid size-10 place-items-center rounded-md bg-muted">
                  <p.icon className="size-5 text-primary" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">0{i + 1}</span>
              </div>
              <h3 className="mt-7 text-lg font-medium leading-snug transition-colors duration-200 group-hover:text-primary">
                {p.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const careerPoints = [
  "Own outcomes, not tickets — you carry real responsibility from discovery to production",
  "Work across disciplines — transformation, applications, cloud, data and growth in one delivery mindset",
  "Learn in the open — shared architecture reviews, honest post-mortems, documentation that outlives the sprint",
];

export function CareersSection() {
  return (
    <section aria-labelledby="careers-heading" className="overflow-hidden bg-secondary py-section">
      <div className="mx-auto grid max-w-7xl items-end gap-12 px-5 lg:grid-cols-[1.55fr_1fr] lg:gap-16 lg:px-8">
        <div className="max-w-3xl">
          <Eyebrow>Careers at Xyncwave</Eyebrow>
          <h2 id="careers-heading" className="editorial-title">
            Do work you'll still be proud of in five years.
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground sm:text-lg">
            We are a deliberately multidisciplinary team solving business problems that rarely stay
            inside one technical function. If you like your work measured by what changes for the
            client — not hours logged — you will fit here.
          </p>
          <ul className="mt-8 space-y-3.5">
            {careerPoints.map((pt) => (
              <li key={pt} className="flex items-start gap-3 text-sm font-medium leading-6">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                {pt}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full min-w-0 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <Button
            size="lg"
            className="h-auto w-full whitespace-normal py-3 text-center sm:w-auto"
            asChild
          >
            <a
              href="mailto:aasiya@xyncwave.ceo?subject=Careers%20at%20Xyncwave"
              onClick={() => track("cta_click", { label: "Want to Join Us", placement: "careers" })}
            >
              Want to Join Us
              <ArrowRight />
            </a>
          </Button>
          <p className="mt-4 max-w-xs text-xs leading-5 text-muted-foreground">
            Tell us the problems you want to work on. We read every message and reply to every
            serious one.
          </p>
        </div>
      </div>
    </section>
  );
}
