import { Globe } from "lucide-react";
import { SmartLink } from "./app-link";
import { track } from "../lib/analytics";

const regions = [
  { to: "/solutions/erpnext-implementation", label: "Global", lang: "en" },
  { to: "/gcc/erpnext-implementation", label: "GCC", lang: "en" },
  { to: "/de/erpnext-implementierung", label: "Deutschland", lang: "de" },
  { to: "/ar/erpnext-implementation", label: "العربية", lang: "ar" },
] as const;

const heading = { en: "Region & language", de: "Region & Sprache", ar: "المنطقة واللغة" } as const;

export function ERPNextRegionSwitcher({ current, lang = "en" }: { current: string; lang?: keyof typeof heading }) {
  return <nav aria-label={heading[lang]} className="mb-8 flex flex-wrap items-center gap-3">
    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground"><Globe className="size-4" />{heading[lang]}</span>
    <ul className="flex flex-wrap border border-border">
      {regions.map(r => { const active = r.to === current; return <li key={r.to} className="border-border not-first:ltr:border-l not-first:rtl:border-r">
        <SmartLink to={r.to} lang={r.lang} hrefLang={r.lang} aria-current={active ? "page" : undefined} onClick={() => track("cta_click", { interest: "erpnext", page: current, placement: `region-switcher-${r.lang}` })}
          className={`block px-4 py-2 text-sm transition-colors ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"}`}>{r.label}</SmartLink>
      </li>; })}
    </ul>
  </nav>;
}
