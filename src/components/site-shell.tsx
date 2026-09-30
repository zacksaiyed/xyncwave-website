import { SmartLink, type AppPath } from "./app-link";
import { useRouterState } from "@tanstack/react-router";

import { ArrowRight, ChevronDown, Mail, MapPin, Menu, Phone, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { companyContact, companyMapUrl } from "../lib/company-contact";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { AppearanceControl } from "./appearance";

const approvedLogoDirectory = "/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/Logos";
const approvedLogos = {
  headerLight: `${approvedLogoDirectory}/logo-header-light-background.png`,
  headerDark: `${approvedLogoDirectory}/logo-header-dark-background.png`,
  footerDark: `${approvedLogoDirectory}/logo-footer-dark-background-with-tagline.png`,
} as const;

type NavItem = { to: AppPath; label: string; note: string };
type NavGroup = { heading: string; items: NavItem[] };

const solutionGroups: NavGroup[] = [
  {
    heading: "Build & Modernize",
    items: [
      {
        to: "/solutions/software-engineering",
        label: "Software Engineering",
        note: "Purpose-built web, mobile and backend products",
      },
      {
        to: "/solutions/application-modernization",
        label: "Application Modernization",
        note: "Refactor, replatform, rebuild or replace safely",
      },
      {
        to: "/solutions/digital-transformation",
        label: "Digital Transformation",
        note: "Connect manual and disconnected operating processes",
      },
    ],
  },
  {
    heading: "Cloud, Data & AI",
    items: [
      {
        to: "/solutions/cloud-platform-engineering",
        label: "Cloud & Platform Engineering",
        note: "Cloud foundations, delivery pipelines and reliability",
      },
      {
        to: "/solutions/data-engineering",
        label: "Data Engineering & Analytics",
        note: "Dependable pipelines, models and operational reporting",
      },
      {
        to: "/solutions/ai-automation",
        label: "AI & Intelligent Automation",
        note: "Bounded automation with human review where required",
      },
    ],
  },
  {
    heading: "Connect & Scale",
    items: [
      {
        to: "/solutions/integration",
        label: "API & System Integration",
        note: "Reliable records moving between core systems",
      },
      {
        to: "/solutions/erp-business-systems",
        label: "ERP / Business Systems",
        note: "Extend or connect ERP around real workflows",
      },
      {
        to: "/solutions/engineering-capacity",
        label: "Engineering Capacity",
        note: "Engineers, pods and delivery teams that integrate",
      },
    ],
  },
];

const industryItems: NavItem[] = [
  {
    to: "/industries/logistics",
    label: "Logistics & Supply Chain",
    note: "Dispatch, warehouse, fleet and delivery visibility",
  },
  {
    to: "/industries/manufacturing",
    label: "Manufacturing",
    note: "Production, quality, inventory and traceability",
  },
  {
    to: "/industries/healthcare",
    label: "Healthcare",
    note: "Records, workflow and careful data handling",
  },
  {
    to: "/industries/fintech",
    label: "Fintech",
    note: "Onboarding, transactions, data and integrations",
  },
  {
    to: "/industries/technology-it-services",
    label: "Technology & IT Services",
    note: "White-label delivery and specialist capability",
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string | null>(null);
  const [desktopMenu, setDesktopMenu] = useState<string | null>(null);
  const [suppressedMenu, setSuppressedMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const mobileLinks = [
    { label: "Case Studies", to: "/case-studies" },
    { label: "Insights", to: "/insights" },
    { label: "About", to: "/about" },
    { label: "Why XWC", to: "/why-xyncwave" },
  ] as const;

  useEffect(() => {
    setOpen(false);
    setDesktopMenu(null);
    setSection(null);
    setSuppressedMenu(null);
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onBreakpoint = () => {
      if (desktop.matches) setOpen(false);
      setDesktopMenu(null);
      setSuppressedMenu(null);
    };
    desktop.addEventListener("change", onBreakpoint);
    return () => desktop.removeEventListener("change", onBreakpoint);
  }, []);

  useEffect(() => {
    if (!desktopMenu) return;
    const onKeyDown = (event: KeyboardEvent) => {
      // Hover-open content is dismissible even when keyboard focus is elsewhere.
      // Focus inside NavMenu is handled locally and never reaches this listener.
      if (event.key !== "Escape" || event.defaultPrevented) return;
      event.preventDefault();
      setSuppressedMenu(desktopMenu);
      setDesktopMenu(null);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setDesktopMenu(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [desktopMenu]);

  return (
    <>
      <a
        href="#main-content"
        className="fixed left-3 top-3 z-100 -translate-y-20 bg-primary px-4 py-2 text-primary-foreground focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        ref={headerRef}
        className="site-header sticky top-0 z-50 border-b border-border bg-background"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px blue-line opacity-40"
        />
        <div className="site-header-inner mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 lg:px-8">
          <SmartLink to="/" aria-label="XWC home" className="logo-backing shrink-0 py-3">
            <ApprovedLogo
              lightAsset={approvedLogos.headerLight}
              darkAsset={approvedLogos.headerDark}
              location="header"
            />
          </SmartLink>
          <nav
            className="site-primary-nav hidden items-center gap-2 xl:flex"
            aria-label="Primary navigation"
          >
            <NavMenu
              label="Solutions"
              href="/solutions"
              groups={solutionGroups}
              open={desktopMenu === "solutions"}
              suppressed={suppressedMenu === "solutions"}
              onOpen={() => setDesktopMenu("solutions")}
              onClose={() => setDesktopMenu(null)}
              onDismiss={() => {
                setSuppressedMenu("solutions");
                setDesktopMenu(null);
              }}
              onLeave={() => {
                setDesktopMenu(null);
                setSuppressedMenu(null);
              }}
              spotlightTitle="Not sure which capability you need?"
              spotlightBody="Run a short directional assessment and get a view of where to start."
              spotlightTo="/digitalization-assessment"
              spotlightCta="Start the assessment"
            />
            <NavMenu
              label="Industries"
              href="/industries"
              groups={[{ heading: "Sectors we work in", items: industryItems }]}
              open={desktopMenu === "industries"}
              suppressed={suppressedMenu === "industries"}
              onOpen={() => setDesktopMenu("industries")}
              onClose={() => setDesktopMenu(null)}
              onDismiss={() => {
                setSuppressedMenu("industries");
                setDesktopMenu(null);
              }}
              onLeave={() => {
                setDesktopMenu(null);
                setSuppressedMenu(null);
              }}
              spotlightTitle="See a verified delivery example"
              spotlightBody="A multi-location operations platform connecting support, field work, stock and evidence."
              spotlightTo="/case-studies/track-trace"
              spotlightCta="Open the case study"
            />
            <SmartLink
              className="nav-link flex min-h-12 items-center text-sm font-medium transition-colors duration-300 hover:text-primary"
              to="/case-studies"
            >
              Case Studies
            </SmartLink>
            <SmartLink
              className="nav-link flex min-h-12 items-center text-sm font-medium transition-colors duration-300 hover:text-primary"
              to="/insights"
            >
              Insights
            </SmartLink>
            <SmartLink
              className="nav-link flex min-h-12 items-center text-sm font-medium transition-colors duration-300 hover:text-primary"
              to="/about"
            >
              About
            </SmartLink>
            <Button variant="ghost" size="sm" asChild>
              <SmartLink to="/search">
                <Search aria-hidden="true" />
                <span className="hidden xl:inline">Search</span>
                <span className="sr-only xl:hidden">Search</span>
              </SmartLink>
            </Button>
            <AppearanceControl />
            <Button asChild>
              <SmartLink to="/start-a-conversation">
                Bring Us Your Challenge <ArrowRight />
              </SmartLink>
            </Button>
          </nav>
          <div className="flex items-center gap-1 xl:hidden">
            <Button variant="ghost" size="icon" asChild>
              <SmartLink to="/search" aria-label="Search the site">
                <Search aria-hidden="true" />
              </SmartLink>
            </Button>
            <Sheet
              open={open}
              onOpenChange={(next) => {
                setOpen(next);
                if (next) setDesktopMenu(null);
              }}
            >
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                aria-describedby={undefined}
                onCloseAutoFocus={(event) => {
                  if (!window.matchMedia("(min-width: 1280px)").matches) return;
                  event.preventDefault();
                  headerRef.current
                    ?.querySelector<HTMLAnchorElement>('a[aria-label="XWC home"]')
                    ?.focus({ preventScroll: true });
                }}
                className="w-full max-w-none overflow-y-auto px-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-16 sm:max-w-md xl:hidden"
              >
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <nav aria-label="Mobile navigation">
                  <MobileSection
                    id="solutions"
                    label="Solutions"
                    to="/solutions"
                    open={section === "solutions"}
                    onToggle={() => setSection((s) => (s === "solutions" ? null : "solutions"))}
                    items={solutionGroups.flatMap((g) => g.items)}
                    onNavigate={() => setOpen(false)}
                  />
                  <MobileSection
                    id="industries"
                    label="Industries"
                    to="/industries"
                    open={section === "industries"}
                    onToggle={() => setSection((s) => (s === "industries" ? null : "industries"))}
                    items={industryItems}
                    onNavigate={() => setOpen(false)}
                  />
                  <div className="grid">
                    {mobileLinks.map((item) => (
                      <SmartLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className="flex min-h-16 items-center border-b border-border text-xl font-medium transition-[color,padding] duration-300 hover:pl-2 hover:text-primary"
                      >
                        {item.label}
                      </SmartLink>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-5 w-full" asChild>
                    <SmartLink to="/search" onClick={() => setOpen(false)}>
                      <Search /> Search the site
                    </SmartLink>
                  </Button>
                  <AppearanceControl mobile />
                  <p className="mt-7 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Quick tools
                  </p>
                  <div className="mt-3 grid gap-2">
                    {(
                      [
                        ["Digitalization Assessment", "/digitalization-assessment"],
                        ["AI Opportunity Assessment", "/ai-opportunity-assessment"],
                        ["Engineering Capacity Assessment", "/engineering-capacity-assessment"],
                      ] as const
                    ).map(([label, to]) => (
                      <SmartLink
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="hover-card group flex min-h-13 items-center justify-between border border-border bg-secondary/60 px-4 py-3 text-sm font-medium"
                      >
                        {label}
                        <ArrowRight className="arrow-nudge size-4 text-primary" />
                      </SmartLink>
                    ))}
                  </div>
                  <Button className="mt-5 w-full" asChild>
                    <SmartLink to="/start-a-conversation" onClick={() => setOpen(false)}>
                      Tell Us Your Challenge <ArrowRight />
                    </SmartLink>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

function MobileSection({
  id,
  label,
  to,
  open,
  onToggle,
  items,
  onNavigate,
}: {
  id: string;
  label: string;
  to: AppPath;
  open: boolean;
  onToggle: () => void;
  items: NavItem[];
  onNavigate: () => void;
}) {
  return (
    <div className="border-b border-border">
      <div className="flex items-center justify-between">
        <SmartLink
          to={to}
          onClick={onNavigate}
          className="flex min-h-16 flex-1 items-center text-xl font-medium transition-colors duration-300 hover:text-primary"
        >
          {label}
        </SmartLink>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`nav-${id}`}
          aria-label={`${open ? "Hide" : "Show"} ${label} pages`}
          className="flex size-12 items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-primary"
        >
          <ChevronDown
            className={`size-5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      {open && (
        <div id={`nav-${id}`} className="grid gap-px pb-4">
          {items.map((i) => (
            <SmartLink
              key={i.to}
              to={i.to}
              onClick={onNavigate}
              className="group flex items-start justify-between gap-4 border-t border-border/70 py-3 transition-colors duration-300 hover:text-primary"
            >
              <span>
                <span className="block text-base font-medium">{i.label}</span>
                <span className="mt-0.5 block text-sm leading-6 text-muted-foreground">
                  {i.note}
                </span>
              </span>
              <ArrowRight className="arrow-nudge mt-1 size-4 shrink-0 text-primary" />
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  );
}

function NavMenu({
  label,
  href,
  groups,
  open,
  suppressed,
  onOpen,
  onClose,
  onDismiss,
  onLeave,
  spotlightTitle,
  spotlightBody,
  spotlightTo,
  spotlightCta,
}: {
  label: string;
  href: AppPath;
  groups: NavGroup[];
  open: boolean;
  suppressed: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDismiss: () => void;
  onLeave: () => void;
  spotlightTitle: string;
  spotlightBody: string;
  spotlightTo: AppPath;
  spotlightCta: string;
}) {
  const columns = groups.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1";
  const panelId = `desktop-${label.toLowerCase()}-menu`;
  const toggleRef = useRef<HTMLButtonElement>(null);
  return (
    <div
      className="static py-4"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && !suppressed) onOpen();
      }}
      onPointerLeave={(event) => {
        // A pointer moving away must not hide the link a keyboard user is reading.
        if (!event.currentTarget.contains(document.activeElement)) onLeave();
      }}
      onFocus={(event) => {
        if (!suppressed && event.target instanceof HTMLAnchorElement) onOpen();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onLeave();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Escape" || !open) return;
        event.preventDefault();
        event.stopPropagation();
        onDismiss();
        toggleRef.current?.focus({ preventScroll: true });
      }}
    >
      <div className="flex items-center">
        <SmartLink
          to={href}
          className="nav-link flex min-h-12 items-center text-sm font-medium transition-colors duration-300 hover:text-primary"
        >
          {label}
        </SmartLink>
        <button
          type="button"
          ref={toggleRef}
          aria-label={`${open ? "Close" : "Open"} ${label} menu`}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => (open ? onClose() : onOpen())}
          className="flex size-11 items-center justify-center text-muted-foreground hover:text-primary"
        >
          <ChevronDown
            className={`size-4 transition-transform duration-300 ${open ? "rotate-180 text-primary" : ""}`}
          />
        </button>
      </div>
      <div
        id={panelId}
        hidden={!open}
        aria-hidden={!open}
        className={`mega-panel absolute inset-x-0 top-full z-40 ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"}`}
      >
        <div className="border-b border-border bg-background shadow-[0_28px_60px_-40px_rgba(11,13,18,0.55)]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px blue-line opacity-70"
          />
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-9 lg:grid-cols-[2.6fr_1fr] lg:px-8">
            <div className={`grid gap-x-8 gap-y-7 ${columns}`}>
              {groups.map((group) => (
                <div key={group.heading}>
                  <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                    {group.heading}
                  </p>
                  <div
                    className={`mt-4 grid gap-1 ${groups.length === 1 ? "sm:grid-cols-2 sm:gap-x-8" : ""}`}
                  >
                    {group.items.map((item) => (
                      <SmartLink
                        key={item.to}
                        to={item.to}
                        tabIndex={open ? 0 : -1}
                        className="group/item -mx-3 flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 transition-colors duration-300 hover:bg-secondary"
                      >
                        <span>
                          <span className="block text-sm font-medium transition-colors duration-300 group-hover/item:text-primary">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[0.8rem] leading-5 text-muted-foreground">
                            {item.note}
                          </span>
                        </span>
                        <ArrowRight className="mt-0.5 size-4 shrink-0 text-primary opacity-0 transition-all duration-300 group-hover/item:translate-x-1 group-hover/item:opacity-100" />
                      </SmartLink>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-between gap-5 border border-border bg-secondary/60 p-6">
              <div>
                <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-primary uppercase">
                  Where to start
                </p>
                <p className="mt-3 text-base leading-6 font-medium">{spotlightTitle}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{spotlightBody}</p>
              </div>
              <div className="grid gap-2">
                <SmartLink
                  to={spotlightTo}
                  tabIndex={open ? 0 : -1}
                  className="group/cta flex items-center justify-between text-sm font-medium text-primary"
                >
                  {spotlightCta}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
                </SmartLink>
                <SmartLink
                  to="/start-a-conversation"
                  tabIndex={open ? 0 : -1}
                  className="group/cta flex items-center justify-between border-t border-border pt-2 text-sm font-medium transition-colors duration-300 hover:text-primary"
                >
                  Bring us your challenge
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
                </SmartLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface-inverse text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-14 border-b border-primary-foreground/15 pb-14 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <ApprovedLogo
              lightAsset={approvedLogos.footerDark}
              location="footer"
              alt="Xyncwave Corporation LLP — Let's Connect. Digitally."
            />
            <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/65">
              Enterprise-grade thinking and modern technology execution for organizations solving
              complex operational and delivery problems.
            </p>
            <address className="mt-7 grid max-w-md gap-3 not-italic">
              <a
                href={`mailto:${companyContact.email}`}
                className="group/contact flex w-fit items-center gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="link-sweep">{companyContact.email}</span>
              </a>
              <a
                href={`tel:${companyContact.phoneHref}`}
                className="group/contact flex w-fit items-center gap-3 text-sm text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span className="link-sweep">{companyContact.phoneDisplay}</span>
              </a>
              <a
                href={companyMapUrl}
                target="_blank"
                rel="noreferrer"
                className="group/contact flex max-w-sm items-start gap-3 text-sm leading-6 text-primary-foreground/70 transition-colors hover:text-primary-foreground"
              >
                <MapPin className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {companyContact.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </a>
            </address>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <FooterCol
              title="Solutions"
              links={[
                ["Digital Transformation", "/solutions/digital-transformation"],
                ["Engineering Capacity", "/solutions/engineering-capacity"],
                ["AI & Automation", "/solutions/ai-automation"],
                ["Modernization", "/solutions/application-modernization"],
              ]}
            />
            <FooterCol
              title="Industries"
              links={[
                ["Logistics", "/industries/logistics"],
                ["Manufacturing", "/industries/manufacturing"],
                ["Healthcare", "/industries/healthcare"],
                ["Fintech", "/industries/fintech"],
              ]}
            />
            <FooterCol
              title="Resources"
              links={[
                ["Case Studies", "/case-studies"],
                ["Insights", "/insights"],
                ["Assessments", "/digitalization-assessment"],
              ]}
            />
            <FooterCol
              title="Company"
              links={[
                ["About", "/about"],
                ["Why XWC", "/why-xyncwave"],
                ["Contact", "/contact"],
                ["Privacy", "/privacy"],
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 pt-7 text-xs text-primary-foreground/55 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Xyncwave Corporation LLP.</p>
          <div className="flex gap-5">
            <SmartLink to="/privacy">Privacy</SmartLink>
            <SmartLink to="/terms">Terms</SmartLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
type FooterPath = AppPath;
function ApprovedLogo({
  lightAsset,
  darkAsset,
  location,
  alt = "Xyncwave Corporation LLP",
}: {
  lightAsset: string;
  darkAsset?: string;
  location: "header" | "footer";
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed && import.meta.env.DEV)
    return (
      <span
        className={`flex border border-dashed border-current/35 px-3 text-[0.6rem] leading-4 ${location === "header" ? "h-10 items-center text-[#0B0D12]" : "min-h-10 max-w-48 items-center text-primary-foreground/70"}`}
      >
        Approved brand asset unavailable in local preview
      </span>
    );

  const imageClass =
    location === "header"
      ? "h-9 w-auto max-w-full object-contain sm:h-10"
      : "h-14 w-auto max-w-full object-contain sm:h-16";

  return (
    <span className={`approved-logo approved-logo--${location}`}>
      <img
        src={lightAsset}
        alt={alt}
        onError={() => setFailed(true)}
        className={`${imageClass} ${darkAsset ? "approved-logo__light" : ""}`}
      />
      {darkAsset ? (
        <img
          src={darkAsset}
          alt={alt}
          onError={() => setFailed(true)}
          className={`${imageClass} approved-logo__dark`}
        />
      ) : null}
    </span>
  );
}
function FooterCol({
  title,
  links,
}: {
  title: string;
  links: readonly (readonly [string, FooterPath])[];
}) {
  return (
    <div>
      <h2 className="text-xs font-medium text-primary-foreground">{title}</h2>
      <ul className="mt-4 space-y-3">
        {links.map(([label, to]) => (
          <li key={to}>
            <SmartLink
              to={to}
              className="link-sweep text-sm text-primary-foreground/65 transition-colors duration-300 hover:text-primary-foreground"
            >
              {label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function StickyMobileCTA() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const route = pathname.replace(/\/+$/, "") || "/";
  if (
    /^\/(contact|start-a-conversation|digitalization-assessment|ai-opportunity-assessment|engineering-capacity-assessment)$/.test(
      route,
    ) ||
    /^\/industries\/[^/]+$/.test(route) ||
    /^\/insights\/[^/]+$/.test(route) ||
    route === "/search" ||
    route.startsWith("/thank-you/")
  )
    return null;
  return (
    <div className="mobile-conversion-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background p-3 lg:hidden">
      <Button className="w-full" asChild>
        <SmartLink to="/start-a-conversation">
          Tell Us Your Challenge <ArrowRight />
        </SmartLink>
      </Button>
    </div>
  );
}
