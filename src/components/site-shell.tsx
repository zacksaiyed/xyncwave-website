import { SmartLink, type AppPath } from "./app-link";
import { erpnextDocPaths } from "../lib/erpnext-docs";
import { useRouterState } from "@tanstack/react-router";

import { ArrowRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { AppearanceControl } from "./appearance";
import { caseStudyMedia, insightMedia, type MediaEntry } from "@/lib/media-registry";
import { products } from "@/lib/products";

// Logo paths from public directory
const headerLogoUrl = "/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/Logos/logo-header-light-background.png";
const headerLogoDarkUrl = "/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/Logos/logo-header-dark-background.png";
const footerLogoUrl = "/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/Logos/logo-footer-dark-background-with-tagline.png";

type NavItem = { to: AppPath; label: string; note: string; children?: NavItem[] };
type NavGroup = { heading: string; items: NavItem[] };

const solutionGroups: NavGroup[] = [
  { heading: "Build & Modernize", items: [
    { to: "/solutions/software-engineering", label: "Software Engineering", note: "Purpose-built web, mobile and backend products" },
    { to: "/solutions/application-modernization", label: "Application Modernization", note: "Refactor, replatform, rebuild or replace safely" },
    { to: "/solutions/digital-transformation", label: "Digital Transformation", note: "Connect manual and disconnected operating processes" },
  ] },
  { heading: "Cloud, Data & AI", items: [
    { to: "/solutions/cloud-platform-engineering", label: "Cloud & Platform Engineering", note: "Cloud foundations, delivery pipelines and reliability" },
    { to: "/solutions/data-engineering", label: "Data Engineering & Analytics", note: "Dependable pipelines, models and operational reporting" },
    { to: "/solutions/ai-automation", label: "AI & Intelligent Automation", note: "Bounded automation with human review where required" },
  ] },
  { heading: "Connect & Scale", items: [
    { to: "/solutions/integration", label: "API & System Integration", note: "Reliable records moving between core systems" },
    { to: "/solutions/erp-business-systems", label: "ERP / Business Systems", note: "Extend or connect ERP around real workflows", children: [{ to: "/solutions/erpnext-implementation", label: "ERPNext Implementation & Frappe Engineering", note: "Implementation, customization, migration and integration" }] },
    { to: "/solutions/engineering-capacity", label: "Engineering Capacity", note: "Engineers, pods and delivery teams that integrate" },
  ] },
];

const industryItems: NavItem[] = [
  { to: "/industries/logistics", label: "Logistics & Supply Chain", note: "Dispatch, warehouse, fleet and delivery visibility" },
  { to: "/industries/manufacturing", label: "Manufacturing", note: "Production, quality, inventory and traceability" },
  { to: "/industries/healthcare", label: "Healthcare", note: "Records, workflow and careful data handling" },
  { to: "/industries/fintech", label: "Fintech", note: "Onboarding, transactions, data and integrations" },
  { to: "/industries/technology-it-services", label: "Technology & IT Services", note: "White-label delivery and specialist capability" },
];

const productItems: NavItem[] = [
  { to: "/products", label: "All Products", note: "Software products built by Xyncwave" },
  ...products.map((p) => ({ to: `/products/${p.slug}`, label: p.name, note: p.navNote })),
];

const resourceItems: NavItem[] = [
  { to: "/research", label: "White Papers", note: "In-depth research reports on logistics and fintech readiness" },
  { to: "/insights", label: "Insights", note: "Articles on engineering, data, AI and digitalization" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const menuRef = useRef<HTMLElement>(null);
  // Desktop mega menus: which one is open (hover/focus), closed by any click, Escape or navigation.
  const [menu, setMenu] = useState<string | null>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { setMenu(null); }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    document.addEventListener("click", close, true);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("click", close, true); document.removeEventListener("keydown", onKey); };
  }, [menu]);
  const menuProps = (key: string) => ({ isOpen: menu === key, onOpenChange: (next: boolean) => setMenu((current) => (next ? key : current === key ? null : current)) });
  const mobileLinks = [
    { label: "Case Studies", to: "/case-studies" },
    { label: "About", to: "/about" },
    { label: "Why Xyncwave", to: "/why-xyncwave" },
  ] as const;
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusable?.[0]?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0]; const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; };
  }, [open]);
  return <>
    <a href="#main-content" className="fixed left-3 top-3 z-100 -translate-y-20 bg-primary px-4 py-2 text-primary-foreground focus:translate-y-0">Skip to content</a>
    <header className="sticky top-0 z-50 border-b border-border bg-background lg:backdrop-blur-md lg:supports-[backdrop-filter]:bg-background/85">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px blue-line opacity-40" />
      <div className="mx-auto flex h-20 max-w-[90rem] items-center justify-between gap-10 px-5 lg:px-8">
        <SmartLink to="/" aria-label="Xyncwave home" className="shrink-0 py-3"><img src={headerLogoUrl} alt="Xyncwave Corporation LLP" className="approved-logo__light h-9 w-auto max-w-[58vw] object-contain sm:h-10" /><img src={headerLogoDarkUrl} alt="" aria-hidden="true" className="approved-logo__dark h-9 w-auto max-w-[58vw] object-contain sm:h-10" /></SmartLink>
        <nav className="hidden items-center gap-6 min-[1380px]:flex 2xl:gap-9" aria-label="Primary navigation">
          <NavMenu {...menuProps("solutions")} label="Solutions" href="/solutions" groups={solutionGroups} spotlightTitle="Not sure which capability you need?" spotlightBody="Run a short directional assessment and get a view of where to start." spotlightTo="/digitalization-assessment" spotlightCta="Start the assessment" spotlightMedia={insightMedia["digital-transformation-fragmented-systems"]} />
          <NavMenu {...menuProps("industries")} label="Industries" href="/industries" groups={[{ heading: "Sectors we work in", items: industryItems }]} spotlightTitle="Explore our delivery work" spotlightBody="See how Xyncwave approaches operational systems, engineering, data, modernization and platform delivery." spotlightTo="/case-studies" spotlightCta="View Case Studies" spotlightMedia={caseStudyMedia["snowflake-data-warehouse-modernization"] ?? caseStudyMedia["track-trace"]} />
          <NavMenu {...menuProps("products")} label="Products" href="/products" groups={[{ heading: "Xyncwave products", items: productItems }]} spotlightTitle="TripOps for trip operations" spotlightBody="Trip records, trip expenses, budget visibility and reconciliation in one workflow." spotlightTo="/products/tripops" spotlightCta="Explore TripOps" />
          <SmartLink className="nav-link flex min-h-12 items-center whitespace-nowrap text-sm font-medium transition-colors duration-300 hover:text-primary" to="/case-studies">Case Studies</SmartLink>
          <NavMenu {...menuProps("resources")} label="Resources" href="/insights" groups={[{ heading: "Learn & explore", items: resourceItems }]} spotlightTitle="Southern Africa Logistics Technology & Operational Integration Outlook 2027" spotlightBody="Our latest white paper on how logistics operators can assess technology and integration readiness." spotlightTo="/research/southern-africa-logistics-2027" spotlightCta="Read the white paper" />
          <SmartLink className="nav-link flex min-h-12 items-center whitespace-nowrap text-sm font-medium transition-colors duration-300 hover:text-primary" to="/about">About</SmartLink>
          {/* Site search (protected by scripts/protect.mjs) */}
          <Button variant="ghost" size="sm" asChild><SmartLink to="/search"><Search aria-hidden="true" /><span className="hidden 2xl:inline">Search</span><span className="sr-only 2xl:hidden">Search</span></SmartLink></Button>
          <AppearanceControl />
          <Button asChild className="whitespace-nowrap"><SmartLink to="/start-a-conversation">Bring Us Your Challenge <ArrowRight /></SmartLink></Button>
        </nav>
        <div className="flex items-center gap-1 min-[1380px]:hidden">
          <Button variant="ghost" size="icon" asChild><SmartLink to="/search" aria-label="Search the site"><Search aria-hidden="true" /></SmartLink></Button>
          <Button variant="ghost" size="icon" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(v => !v)}>{open ? <X /> : <Menu />}</Button>
        </div>
      </div>
      {open && <nav ref={menuRef} role="dialog" aria-modal="true" aria-label="Mobile navigation" className="fixed inset-x-0 bottom-0 top-20 z-50 overflow-y-auto border-t border-border bg-background px-5 py-5 min-[1380px]:hidden">
        <MobileSection id="solutions" label="Solutions" to="/solutions" open={section === "solutions"} onToggle={() => setSection(s => s === "solutions" ? null : "solutions")} items={solutionGroups.flatMap(g => g.items.flatMap(item => [item, ...(item.children ?? [])]))} onNavigate={() => setOpen(false)} />
        <MobileSection id="industries" label="Industries" to="/industries" open={section === "industries"} onToggle={() => setSection(s => s === "industries" ? null : "industries")} items={industryItems} onNavigate={() => setOpen(false)} />
        <MobileSection id="products" label="Products" to="/products" open={section === "products"} onToggle={() => setSection(s => s === "products" ? null : "products")} items={productItems} onNavigate={() => setOpen(false)} />
        <MobileSection id="resources" label="Resources" to="/insights" open={section === "resources"} onToggle={() => setSection(s => s === "resources" ? null : "resources")} items={resourceItems} onNavigate={() => setOpen(false)} />
        <div className="grid">{mobileLinks.map((item) => <SmartLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="flex min-h-16 items-center border-b border-border text-xl font-medium transition-[color,padding] duration-300 hover:pl-2 hover:text-primary">{item.label}</SmartLink>)}</div>
        <AppearanceControl mobile />
        <p className="mt-7 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">Quick tools</p>
        <div className="mt-3 grid gap-2">
          {([["Digitalization Assessment", "/digitalization-assessment"], ["AI Opportunity Assessment", "/ai-opportunity-assessment"], ["Engineering Capacity Assessment", "/engineering-capacity-assessment"]] as const).map(([label, to]) =>
            <SmartLink key={to} to={to} onClick={() => setOpen(false)} className="hover-card group flex min-h-13 items-center justify-between border border-border bg-secondary/60 px-4 py-3 text-sm font-medium">{label}<ArrowRight className="arrow-nudge size-4 text-primary" /></SmartLink>)}
        </div>
        <Button className="mt-5 w-full" asChild><SmartLink to="/start-a-conversation" onClick={() => setOpen(false)}>Tell Us Your Challenge <ArrowRight /></SmartLink></Button>
      </nav>}
    </header>
  </>;
}

function MobileSection({ id, label, to, open, onToggle, items, onNavigate }: { id: string; label: string; to: AppPath; open: boolean; onToggle: () => void; items: NavItem[]; onNavigate: () => void }) {
  return <div className="border-b border-border">
    <div className="flex items-center justify-between">
      <SmartLink to={to} onClick={onNavigate} className="flex min-h-16 flex-1 items-center text-xl font-medium transition-colors duration-300 hover:text-primary">{label}</SmartLink>
      <button type="button" onClick={onToggle} aria-expanded={open} aria-controls={`nav-${id}`} aria-label={`${open ? "Hide" : "Show"} ${label} pages`} className="flex size-12 items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-primary">
        <ChevronDown className={`size-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
    </div>
    {open && <div id={`nav-${id}`} className="grid gap-px pb-4">
      {items.map(i => <SmartLink key={i.to} to={i.to} onClick={onNavigate} className="group flex items-start justify-between gap-4 border-t border-border/70 py-3 transition-colors duration-300 hover:text-primary">
        <span><span className="block text-base font-medium">{i.label}</span><span className="mt-0.5 block text-sm leading-6 text-muted-foreground">{i.note}</span></span>
        <ArrowRight className="arrow-nudge mt-1 size-4 shrink-0 text-primary" />
      </SmartLink>)}
    </div>}
  </div>;
}

function NavMenu({ label, href, groups, spotlightTitle, spotlightBody, spotlightTo, spotlightCta, spotlightMedia, isOpen, onOpenChange }: { label: string; href: AppPath; groups: NavGroup[]; spotlightTitle: string; spotlightBody: string; spotlightTo: AppPath; spotlightCta: string; spotlightMedia?: MediaEntry | undefined; isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const columns = groups.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1";
  // Opens on hover (and keyboard focus). Closes when the pointer leaves, on any click (link, empty area or outside),
  // on Escape, on navigation and when focus leaves. The header owns the open/close state so only one menu is open.
  const timer = useRef<number | undefined>(undefined);
  const clear = () => { if (timer.current !== undefined) window.clearTimeout(timer.current); };
  const openSoon = () => { clear(); timer.current = window.setTimeout(() => onOpenChange(true), 60); };
  const closeSoon = () => { clear(); timer.current = window.setTimeout(() => onOpenChange(false), 150); };
  useEffect(() => clear, []);
  return <div className="group static py-6" data-open={isOpen} onMouseEnter={openSoon} onMouseLeave={closeSoon} onFocus={() => { clear(); onOpenChange(true); }} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) { clear(); onOpenChange(false); } }}>
    <SmartLink to={href} aria-haspopup="true" aria-expanded={isOpen} className="nav-link flex min-h-12 items-center gap-1.5 whitespace-nowrap text-sm font-medium transition-colors duration-300 hover:text-primary">
      {label}<ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-muted-foreground"}`} />
    </SmartLink>
    <div className={`mega-panel absolute inset-x-0 top-full z-40 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
      <div className="border-b border-border bg-background shadow-[0_28px_60px_-40px_rgba(11,13,18,0.55)]">
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px blue-line opacity-70" />
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-9 lg:grid-cols-[2.6fr_1fr] lg:px-8">
          <div className={`grid gap-x-8 gap-y-7 ${columns}`}>
            {groups.map(group => <div key={group.heading}>
              <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">{group.heading}</p>
              <div className={`mt-4 grid gap-1 ${groups.length === 1 ? "sm:grid-cols-2 sm:gap-x-8" : ""}`}>
                {group.items.map(item => <div key={item.to}><SmartLink to={item.to} className="group/item -mx-3 flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-secondary">
                  <span>
                    <span className="block text-sm font-medium transition-colors duration-300 group-hover/item:text-primary">{item.label}</span>
                    <span className="mt-0.5 block text-[0.8rem] leading-5 text-muted-foreground">{item.note}</span>
                  </span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:opacity-100" />
                </SmartLink>{item.children?.map(child => <SmartLink key={child.to} to={child.to} className="ml-1 flex items-start gap-2 border-l border-border py-2 pl-3 text-xs leading-5 text-muted-foreground hover:text-primary"><span>{child.label}</span><ArrowRight className="mt-1 size-3 shrink-0" /></SmartLink>)}</div>)}
              </div>
            </div>)}
          </div>
          <div className="flex flex-col justify-between gap-5 border border-border bg-secondary/60 p-6">
            {spotlightMedia && <SmartLink to={spotlightTo} tabIndex={-1} aria-hidden className="group/img -mx-6 -mt-6 block aspect-[16/8] overflow-hidden border-b border-border">
              <img src={spotlightMedia.src} srcSet={spotlightMedia.srcSet} sizes="320px" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-[1.03]" style={{ objectPosition: spotlightMedia.position, filter: "saturate(.8) brightness(1.04)" }} />
            </SmartLink>}
            <div>
              <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">Where to start</p>
              <p className="mt-3 text-base leading-6 font-medium">{spotlightTitle}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{spotlightBody}</p>
            </div>
            <div className="grid gap-2">
              <SmartLink to={spotlightTo} className="group/cta flex items-center justify-between text-sm font-medium text-primary">{spotlightCta}<ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" /></SmartLink>
              <SmartLink to="/start-a-conversation" className="group/cta flex items-center justify-between border-t border-border pt-2 text-sm font-medium transition-colors duration-300 hover:text-primary">Bring us your challenge<ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" /></SmartLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export function SiteFooter() {
  return <footer className="bg-surface-inverse text-primary-foreground">
    <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="grid gap-14 border-b border-primary-foreground/15 pb-14 lg:grid-cols-[1.2fr_2fr]">
        <div><img src={footerLogoUrl} alt="Xyncwave Corporation LLP" className="h-10 w-auto max-w-full object-contain" /><p className="mt-8 max-w-sm text-3xl font-medium">LET'S CONNECT. <span className="text-primary">DIGITALLY.</span></p><p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/65">Enterprise-grade thinking and modern technology execution for organizations solving complex operational and delivery problems.</p></div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4"><FooterCol title="Solutions" links={[["Digital Transformation","/solutions/digital-transformation"],["Engineering Capacity","/solutions/engineering-capacity"],["AI & Automation","/solutions/ai-automation"],["Modernization","/solutions/application-modernization"]]} /><FooterCol title="Industries" links={[["Logistics","/industries/logistics"],["Manufacturing","/industries/manufacturing"],["Healthcare","/industries/healthcare"],["Fintech","/industries/fintech"]]} /><FooterCol title="Resources" links={[["Products","/products"],["TripOps","/products/tripops"],["Case Studies","/case-studies"],["Insights","/insights"],["Research","/research"],["Assessments","/digitalization-assessment"]]} /><FooterCol title="Company" links={[["About","/about"],["Why Xyncwave","/why-xyncwave"],["Contact","/contact"],["Privacy","/privacy"]]} /></div>
      </div>
      <div className="flex flex-col gap-3 pt-7 text-xs text-primary-foreground/55 sm:flex-row sm:justify-between"><p>© {new Date().getFullYear()} Xyncwave Corporation LLP.</p><div className="flex gap-5"><SmartLink to="/privacy">Privacy</SmartLink><SmartLink to="/terms">Terms</SmartLink></div></div>
    </div>
  </footer>;
}
type FooterPath = AppPath;
function FooterCol({ title, links }: { title: string; links: readonly (readonly [string, FooterPath])[] }) { return <div><h2 className="text-xs font-medium text-primary-foreground">{title}</h2><ul className="mt-4 space-y-3">{links.map(([label,to]) => <li key={to}><SmartLink to={to} className="link-sweep text-sm text-primary-foreground/65 transition-colors duration-300 hover:text-primary-foreground">{label}</SmartLink></li>)}</ul></div>; }

export function StickyMobileCTA() {
  const pathname = useRouterState({ select: state => state.location.pathname });
  if (pathname === "/solutions/erpnext-implementation" || erpnextDocPaths.includes(pathname)) return null;
  if (/^\/industries\/[^/]+$/.test(pathname) || /^\/insights\/(digital-transformation-fragmented-systems|ai-workflow-automation|staff-augmentation-vs-dedicated-team-vs-outsourcing|logistics-digital-transformation-africa|system-integration-strategy|erp-vs-custom-software|data-engineering-growing-businesses|modern-data-stack|data-warehouse-modernization|application-modernization-refactor-replatform-rebuild-replace|cloud-migration-vs-cloud-modernization|legacy-application-business-risk|healthcare-digital-transformation-africa|healthcare-data-pipeline-modernization|data-silos-business-visibility|workflow-automation-strategy|digitalize-excel-workflows|manufacturing-digitalization-africa|fintech-scale-engineering-after-funding|fintech-platform-modernization|fintech-api-integration-strategy|fintech-what-to-outsource|fintech-asynchronous-workflows|fintech-data-engineering|white-label-software-development|evaluate-software-engineering-partner|reduce-engineering-backlog|ai-integration-readiness|business-case-process-digitalization|operational-reporting-modernization)$/.test(pathname)) return null;
  return <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-3 lg:hidden"><Button className="w-full" asChild><SmartLink to="/start-a-conversation">Tell Us Your Challenge <ArrowRight /></SmartLink></Button></div>;
}