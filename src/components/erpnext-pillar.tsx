import { Fragment, useEffect, type ReactNode } from "react";
import { ArrowDown, ArrowRight, Network } from "lucide-react";
import { SmartLink } from "./app-link";
import { Button } from "./ui/button";
import { Breadcrumbs, Eyebrow } from "./page-sections";
import { ContinueExploring } from "./continue-exploring";
import { erpnextPillar, type PillarBlock } from "../lib/erpnext-pillar";
import { track } from "../lib/analytics";
import { ERPNextEnquiry } from "./erpnext-enquiry";
import { ERPNextRegionSwitcher } from "./erpnext-region-switcher";

const approach = "a-practical-erpnext-implementation-approach";
const path = "/solutions/erpnext-implementation";

export function ERPNextPillar() {
  useEffect(() => { track("page_view", { page: path, interest: "erpnext", language: "en" }); }, []);
  return <>
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Solutions", to: "/solutions" }, { label: "ERP & Business Systems", to: "/solutions/erp-business-systems" }, { label: "ERPNext Implementation" }]} />
    <section className="bg-surface-hero"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20"><ERPNextRegionSwitcher current={path} /><Eyebrow>ERPNext & Frappe Engineering</Eyebrow><h1 className="hero-title max-w-5xl">ERPNext Implementation, Customization & Frappe Engineering</h1><p className="mt-6 text-xl font-medium">Connect the ERP to the operation—not the other way around.</p><p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground">An ERP implementation touches the decisions that keep a business running: what gets purchased, what is available, which work order is ready, how a customer commitment becomes a delivery, and what finance can actually reconcile. The software matters, but the operating model matters more.</p><p className="mt-4 max-w-3xl leading-8 text-muted-foreground">XWC helps businesses evaluate where ERPNext fits, plan implementation, extend workflows through maintainable Frappe applications, integrate the systems around it, and approach migration with clear ownership. Whether you’re selecting ERPNext for the first time or trying to improve a deployment that has accumulated workarounds, the conversation should begin with the process and the responsibilities behind it.</p><div className="mt-7 flex flex-wrap gap-3"><EnquiryLink label="Discuss Your ERPNext Project" placement="hero" /><Button asChild variant="outline" size="lg" className="h-auto whitespace-normal py-4"><a href={`#${approach}`}>Explore Our Implementation Approach<ArrowDown className="shrink-0" /></a></Button></div><SmartLink to="/case-studies/track-trace" className="mt-6 inline-flex items-center gap-2 text-sm text-primary">ERPNext/Frappe-related delivery: Track & Trace platform<ArrowRight className="size-4 shrink-0" /></SmartLink></div></section>
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
      <aside className="min-w-0"><nav aria-label="On this page" className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto border-l border-border pr-2 lg:block"><p className="mb-4 pl-4 text-xs font-medium text-muted-foreground">ERPNext project decisions</p>{erpnextPillar.map(section => <a className="block border-l border-transparent px-4 py-2 text-xs leading-5 text-muted-foreground hover:border-primary hover:text-primary" key={section.id} href={`#${section.id}`}>{section.title}</a>)}<a href="#erpnext-fit-review" className="mt-3 block px-4 text-sm font-medium text-primary">Discuss your project<ArrowRight className="mt-2 size-4" /></a></nav><details className="border-y border-border py-5 lg:hidden"><summary className="cursor-pointer font-medium">On this page</summary><nav aria-label="Mobile page contents" className="mt-4 grid gap-3">{erpnextPillar.map(section => <a key={section.id} className="text-sm text-muted-foreground" href={`#${section.id}`}>{section.title}</a>)}</nav></details></aside>
      <div className="min-w-0 max-w-[800px]">
        {erpnextPillar.map(section => <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-border pb-12 not-first:pt-12"><h2 className="mb-6 text-2xl font-medium leading-tight sm:text-3xl">{section.title}</h2><div className="space-y-5">{section.blocks.map((block, i) => <Block key={i} block={block} />)}</div>{section.id === "architecture-erpnext-as-a-responsible-part-of-the-system-landscape" && <Architecture />}{section.id === "erpnext-implementation-cost-budget-for-the-work-not-just-the-license" && <BudgetTable />}</section>)}
        <section id="erpnext-fit-review" className="scroll-mt-28 py-12"><Eyebrow>ERPNext fit review</Eyebrow><h2 className="text-3xl font-medium">Discuss Your ERPNext Project</h2><p className="mb-8 mt-5 leading-8 text-muted-foreground">Start with the workflow, the systems you already use and the decision you need to make. We’ll use this context for a practical project conversation.</p><ERPNextEnquiry /></section>
        <section className="border-t border-border py-12"><h2 className="text-2xl font-medium">Official sources and technical documentation</h2><p className="mt-4 text-sm leading-7 text-muted-foreground">Source pages reviewed 12 November 2026. Regulatory requirements and third-party interfaces should be checked against the applicable release and your organization’s circumstances before implementation.</p><ul className="mt-5 space-y-3 text-sm">{[
          ["Frappe — ERPNext open-source licensing", "https://docs.frappe.io/erpnext/open-source"],
          ["Frappe — ERPNext documentation", "https://docs.frappe.io/erpnext"],
          ["German Federal Ministry of Finance — E-Rechnung FAQ", "https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.htm"],
          ["ZATCA — e-invoicing FAQs", "https://www.zatca.gov.sa/en/E-Invoicing/Introduction/FAQ/Pages/default.aspx"],
          ["UAE Ministry of Finance — e-invoicing scope and timelines", "https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-two-ministerial-decisions-on-the-scope-of-obligations-and-the-timelines-for-implementing-the-electronic-invoicing-system-2/"],
        ].map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{label}</a></li>)}</ul></section>
      </div>
    </div>
    <section className="border-t border-border py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><Eyebrow>Regional ERPNext pages</Eyebrow><h2 className="max-w-3xl text-3xl font-medium">Germany, Saudi Arabia, the UAE and the wider GCC</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Deutschland (Deutsch)", "ERPNext Einführung, DATEV-Übergabe und E-Rechnung für den Mittelstand.", "/de/erpnext-implementierung"], ["GCC (English)", "Multi-entity operations, ZATCA Phase 2 and UAE e-invoicing considerations.", "/gcc/erpnext-implementation"], ["السعودية والخليج (العربية)", "تطبيق ERPNext وتخصيصه للشركات في السعودية ودول الخليج.", "/ar/erpnext-implementation"]].map(([t, b, to]) => <SmartLink key={to} to={to!} className="hover-card group block border border-border p-6"><h3 className="text-lg font-medium group-hover:text-primary">{t}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p></SmartLink>)}</div></div></section>
    <ContinueExploring title="Follow the operational system decision" items={[
      { type: "Insight", title: "Upgrade-Safe ERPNext Customization", body: "Frappe apps, hooks, APIs and a release strategy that keeps upgrades possible.", to: "/insights/erpnext-frappe-upgrade-safe-customization" },
      { type: "Insight", title: "ERPNext Implementation Cost", body: "What changes the budget, timeline and total ownership.", to: "/insights/erpnext-implementation-cost-tco-guide" },
      { type: "Solution", title: "ERP & Business Systems", body: "Compare configuring ERP, integrating specialist tools and building a focused application.", to: "/solutions/erp-business-systems" },
      { type: "Case study", title: "Connected Track & Trace platform", body: "Explore ERPNext/Frappe web workflows, Flutter technician tools and an AWS serverless application layer.", to: "/case-studies/track-trace" },
      { type: "Insight", title: "ERP vs Custom Software", body: "Decide which system should own the business transaction before selecting the implementation path.", to: "/insights/erp-vs-custom-software" },
      { type: "Insight", title: "Replace Excel-Based Business Processes", body: "Preserve the rules, data and exception paths behind a spreadsheet-dependent operation.", to: "/insights/digitalize-excel-workflows" },
      { type: "Industry", title: "Manufacturing Technology", body: "Connect production, material availability, quality evidence and operating records.", to: "/industries/manufacturing" },
      { type: "Industry", title: "Logistics & Supply Chain", body: "Consider the ownership boundaries among warehouse, dispatch, stock and finance systems.", to: "/industries/logistics" },
    ]} />
  </>;
}

function EnquiryLink({ label, placement }: { label: string; placement: string }) {
  return <Button size="lg" asChild className="h-auto max-w-full whitespace-normal py-4"><a href="#erpnext-fit-review" onClick={() => track("cta_click", { interest: "erpnext", page: path, placement })}>{label}<ArrowRight className="shrink-0" /></a></Button>;
}

function Block({ block }: { block: PillarBlock }) {
  if (block.kind === "heading") return <h3 className="pt-4 text-xl font-medium">{block.text}</h3>;
  if (block.kind === "cta") return <EnquiryLink label={block.text} placement="section" />;
  if (block.kind === "list") return <ol className="list-decimal space-y-4 pl-6 leading-8 text-muted-foreground">{block.items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ol>;
  if (block.kind === "table") return <div className="overflow-x-auto border-y border-border"><table className="w-full min-w-[600px] text-left text-sm leading-7"><thead><tr>{block.rows[0]?.map(cell => <th className="border-b border-border bg-secondary p-4 font-medium" key={cell}>{cell}</th>)}</tr></thead><tbody>{block.rows.slice(1).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border-b border-border p-4 align-top text-muted-foreground">{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
  return <p className="leading-8 text-muted-foreground">{inline(block.text)}</p>;
}

export function inline(text: string): ReactNode {
  const tokens = text.split(/(\[[^\]]+\]\(https?:\/\/[^)]+\)|\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s]+|\*[^*]+\*)/g);
  return tokens.map((token, i) => {
    const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) { const label = link[1] ?? ""; const url = link[2] ?? ""; return url.startsWith("https://xyncwave.com/") ? <SmartLink key={i} to={url.replace("https://xyncwave.com", "")} className="text-primary underline">{label}</SmartLink> : <a key={i} href={url} className="text-primary underline" rel="noopener noreferrer">{label}</a>; }
    if (token.startsWith("**")) return <strong key={i} className="font-semibold text-foreground">{token.slice(2, -2)}</strong>;
    if (token.startsWith("`")) return <span key={i} className="font-medium text-foreground">{token.slice(1, -1)}</span>;
    if (token.startsWith("*")) return <em key={i}>{token.slice(1, -1)}</em>;
    if (token.startsWith("http")) { const url = token.replace(/\.$/, ""); return <a key={i} href={url} className="break-all text-primary underline">{url}</a>; }
    return <Fragment key={i}>{token}</Fragment>;
  });
}

function Architecture() {
  return <figure className="mt-8 border-y border-border py-8"><figcaption className="mb-6 text-sm font-medium">Illustrative system responsibilities — validate against your workflow</figcaption><div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr]"><div className="space-y-3">{["E-commerce · customer orders", "WMS · warehouse execution", "Field mobile · job evidence", "Legacy finance · retained records"].map(label => <div key={label} className="border border-border p-4 text-sm">{label}</div>)}</div><div className="flex items-center justify-center"><ArrowRight className="size-6 rotate-90 text-primary sm:rotate-0" /></div><div className="flex flex-col justify-center border border-primary bg-secondary p-6"><Network className="mb-4 size-7 text-primary" /><p className="font-medium">ERPNext / Frappe</p><p className="mt-3 text-sm leading-7 text-muted-foreground">Agreed purchasing, inventory and accounting records.<br />APIs, identifiers and explicit ownership.</p></div></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="border border-border p-4 text-sm">Integration controls: authentication, retries, deduplication, exception ownership.</div><div className="border border-border p-4 text-sm">Separate reporting layer: reconciliation, record lineage, shared definitions.</div></div></figure>;
}

function BudgetTable() {
  const rows = [["Discovery & configuration", "Agreed workflows, modules, role permissions and exceptions."], ["Data preparation & migration", "Source quality, transaction history, ownership and reconciliations."], ["Extensions & integrations", "App boundaries, API contracts, tests and third-party dependencies."], ["Hosting & operational controls", "Infrastructure, access, backups, monitoring and recovery responsibilities."], ["Adoption & ownership", "User training, acceptance, handover and change approval."], ["Recurring engineering & support", "Release maintenance, incidents and a prioritized enhancement backlog."]];
  return <div className="mt-8"><h3 className="mb-4 text-xl font-medium">Estimate-preparation checklist</h3><dl className="divide-y divide-border border-y border-border">{rows.map(([title, body]) => <div key={title} className="grid gap-3 py-5 sm:grid-cols-2"><dt className="font-medium">{title}</dt><dd className="text-sm leading-7 text-muted-foreground">{body}</dd></div>)}</dl></div>;
}