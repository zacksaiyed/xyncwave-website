import { getInsightMedia, caseStudyMedia, type MediaEntry } from "../lib/media-registry";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Cpu, Layers, Network, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { SmartLink } from "../components/app-link";
import { Button } from "../components/ui/button";
import { CTASection, Eyebrow, SectionIntro } from "../components/page-sections";
import { DigitalVisual, SystemMap } from "../components/digital-visuals";
import { articles } from "../lib/content";
import { pageHead } from "../lib/seo";
import { jsonLdScript, siteIdentityGraph } from "../lib/structured-data";
import fintechInsightImage from "../assets/media/home-fintech-insight-hd.webp";
import fintechInsightImageSmall from "../assets/media/home-fintech-insight-hd-800.webp";
import digitalizationInsightImage from "../assets/media/home-digitalization-insight-hd.webp";
import digitalizationInsightImageSmall from "../assets/media/home-digitalization-insight-hd-800.webp";

const heroMotionVideoHd = "/xwc-hero-motion-1920.mp4";
const heroMotionVideoMobile = "/xwc-hero-motion-1280.mp4";
const heroMotionPoster = "/xwc-hero-motion-poster.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead(
      "Digital transformation for complex operations",
      "Xyncwave turns fragmented operations, delivery constraints, AI uncertainty, and legacy technology into practical connected systems.",
      "/",
    ),
    scripts: [jsonLdScript(siteIdentityGraph())],
  }),
  component: HomePage,
});

const problems = [
  {
    title: "Fragmented operations",
    body: "Too many spreadsheets. Too many systems. Too many manual handoffs.",
    action: "Explore Digitalization",
    to: "/solutions/digital-transformation",
  },
  {
    title: "Legacy technology",
    body: "The system still works—but every change costs more than it should.",
    action: "Discuss Modernization",
    to: "/solutions/application-modernization",
  },
  {
    title: "Engineering constraints",
    body: "Demand is growing faster than the team can deliver.",
    action: "Discuss Engineering Capacity",
    to: "/solutions/engineering-capacity",
  },
  {
    title: "AI uncertainty",
    body: "Everyone is talking about AI. You need to know where it actually creates value.",
    action: "Find Your AI Opportunity",
    to: "/ai-opportunity-assessment",
  },
] as const;

const problemIcons = [Network, Layers, Users, Cpu] as const;

const choices = [
  ["Our operations are too manual", "Start with the workflow", "/digitalization-assessment"],
  ["Our systems do not connect", "Map the integration gaps", "/solutions/integration"],
  [
    "Our technology is difficult to maintain",
    "Explore modernization options",
    "/solutions/application-modernization",
  ],
  [
    "We need more engineering capacity",
    "Clarify the delivery model",
    "/engineering-capacity-assessment",
  ],
  [
    "We want to use AI but do not know where",
    "Find a practical opportunity",
    "/ai-opportunity-assessment",
  ],
  [
    "We need to modernize our platform",
    "Identify what should change",
    "/solutions/cloud-platform-engineering",
  ],
  ["We need a technology partner", "Talk through the requirement", "/technology-partnership"],
] as const;

const featuredInsights = articles.filter(
  (article) =>
    article.slug === "fintech-what-to-outsource" ||
    article.slug === "business-case-process-digitalization",
);

const featuredInsightMedia: Record<string, MediaEntry> = {
  "fintech-what-to-outsource": {
    src: fintechInsightImage,
    srcSet: `${fintechInsightImageSmall} 800w, ${fintechInsightImage} 1600w`,
    alt: "An in-house platform core linked to modular engineering capabilities through controlled digital connections.",
    position: "center center",
  },
  "business-case-process-digitalization": {
    src: digitalizationInsightImage,
    srcSet: `${digitalizationInsightImageSmall} 800w, ${digitalizationInsightImage} 1600w`,
    alt: "Separate business workflows joining into one connected process through an electric-blue digital pathway.",
    position: "center center",
  },
};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return prefersReducedMotion;
}

function HeroMotionVisual() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="home-motion-visual">
      <p className="home-motion-tagline">
        LET'S CONNECT. <strong>DIGITALLY.</strong>
      </p>
      {prefersReducedMotion ? (
        <img
          className="home-motion-media"
          src={heroMotionPoster}
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      ) : (
        <video
          className="home-motion-media"
          aria-hidden="true"
          tabIndex={-1}
          width="1920"
          height="1080"
          poster={heroMotionPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
        >
          <source media="(min-width: 768px)" src={heroMotionVideoHd} type="video/mp4" />
          <source src={heroMotionVideoMobile} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="home-hero relative overflow-hidden">
        <HeroMotionVisual />
        <div className="home-hero-grid relative mx-auto grid max-w-7xl items-center px-5 lg:px-8">
          <div className="home-hero-copy min-w-0">
            <Eyebrow>Digital transformation · Modern engineering</Eyebrow>
            <h1 className="hero-title home-hero-title max-w-4xl">
              What technology challenge is holding{" "}
              <span className="text-primary">your business</span> back?
            </h1>
            <p className="home-hero-description mt-7 text-lg leading-8 text-muted-foreground">
              From fragmented operations to overloaded engineering teams, XWC helps organizations
              turn technology challenges into practical digital systems that move the business
              forward.
            </p>
            <div className="home-hero-actions mt-8 flex flex-col items-start gap-3">
              <Button
                size="lg"
                className="h-auto min-h-13 whitespace-normal py-3 text-center"
                asChild
              >
                <SmartLink to="/start-a-conversation">
                  Tell Us What You're Trying to Solve <ArrowRight />
                </SmartLink>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="hero-secondary-action h-auto min-h-13 whitespace-normal py-3 text-left"
                asChild
              >
                <a href="#challenges">
                  Explore the Challenges We Solve <ArrowRight />
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No sales pitch. Start with the problem.
            </p>
          </div>
        </div>
      </section>

      <section id="challenges" className="home-challenges py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Problem recognition"
            title="The technology problem usually isn't the technology."
            body="It is the disconnected process, the legacy system, the delivery bottleneck, or the uncertainty about what to change next."
          />
          <div className="home-problem-grid mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {problems.map((p, i) => {
              const Icon = problemIcons[i] ?? Network;
              return (
                <SmartLink
                  key={p.title}
                  to={p.to}
                  className="home-problem-card group flex min-w-0 flex-col rounded-card border border-border bg-background p-6 transition-colors duration-200 sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="capability-icon" aria-hidden="true">
                      <Icon className="size-5" strokeWidth={1.6} />
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">0{i + 1}</span>
                  </div>
                  <h3 className="type-card-title mt-6 transition-colors duration-200 group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                    {p.body}
                  </p>
                  <span className="problem-card-action mt-auto inline-flex items-start gap-2 pt-8 text-sm font-medium text-primary">
                    {p.action}
                    <ArrowRight className="arrow-nudge mt-0.5 size-4 shrink-0" />
                  </span>
                </SmartLink>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-choice-section bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <SectionIntro
              eyebrow="Start where you are"
              title="What are you trying to solve?"
              body="You do not need to know exactly what technology you need. Start by telling us where the problem is."
            />
            <div className="home-choice-list border-t border-border">
              {choices.map(([title, outcome, to], i) => (
                <SmartLink
                  key={title}
                  to={to}
                  className="hover-row group relative grid gap-3 overflow-hidden border-b border-border py-6 transition-colors duration-300 hover:text-primary sm:grid-cols-[2.5rem_1fr_auto] sm:items-center"
                >
                  <span className="text-xs font-bold text-primary">0{i + 1}</span>
                  <span>
                    <strong className="block text-lg">{title}</strong>
                    <span className="mt-1 block text-sm text-muted-foreground">{outcome}</span>
                  </span>
                  <ArrowRight className="arrow-nudge size-5 text-primary" />
                </SmartLink>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-story-section py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[.72fr_1.28fr] lg:items-center lg:gap-20">
            <div className="home-story-copy">
              <Eyebrow>Transformation story</Eyebrow>
              <h2 className="editorial-title">From complexity to clarity.</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
                Understand the operation. Architect the right intervention. Engineer and connect
                what matters. Create a system the business can keep moving with.
              </p>
              <p className="mt-6 max-w-xl leading-7 text-muted-foreground">
                That may mean connecting existing systems, replacing one fragile workflow,
                modernizing a constrained application, or adding the engineering capacity to move a
                defined roadmap. The scope follows the operating problem—not a predetermined
                technology sale.
              </p>
            </div>
            <SystemMap />
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Transformation experience"
            title="Real operating detail. Practical connected technology."
          />
          <div className="mt-12 grid overflow-hidden rounded-card border border-border bg-background lg:grid-cols-[1.1fr_.9fr]">
            <DigitalVisual
              media={caseStudyMedia["track-trace"]}
              className="home-case-visual min-h-[280px] rounded-none border-0 lg:min-h-[460px]"
            />
            <div className="flex flex-col justify-between p-8 sm:p-12">
              <div>
                <p className="type-eyebrow text-primary">Case study · Logistics operations</p>
                <h3 className="editorial-title mt-6">
                  From fragmented field work to one connected operational platform.
                </h3>
                <p className="mt-6 leading-8 text-muted-foreground">
                  ERPNext/Frappe web workflows, a Flutter technician application, stock
                  traceability, job status, communication, evidence, and an AWS serverless
                  application layer.
                </p>
              </div>
              <div className="mt-12">
                <Button asChild>
                  <SmartLink to="/case-studies/track-trace">
                    See How the System Works <ArrowRight />
                  </SmartLink>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-insights-section bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Technology intelligence"
            title="Useful thinking for active decisions."
          />
          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            {featuredInsights.map((a) => (
              <SmartLink
                key={a.slug}
                to={`/insights/${a.slug}`}
                className="home-insight-card group block overflow-hidden rounded-card border border-border bg-background"
              >
                <DigitalVisual
                  media={featuredInsightMedia[a.slug] ?? getInsightMedia(a.slug, a.category)}
                  className="aspect-[16/9]"
                />
                <div className="p-7 sm:p-9">
                  <p className="type-eyebrow text-primary">
                    {a.category} · {a.read}
                  </p>
                  <h3 className="type-card-title mt-5">{a.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">{a.excerpt}</p>
                  <span className="link-sweep mt-7 inline-flex items-center gap-2 font-semibold text-primary">
                    Read the Insight <ArrowRight className="arrow-nudge size-4" />
                  </span>
                </div>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>
      <CTASection />
    </>
  );
}
