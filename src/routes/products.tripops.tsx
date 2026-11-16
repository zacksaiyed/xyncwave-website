import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { Button } from "../components/ui/button";
import { Breadcrumbs, CTASection, Eyebrow, FAQSection, SectionIntro } from "../components/page-sections";
import { ContinueExploring } from "../components/continue-exploring";
import { track } from "../lib/analytics";
import { pageHead } from "../lib/seo";
import { SITE_ORIGIN as SITE } from "../lib/site-origin";

const APP_URL = "https://tripops.xyncwave.com/sign-in";
const desc = "TripOps is a Xyncwave product for logistics and fleet teams to keep trip records, trip expenses, budgets and reconciliation in one workflow.";

export const Route = createFileRoute("/products/tripops")({
  head: () => {
    const base = pageHead("TripOps — trip, expense and budget operations", desc, "/products/tripops", "product");
    return { ...base, scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "TripOps", applicationCategory: "BusinessApplication", operatingSystem: "Web", url: `${SITE}/products/tripops`, description: desc, publisher: { "@type": "Organization", name: "Xyncwave Corporation LLP" } }) },
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE}/products` },
        { "@type": "ListItem", position: 3, name: "TripOps", item: `${SITE}/products/tripops` },
      ] }) },
    ] };
  },
  component: TripOpsPage,
});

const challenges = [
  ["Trip records live in too many places", "Trip details, driver notes and approvals sit across spreadsheets, messages and paper, so nobody has one reliable record of a trip."],
  ["Expenses arrive after the fact", "Fuel, tolls, allowances and other trip costs are collected late and matched by hand, which slows closing and hides overspend until it has happened."],
  ["Budgets are hard to see in time", "Without trip-level cost information, operations and finance only see budget pressure once the month is over."],
  ["Reconciliation takes too much effort", "Matching advances, receipts and actual spend against each trip becomes a recurring manual exercise."],
];

const workflow = [
  ["Plan the trip", "Record the trip and its key details in one place."],
  ["Capture expenses", "Attach trip-related costs to the trip they belong to."],
  ["Track the budget", "See planned against actual cost while the trip is active."],
  ["Reconcile", "Close the trip with expenses and advances matched."],
];

const capabilities = [
  ["Trip management", "A single record for each trip, so operations teams work from the same information."],
  ["Trip expenses", "Costs captured against the trip, rather than collected separately afterwards."],
  ["Budget visibility", "Trip and period-level views of planned and actual cost."],
  ["Reconciliation workflow", "A structured way to close trips and account for advances and spend."],
];

const audience = [
  ["Operations and dispatch managers", "who need one view of active and completed trips."],
  ["Fleet and transport coordinators", "who handle the day-to-day detail of each trip."],
  ["Finance and accounts teams", "who reconcile trip spend and need costs earlier."],
  ["Business owners", "who want budget visibility without chasing reports."],
];

function AccessButton({ position, variant }: { position: string; variant?: "outline" }) {
  return <Button size="lg" variant={variant} asChild><a href={APP_URL} target="_blank" rel="noopener noreferrer" onClick={() => track("outbound_click", { destination: "tripops_sign_in", cta_position: position })}>Sign In to TripOps <ArrowUpRight /></a></Button>;
}

function TripOpsPage() {
  return <>
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products", to: "/products" }, { label: "TripOps" }]} />
    <section className="bg-surface-hero"><div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 lg:px-8"><div className="max-w-4xl">
      <Eyebrow>Xyncwave product · Logistics & fleet operations</Eyebrow>
      <h1 className="hero-title">TripOps: trip, expense and budget operations in one workflow.</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">TripOps is built for logistics, fleet and transport teams that need trip records, trip-related expenses, budget visibility and reconciliation to sit together instead of across spreadsheets and messages.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row"><AccessButton position="hero" /><Button size="lg" variant="outline" asChild><SmartLink to="/start-a-conversation" search={{ interest: "tripops" }}>Discuss TripOps <ArrowRight /></SmartLink></Button></div>
      <p className="mt-4 text-xs text-muted-foreground">The sign-in page is for existing TripOps users.</p>
    </div></div></section>

    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="Operational challenges" title="Where trip operations usually break down" body="The problems TripOps is designed around are familiar to most teams running trips at volume." />
      <div className="mt-12 grid border-t border-border md:grid-cols-2">{challenges.map(([t, b], i) => <div key={t} className="border-b border-border py-8 md:px-8 md:odd:border-r md:odd:pl-0"><span className="text-xs font-medium text-primary">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-5 text-xl font-medium">{t}</h3><p className="mt-3 leading-7 text-muted-foreground">{b}</p></div>)}</div>
    </div></section>

    <section className="bg-secondary py-section"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><SectionIntro eyebrow="Product overview" title="One place for the life of a trip" /><div className="space-y-5 text-lg leading-8 text-muted-foreground"><p>TripOps brings the operational and financial sides of a trip together. The trip, the costs attached to it, the budget it draws on and the final reconciliation are handled as one connected record.</p><p>The aim is simple: fewer handoffs between operations and finance, earlier sight of cost, and less manual matching at the end of each period.</p></div></div></section>

    <section className="bg-surface-inverse py-section text-primary-foreground"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="How it fits the workflow" title="From trip to reconciled cost" />
      <div className="mt-12 grid gap-px bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-4">{workflow.map(([t, b], i) => <div key={t} className="bg-surface-inverse p-7"><span className="text-xs text-primary">{String(i + 1).padStart(2, "0")}</span><p className="mt-4 text-lg font-medium">{t}</p><p className="mt-2 text-sm leading-6 text-primary-foreground/65">{b}</p></div>)}</div>
    </div></section>

    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="Capabilities" title="What TripOps covers" />
      <div className="mt-12 grid gap-6 md:grid-cols-2">{capabilities.map(([t, b], i) => <div key={t} className="hover-card border border-border p-8"><span className="text-xs text-primary">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-6 text-2xl font-medium">{t}</h3><p className="mt-4 leading-7 text-muted-foreground">{b}</p></div>)}</div>
    </div></section>

    <section className="bg-secondary py-section"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><SectionIntro eyebrow="Who it is for" title="Teams that share responsibility for a trip" body="TripOps is designed for the people who plan trips, run them and account for them." />
      <ul className="border-t border-border">{audience.map(([t, b]) => <li key={t} className="border-b border-border py-5"><strong className="font-medium">{t}</strong> <span className="text-muted-foreground">{b}</span></li>)}</ul>
    </div></section>

    <section className="py-section"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8"><SectionIntro eyebrow="Integration and architecture" title="Connecting TripOps to the rest of the operation" /><p className="text-lg leading-8 text-muted-foreground">If TripOps needs to work alongside an ERP, accounting system or fleet tooling, we can discuss the integration requirement with you. Integration work is scoped per organisation through our <SmartLink to="/solutions/integration" className="font-medium text-primary underline-offset-4 hover:underline">API & System Integration</SmartLink> and <SmartLink to="/solutions/erp-business-systems" className="font-medium text-primary underline-offset-4 hover:underline">ERP / Business Systems</SmartLink> practices.</p></div></section>

    <ContinueExploring title="Related logistics thinking" items={[
      { to: "/industries/logistics", type: "Industry", title: "Logistics & Supply Chain", body: "How Xyncwave approaches dispatch, warehouse, fleet and delivery workflows." },
      { to: "/case-studies/track-trace", type: "Case study", title: "See the Connected Logistics case study", body: "Field work, stock traceability and job status brought into one platform." },
      { to: "/insights/logistics-digital-transformation-africa", type: "Insight", title: "Logistics digital transformation: where to start", body: "A starting framework for operators whose trips, billing and reporting no longer move together." },
    ]} />
    <FAQSection eyebrow="Product questions" title="TripOps questions" items={[
      ["Who is TripOps for?", "Logistics, fleet and transport teams that manage trips and the costs attached to them, together with the finance teams that reconcile that spend."],
      ["How do I access TripOps?", "Existing users sign in at tripops.xyncwave.com. If you are not yet using TripOps, start a conversation with us and we will walk through whether it fits your workflow."],
      ["Can TripOps connect to our other systems?", "Integration needs vary by organisation. Share your current systems with us and we will discuss what is required."],
    ]} />
    <section className="border-t border-border py-12"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 sm:flex-row sm:items-center lg:px-8"><p className="text-xl font-medium">Already using TripOps?</p><AccessButton position="footer" variant="outline" /></div></section>
    <CTASection title="Is trip cost visibility slowing your operation down?" body="Tell us how trips, expenses and budgets are handled today, and we can discuss whether TripOps fits." cta="Discuss TripOps" />
  </>;
}
