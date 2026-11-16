import { ArrowRight } from "lucide-react";
import { SmartLink, type AppPath } from "./app-link";
import { SectionIntro } from "./page-sections";

type L = { label: string; to: AppPath };
const S = (slug: string) => `/solutions/${slug}`;
const I = (slug: string) => `/industries/${slug}`;
const sol = {
  dt: { label: "Digital Transformation", to: S("digital-transformation") },
  int: { label: "API & System Integration", to: S("integration") },
  mod: { label: "Application Modernization", to: S("application-modernization") },
  data: { label: "Data Engineering & Analytics", to: S("data-engineering") },
  cap: { label: "Engineering Capacity", to: S("engineering-capacity") },
  ai: { label: "AI & Intelligent Automation", to: S("ai-automation") },
  erp: { label: "ERP / Business Systems", to: S("erp-business-systems") },
  cloud: { label: "Cloud & Platform Engineering", to: S("cloud-platform-engineering") },
  sw: { label: "Software Engineering", to: S("software-engineering") },
} satisfies Record<string, L>;

function Links({ items, dark }: { items: L[]; dark?: boolean }) {
  return <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">{items.map(l => <SmartLink key={l.to} to={l.to} className={`link-sweep group inline-flex items-center gap-1.5 text-sm font-medium ${dark ? "text-primary" : "text-primary"}`}>{l.label}<ArrowRight className="arrow-nudge size-3.5" /></SmartLink>)}</div>;
}

function RouteCards({ items }: { items: { title: string; body?: string; links: L[] }[] }) {
  return <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{items.map((x, i) => <div key={x.title} className="hover-card flex flex-col border border-border bg-background p-7 transition-colors duration-300 hover:bg-muted"><span className="text-xs font-medium text-primary">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-4 text-xl font-medium">{x.title}</h3>{x.body && <p className="mt-3 text-sm leading-6 text-muted-foreground">{x.body}</p>}<div className="mt-auto"><Links items={x.links} /></div></div>)}</div>;
}

export function SolutionsHubSections() {
  return <>
    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="Buyer situations" title="Start with the constraint" body="Most technology decisions begin with an operational, system or delivery constraint — not with a technology category." />
      <RouteCards items={[
        { title: "Manual workflows are becoming difficult to scale", body: "Approvals, handoffs, spreadsheets, email or messaging are carrying processes that now need structure and visibility.", links: [sol.dt] },
        { title: "Systems hold the right information but do not work together", body: "Teams re-enter information, reconcile manually or move between disconnected platforms.", links: [sol.int] },
        { title: "An important application has become difficult to change", body: "Legacy architecture, technical debt or platform constraints are slowing operational or product change.", links: [sol.mod] },
        { title: "Reporting depends on manual consolidation", body: "Management information depends on spreadsheets, repeated extraction or inconsistent source data.", links: [sol.data] },
        { title: "Engineering demand is moving faster than internal capacity", body: "Roadmaps, client commitments or specialist needs exceed available engineering bandwidth.", links: [sol.cap] },
        { title: "AI opportunities exist, but the path to production is unclear", body: "Determine where AI is appropriate, what systems and data are required, and where human oversight remains necessary.", links: [sol.ai] },
      ]} />
    </div></section>
    <section className="bg-surface-inverse py-section text-primary-foreground"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="A connected sequence" title="How the solutions connect" />
      <p className="mt-5 max-w-2xl text-base leading-8 text-primary-foreground/70 sm:text-lg">A business problem often crosses several systems. We start with the process, then apply the technology required to make the operating model work.</p>
      <div className="mt-12 grid gap-px bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-5">{[
        { t: "Digitalize the workflow", b: "Map the process, remove unnecessary manual handoffs and create a structured operational flow.", l: [sol.dt] },
        { t: "Connect the systems around it", b: "Create dependable information movement between applications, platforms and external services.", l: [sol.int] },
        { t: "Establish the right business-system boundary", b: "Decide what belongs in ERP, what should remain specialised and where custom software is justified.", l: [sol.erp] },
        { t: "Create dependable management information", b: "Build trusted pipelines, reporting structures and operational visibility.", l: [sol.data] },
        { t: "Modernize the application or platform where required", b: "Improve architecture, cloud foundations and maintainability where legacy constraints limit change.", l: [sol.mod, sol.cloud] },
      ].map((s, i) => <div key={s.t} className="flex flex-col bg-surface-inverse p-7"><span className="text-xs text-primary">{String(i + 1).padStart(2, "0")}</span><h3 className="mt-4 font-medium">{s.t}</h3><p className="mt-3 text-sm leading-6 text-primary-foreground/70">{s.b}</p><div className="mt-auto"><Links items={s.l} dark /></div></div>)}</div>
    </div></section>
    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="Proof journeys" title="See the work in context" body="Explore how different Xyncwave capabilities come together around real operational and engineering problems." />
      <div className="mt-12 grid gap-6 lg:grid-cols-3">{[
        { t: "Connected Operations", to: "/case-studies/track-trace", cta: "View Connected Operations case study", l: [sol.dt, sol.erp, sol.int, sol.sw] },
        { t: "Modern Data & Reporting", to: "/case-studies/snowflake-data-warehouse-modernization", cta: "View Data & Reporting case study", l: [sol.data, sol.cloud, sol.int] },
        { t: "Product & Engineering Delivery", to: "/case-studies/digital-brokerage-platform", cta: "Building a connected digital stock brokering platform", l: [sol.sw, sol.cap, sol.int, sol.cloud] },
      ].map(j => <div key={j.t} className="hover-card flex flex-col border border-border bg-secondary p-8"><h3 className="text-2xl font-medium">{j.t}</h3><p className="mt-4 text-xs font-medium text-muted-foreground">Capabilities involved</p><Links items={j.l} /><SmartLink to={j.to} className="link-sweep group mt-8 inline-flex items-center gap-2 font-semibold">{j.cta}<ArrowRight className="arrow-nudge size-4 shrink-0 text-primary" /></SmartLink></div>)}</div>
    </div></section>
  </>;
}

export function IndustriesHubSections() {
  return <>
    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="Operating context" title="Different industries, different operating pressure" body="The technology challenge changes with the operating model. The right intervention depends on where complexity, fragmentation or delivery pressure is appearing." />
      <div className="mt-12 divide-y divide-border border-y border-border">{[
        ["Logistics & Supply Chain", "Movement, inventory, dispatch, field operations, customer visibility, billing and reconciliation often span multiple systems and teams.", "logistics"],
        ["Manufacturing", "Production, materials, quality, maintenance, inventory and reporting become harder to coordinate as plants, products and systems grow.", "manufacturing"],
        ["Healthcare", "Administrative workflows, departmental coordination, data exchange and operational reporting require dependable systems without overcomplicating clinical environments.", "healthcare"],
        ["Fintech", "Product roadmaps depend on reliable integrations, specialist engineering, platform scalability, data processing and controlled delivery.", "fintech"],
        ["Technology & IT Services", "Growth can create pressure around client delivery, specialist capability, project overflow and the speed at which engineering capacity can be added.", "technology-it-services"],
      ].map(([t, b, s]) => <SmartLink key={s} to={I(s!)} className="hover-row group grid gap-3 py-7 transition-colors duration-300 hover:bg-secondary md:grid-cols-[1fr_2fr_auto] md:items-center md:gap-8 md:px-6"><h3 className="text-xl font-medium transition-colors duration-300 group-hover:text-primary">{t}</h3><p className="leading-7 text-muted-foreground">{b}</p><ArrowRight className="arrow-nudge size-5 text-primary" /></SmartLink>)}</div>
    </div></section>
    <section className="bg-secondary py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="Signals for change" title="What typically triggers change?" body="Technology investment often becomes urgent when the operating environment changes faster than the existing systems or delivery model." />
      <div className="mt-12 grid gap-6 lg:grid-cols-2">{[
        { t: "Operational organisations", items: ["New facility, branch, warehouse or plant", "Geographic expansion", "Acquisition or consolidation", "ERP implementation or replacement", "Increasing transaction or production volume", "Reporting complexity", "More locations, users or operational handoffs", "Increasing spreadsheet and manual-work dependency"], l: [{ label: "Logistics", to: I("logistics") }, { label: "Manufacturing", to: I("manufacturing") }, { label: "Healthcare", to: I("healthcare") }] },
        { t: "Technology-led organisations", items: ["New product roadmap", "Funding or rapid growth", "Integration backlog", "Specialist skill requirement", "Difficult-to-fill engineering roles", "Client delivery commitments", "Platform modernization", "Temporary need for additional engineering capacity"], l: [{ label: "Fintech", to: I("fintech") }, { label: "Technology & IT Services", to: I("technology-it-services") }] },
      ].map(g => <div key={g.t} className="border border-border bg-background p-8"><h3 className="text-2xl font-medium">{g.t}</h3><ul className="mt-6 grid gap-x-6 sm:grid-cols-2">{g.items.map(x => <li key={x} className="border-t border-border py-3 text-sm font-medium">{x}</li>)}</ul><p className="mt-6 text-xs font-medium text-muted-foreground">Relevant industries</p><Links items={g.l} /></div>)}</div>
    </div></section>
    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="Problem-led routing" title="Explore by business problem" />
      <RouteCards items={[
        { title: "We need better operational visibility", links: [sol.dt, sol.data] },
        { title: "Our ERP does not cover the full workflow", links: [sol.erp, sol.dt] },
        { title: "Our systems do not communicate reliably", links: [sol.int] },
        { title: "Our reporting still depends on manual consolidation", links: [sol.data] },
        { title: "Our application is becoming difficult to maintain", links: [sol.mod] },
        { title: "Our roadmap is moving faster than recruitment", links: [sol.cap] },
        { title: "We need to build or extend a business-critical application", links: [sol.sw] },
      ]} />
    </div></section>
  </>;
}
