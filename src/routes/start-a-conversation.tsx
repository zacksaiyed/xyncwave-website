import { createFileRoute } from "@tanstack/react-router";
import { LeadForm } from "../components/lead-form";
import { Eyebrow } from "../components/page-sections";
import { pageHead } from "../lib/seo";
export const Route = createFileRoute("/start-a-conversation")({
  head: () =>
    pageHead(
      "Start a conversation",
      "Tell Xyncwave what is not working and begin a relevant technology conversation.",
      "/start-a-conversation",
    ),
  component: Page,
});
function Page() {
  return (
    <section className="bg-surface-hero py-section">
      <div className="mx-auto grid max-w-7xl gap-16 px-5 lg:grid-cols-[0.75fr_1.25fr] lg:px-8">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>Start a conversation</Eyebrow>
          <h1 className="hero-title">Let's start with the problem.</h1>
          <p className="type-lead mt-7 text-muted-foreground">
            Give us the context. You do not need to have the solution figured out yet.
          </p>
          <div className="mt-12 border-l-2 border-primary pl-6">
            <p className="font-medium">Bring the situation.</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              We will review what is happening and help frame the most useful next step.
            </p>
          </div>
        </div>
        <div className="rounded-card border border-border bg-background p-6 sm:p-10 lg:p-12">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
