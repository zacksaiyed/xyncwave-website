import { SmartLink } from "../components/app-link";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { pageHead } from "../lib/seo";
import type { AppPath } from "../components/page-sections";
import { useEffect, useState } from "react";
import { getIndustryConversion } from "../lib/industry-conversion";
import { track } from "../lib/analytics";

type Journey = {
  title: string;
  body: string;
  next: string;
  nextTo: AppPath;
  secondary: string;
  secondaryTo: AppPath;
};
const generalJourney: Journey = {
  title: "Your challenge is with the team.",
  body: "We will review the context you shared and determine the most useful next step before responding.",
  next: "See How Xyncwave Thinks",
  nextTo: "/why-xyncwave",
  secondary: "Read our insights",
  secondaryTo: "/insights",
};
const journeys: Record<string, Journey> = {
  digitalization: {
    title: "Your digitalization context is on its way.",
    body: "We will review the operating problem and the systems or manual processes you shared before responding.",
    next: "Explore the track-and-trace case",
    nextTo: "/case-studies/track-trace",
    secondary: "Read the digitalization guide",
    secondaryTo: "/insights/digital-transformation-fragmented-systems",
  },
  engineering: {
    title: "Your capacity requirement is on its way.",
    body: "We will review the capability, duration, delivery model, and overlap you shared before responding.",
    next: "See the engineering delivery model",
    nextTo: "/case-studies/engineering-capacity",
    secondary: "Compare capacity models",
    secondaryTo: "/insights/staff-augmentation-vs-dedicated-team-vs-outsourcing",
  },
  ai: {
    title: "Your AI opportunity context is on its way.",
    body: "We will review the process, available information, and intended outcome before responding.",
    next: "Read the AI opportunity guide",
    nextTo: "/insights/ai-workflow-automation",
    secondary: "Review the POC approach",
    secondaryTo: "/solutions/ai-automation",
  },
  partnership: {
    title: "Your partnership context is on its way.",
    body: "We will review the priorities and timing you shared before responding.",
    next: "Why Xyncwave",
    nextTo: "/why-xyncwave",
    secondary: "Explore our solutions",
    secondaryTo: "/solutions",
  },
  general: generalJourney,
};
export const Route = createFileRoute("/thank-you/$type")({
  loader: ({ params }) => journeys[params.type] ?? generalJourney,
  head: () => ({
    ...pageHead("Thank you", "Your message has been sent to Xyncwave.", "/thank-you"),
    meta: [
      { title: "Thank you | Xyncwave" },
      { name: "description", content: "Your message has been sent to Xyncwave." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Thank you | Xyncwave" },
      { property: "og:description", content: "Your message has been sent to Xyncwave." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const { type } = Route.useParams();
  const fallback = Route.useLoaderData();
  const industryJourney = getIndustryConversion(type)?.thankYou;
  const [insight, setInsight] = useState<{
    type: string;
    slug: string;
    title: string;
    related?: { label: string; to: AppPath };
  } | null>(null);
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("xw_insight_thanks");
      sessionStorage.removeItem("xw_insight_thanks");
      if (stored) {
        const context = JSON.parse(stored);
        if (
          context.type === type &&
          typeof context.slug === "string" &&
          typeof context.title === "string"
        )
          setInsight(context);
      }
    } catch {
      /* Use the standard journey. */
    }
    track("thank_you_view", {
      industry: industryJourney ? type : undefined,
      lead_type: industryJourney ? undefined : type,
    });
  }, [industryJourney, type]);
  const j: Journey =
    industryJourney ??
    (insight
      ? {
          ...fallback,
          title: "Your assessment is with the team.",
          body: `We will review your answers to ${insight.title} and respond with a useful next step.`,
          next: insight.related?.label ?? "Read another insight",
          nextTo: insight.related?.to ?? "/insights",
          secondary: "Explore more insights",
          secondaryTo: "/insights",
        }
      : fallback);
  return (
    <section className="bg-surface-hero py-24">
      <div className="mx-auto max-w-3xl px-5">
        <CheckCircle2 className="size-12 text-primary" />
        <p className="type-eyebrow mt-8 text-primary">Conversation started</p>
        <h1 className="hero-title mt-5">{j.title}</h1>
        <p className="type-lead mt-6 text-muted-foreground">{j.body}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <SmartLink to={j.nextTo}>
              {j.next}
              <ArrowRight />
            </SmartLink>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <SmartLink to={j.secondaryTo}>{j.secondary}</SmartLink>
          </Button>
        </div>
      </div>
    </section>
  );
}
