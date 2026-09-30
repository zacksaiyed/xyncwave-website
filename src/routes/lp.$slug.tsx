import { SmartLink } from "../components/app-link";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import { LeadForm } from "../components/lead-form";
import { campaigns } from "../lib/campaigns";
import { noindexHead, pageHead } from "../lib/seo";
export const Route = createFileRoute("/lp/$slug")({
  loader: ({ params }) => {
    const c = campaigns[params.slug];
    if (!c) throw notFound();
    return c;
  },
  head: ({ loaderData, params }) =>
    loaderData
      ? pageHead(loaderData.title, loaderData.description, `/lp/${params.slug}`)
      : noindexHead("Campaign unavailable", "This campaign page is not available."),
  component: Page,
});
function Page() {
  const c = Route.useLoaderData();
  return (
    <div className="bg-secondary">
      <section className="bg-surface-hero py-section">
        <div className="mx-auto max-w-6xl px-5">
          <p className="type-eyebrow text-primary">{c.audience}</p>
          <h1 className="hero-title mt-5 max-w-4xl">{c.title}</h1>
          <p className="type-lead mt-6 text-muted-foreground">{c.description}</p>
          <Button size="lg" className="mt-8" asChild>
            <a href="#conversation">
              Share What Is Getting in the Way
              <ArrowRight />
            </a>
          </Button>
        </div>
      </section>
      <section className="py-section">
        <div className="mx-auto grid max-w-6xl gap-14 px-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="type-eyebrow text-primary">Focused next step</p>
            <h2 className="editorial-title mt-5">
              Move from recognition to a useful conversation.
            </h2>
            <ul className="mt-8 space-y-4">
              {c.points.map((x) => (
                <li className="flex gap-3 font-medium" key={x}>
                  <Check className="size-5 text-primary" />
                  {x}
                </li>
              ))}
            </ul>
            <SmartLink
              to="/privacy"
              className="mt-10 inline-block text-sm text-muted-foreground underline"
            >
              Privacy
            </SmartLink>
          </div>
          <div
            id="conversation"
            className="rounded-card border border-border bg-background p-6 sm:p-10"
          >
            <LeadForm initialType={c.type} />
          </div>
        </div>
      </section>
    </div>
  );
}
