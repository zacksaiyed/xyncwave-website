import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type FormEvent } from "react";
import { useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FileText, ArrowRight, LoaderCircle, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { DESKTOP_QUERY, EXIT_ROUTES, exitEligible, touchPromptEligible, isBusinessEmail, RATE_CARD_ASSET, RATE_CARD_CTAS } from "../lib/rate-card";
import { requestRateCard } from "../lib/rate-card.functions";
import { track } from "../lib/analytics";

type Placement = "popup" | "inline";
const CaptureContext = createContext<(placement: Placement) => void>(() => {});
function readTime(key: string) { try { return Number(localStorage.getItem(key)) || 0; } catch { return 0; } }
function saveTime(key: string) { try { localStorage.setItem(key, String(Date.now())); } catch { /* Storage denied: session restriction still applies. */ } }
function cleanSource() { return `${window.location.origin}${window.location.pathname}`; }
function properties(placement: Placement) { return { asset_id: RATE_CARD_ASSET, source_page: window.location.pathname, placement, content_group: window.location.pathname.split("/")[1] }; }

export function RateCardCaptureProvider({ children }: { children: ReactNode }) {
  const path = useLocation({ select: location => location.pathname });
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("inline");
  const sessionShown = useRef(false);
  const lastPrompt = useRef(0);
  const previousFocus = useRef<HTMLElement | null>(null);
  const openCapture = (method: Placement) => {
    if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lastPrompt.current = Date.now();
    setPlacement(method); setOpen(true);
    if (method === "popup") track("rate_card_popup_view", properties(method));
  };
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    if (!EXIT_ROUTES.includes(path)) return;
    const started = Date.now();
    let maxScroll = 0;
    let formFocused = false;
    let lastInteraction = 0;
    const scroll = () => { const total = document.documentElement.scrollHeight - innerHeight; if (total > 0) maxScroll = Math.max(maxScroll, scrollY / total); };
    const focus = (event: FocusEvent) => { formFocused = event.target instanceof Element && !!event.target.closest("form, #article-assessment"); if (formFocused) lastInteraction = Date.now(); };
    const observe = new MutationObserver(() => { if (document.querySelector('[role="dialog"], [role="alertdialog"]')) lastPrompt.current = Date.now(); });
    observe.observe(document.body, { childList: true, subtree: true });
    const leave = (event: MouseEvent) => {
      if (event.relatedTarget !== null || event.clientY > 5 || open || formFocused || Date.now() - lastInteraction < 60_000 || Date.now() - lastPrompt.current < 60_000 || document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
      let shown = sessionShown.current;
      try { shown ||= sessionStorage.getItem("xwc-rate-card-shown") === "1"; } catch { /* Session ref remains authoritative. */ }
      if (!exitEligible({ path, desktop: matchMedia(DESKTOP_QUERY).matches, seconds: (Date.now() - started) / 1000, scroll: maxScroll, sessionShown: shown, dismissedAt: readTime("xwc-rate-card-dismissed"), requestedAt: readTime("xwc-rate-card-requested"), now: Date.now() })) return;
      sessionShown.current = true;
      try { sessionStorage.setItem("xwc-rate-card-shown", "1"); } catch { /* In-memory fallback. */ }
      openCapture("popup");
    };
    document.addEventListener("mouseout", leave); window.addEventListener("scroll", scroll, { passive: true }); document.addEventListener("focusin", focus);
    return () => { observe.disconnect(); document.removeEventListener("mouseout", leave); window.removeEventListener("scroll", scroll); document.removeEventListener("focusin", focus); };
  }, [path, open]);
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    setNudge(false);
    if (!EXIT_ROUTES.includes(path) || matchMedia(DESKTOP_QUERY).matches) return;
    const check = () => {
      const total = document.documentElement.scrollHeight - innerHeight;
      if (total <= 0) return;
      let shown = sessionShown.current;
      try { shown ||= sessionStorage.getItem("xwc-rate-card-shown") === "1"; } catch { /* Session ref remains authoritative. */ }
      if (!touchPromptEligible({ path, scroll: scrollY / total, sessionShown: shown, dismissedAt: readTime("xwc-rate-card-dismissed"), requestedAt: readTime("xwc-rate-card-requested"), now: Date.now() })) return;
      if (document.querySelector('[role="dialog"], [role="alertdialog"]')) return;
      sessionShown.current = true;
      try { sessionStorage.setItem("xwc-rate-card-shown", "1"); } catch { /* In-memory fallback. */ }
      setNudge(true); track("rate_card_popup_view", properties("popup"));
      window.removeEventListener("scroll", check);
    };
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [path]);
  const dismissNudge = () => { setNudge(false); saveTime("xwc-rate-card-dismissed"); track("rate_card_popup_dismiss", properties("popup")); };
  const close = (value: boolean) => {
    if (!value) {
      lastPrompt.current = Date.now();
      if (placement === "popup") { saveTime("xwc-rate-card-dismissed"); track("rate_card_popup_dismiss", properties(placement)); }
    }
    setOpen(value);
  };
  return <CaptureContext.Provider value={openCapture}>{children}<Dialog open={open} onOpenChange={close}><DialogContent className="rate-card-dialog max-h-[calc(100dvh-32px)] w-[calc(100%-32px)] max-w-[460px] overflow-y-auto p-7 sm:p-8" onCloseAutoFocus={event => { event.preventDefault(); previousFocus.current?.focus(); }}><FileText className="size-6 text-primary" aria-hidden="true"/><p className="text-xs font-medium text-muted-foreground">XYNCWAVE | RESOURCE GUIDE</p><DialogTitle className="text-2xl leading-tight">Planning Your Engineering Capacity?</DialogTitle><DialogDescription className="leading-6">Get Xyncwave's Engineering Resource Rate Card with indicative monthly pricing for Junior, Mid-Level and Senior developers.</DialogDescription><ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground"><li>Monthly USD rates</li><li>Flexible engineering support</li></ul><RateCardLeadForm key={`${path}-${open}`} placement={placement}/></DialogContent></Dialog>{nudge && !open && <aside aria-label="Engineering rate card" className="rate-card-nudge fixed inset-x-3 bottom-3 z-50 border border-border bg-background p-4 shadow-lg"><button type="button" onClick={dismissNudge} aria-label="Dismiss" className="absolute right-2 top-2 p-1 text-muted-foreground"><X className="size-4"/></button><div className="flex items-start gap-3 pr-6"><FileText className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true"/><div><p className="text-sm font-semibold leading-5">Planning Your Engineering Capacity?</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Get indicative monthly rates for Junior, Mid-Level and Senior developers.</p><Button size="sm" className="mt-3" onClick={() => { setNudge(false); openCapture("popup"); }}>Get the Rate Card <ArrowRight/></Button></div></div></aside>}</CaptureContext.Provider>;
}

function RateCardLeadForm({ placement }: { placement: Placement }) {
  const submit = useServerFn(requestRateCard);
  const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const submitting = useRef(false); const id = useRef<string | null>(null);
  const send = async (event: FormEvent) => {
    event.preventDefault(); if (submitting.current) return;
    if (!isBusinessEmail(email)) { setError("Please use a valid business email, rather than a personal or disposable address."); return; }
    submitting.current = true; setBusy(true); setError("");
    id.current ??= crypto.randomUUID();
    const params = new URLSearchParams(location.search); const attribution: Record<string, string> = {};
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) { const value = params.get(key); if (value) attribution[key] = value.slice(0, 300); }
    track("rate_card_submit", properties(placement));
    try {
      const result = await submit({ data: { businessEmail: email, phone: phone || undefined, sourcePage: cleanSource(), placement, requestId: id.current, website, attribution } });
      setError(result.error);
    } catch { setError("We couldn't accept your request right now. Please try again later."); }
    finally { submitting.current = false; setBusy(false); }
  };
  return <form onSubmit={send} className="mt-2 space-y-5"><div className="space-y-2"><Label htmlFor="rc-email">Business Email *</Label><Input id="rc-email" type="email" required autoComplete="email" placeholder="you@company.com" maxLength={255} value={email} onChange={event => setEmail(event.target.value)} aria-describedby={error ? "rc-error" : undefined}/></div><div className="space-y-2"><Label htmlFor="rc-phone">Phone Number (Optional)</Label><Input id="rc-phone" type="tel" autoComplete="tel" maxLength={40} value={phone} onChange={event => setPhone(event.target.value)}/></div><div className="sr-only" aria-hidden="true"><label htmlFor="rc-website">Website</label><input id="rc-website" tabIndex={-1} autoComplete="off" value={website} onChange={event => setWebsite(event.target.value)}/></div>{error && <p id="rc-error" role="alert" className="text-sm leading-6 text-destructive">{error}</p>}<Button type="submit" className="w-full" size="lg" disabled={busy}>{busy ? <><LoaderCircle className="size-4 motion-safe:animate-spin"/>Submitting…</> : <>Send Me the Rate Card<ArrowRight className="size-4"/></>}</Button><p className="text-xs leading-5 text-muted-foreground">We'll email the PDF to your business inbox. No unrelated marketing emails without your consent.</p></form>;
}

export function RateCardInlineCTA({ slug, after }: { slug: string; after: string }) {
  const open = useContext(CaptureContext); const ref = useRef<HTMLElement>(null); const cta = RATE_CARD_CTAS[slug];
  useEffect(() => {
    if (!cta || cta.after !== after || !ref.current) return;
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { track("rate_card_cta_view", properties("inline")); observer.disconnect(); } }, { threshold: .4 });
    observer.observe(ref.current); return () => observer.disconnect();
  }, [slug, after, cta]);
  if (!cta || cta.after !== after) return null;
  return <aside ref={ref} className="my-10 border border-border bg-background p-6 sm:p-8" aria-label="Engineering resource rate card"><FileText className="mb-4 size-5 text-primary" aria-hidden="true"/><h3 className="text-xl font-medium">{cta.heading}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{cta.body}</p><Button className="mt-5 h-auto max-w-full whitespace-normal py-3 text-left" onClick={() => { track("rate_card_cta_click", properties("inline")); open("inline"); }}>{cta.button}<ArrowRight className="size-4 shrink-0"/></Button></aside>;
}