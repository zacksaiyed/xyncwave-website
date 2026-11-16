import { useEffect } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Breadcrumbs, Eyebrow } from "./page-sections";
import { ContinueExploring } from "./continue-exploring";
import { ERPNextEnquiry } from "./erpnext-enquiry";
import { ERPNextRegionSwitcher } from "./erpnext-region-switcher";
import { inline } from "./erpnext-pillar";
import { track } from "../lib/analytics";
import type { PillarBlock } from "../lib/erpnext-pillar";
import type { ERPDoc } from "../lib/erpnext-docs/types";
import { erpnextArticleMedia } from "../lib/media-registry";
import { DigitalVisual } from "./digital-visuals";

const ui = {
  en: { toc: "On this page", summary: "Short answer", takeaways: "Key takeaways", faq: "Frequently asked questions", sources: "Official sources and documentation", form: "Start the conversation", by: "Written by", related: "Connected thinking" },
  de: { toc: "Auf dieser Seite", summary: "Kurz beantwortet", takeaways: "Das Wichtigste in Kürze", faq: "Häufige Fragen", sources: "Offizielle Quellen und Dokumentation", form: "Gespräch beginnen", by: "Autor", related: "Weiterführend" },
  ar: { toc: "محتويات الصفحة", summary: "الإجابة المختصرة", takeaways: "أهم النقاط", faq: "الأسئلة الشائعة", sources: "المصادر الرسمية والوثائق", form: "ابدأ المحادثة", by: "إعداد", related: "محتوى ذو صلة" },
} as const;

export function ERPNextDocument({ doc }: { doc: ERPDoc }) {
  const t = ui[doc.lang];
  const rtl = doc.lang === "ar";
  useEffect(() => { track("page_view", { page: doc.path, interest: "erpnext", language: doc.lang }); }, [doc.path, doc.lang]);
  const cta = (placement: string, label = doc.cta) => <Button size="lg" asChild className="h-auto max-w-full whitespace-normal py-4"><a href="#erpnext-fit-review" onClick={() => track("cta_click", { interest: "erpnext", page: doc.path, placement })}>{label}<ArrowRight className="shrink-0 rtl:rotate-180" /></a></Button>;
  const toc = [...doc.sections.map(s => ({ id: s.id, title: s.title })), ...(doc.faq.length ? [{ id: "faq", title: t.faq }] : []), { id: "erpnext-fit-review", title: t.form }];
  return <div lang={doc.lang} dir={rtl ? "rtl" : "ltr"}>
    <Breadcrumbs items={doc.breadcrumbs} />
    <section className="bg-surface-hero"><div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <ERPNextRegionSwitcher current={doc.path} lang={doc.lang} />
      <Eyebrow>{doc.eyebrow}</Eyebrow>
      <h1 className="hero-title max-w-5xl">{doc.title}</h1>
      {doc.tagline && <p className="mt-6 text-xl font-medium">{doc.tagline}</p>}
      {doc.lead.map((p, i) => <p key={i} className="mt-5 max-w-3xl leading-8 text-muted-foreground">{inline(p)}</p>)}
      {doc.author && <p className="mt-6 text-sm text-muted-foreground">{t.by}: <span className="font-medium text-foreground">{doc.author}</span></p>}
      <div className="mt-7 flex flex-wrap gap-3">{cta("hero")}{doc.secondary && <Button asChild variant="outline" size="lg" className="h-auto whitespace-normal py-4"><a href={doc.secondary.href}>{doc.secondary.label}<ArrowDown className="shrink-0" /></a></Button>}</div>
    </div></section>
    {erpnextArticleMedia[doc.path] && <div className="mx-auto max-w-7xl px-5 pt-10 lg:px-8"><DigitalVisual media={erpnextArticleMedia[doc.path]} eager className="aspect-[16/7] rounded-none border-0" /></div>}
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
      <aside className="min-w-0">
        <nav aria-label={t.toc} className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto border-border pe-2 lg:block ltr:border-l rtl:border-r"><p className="mb-4 ps-4 text-xs font-medium text-muted-foreground">{t.toc}</p>{toc.map(s => <a key={s.id} href={`#${s.id}`} className="block px-4 py-2 text-xs leading-5 text-muted-foreground hover:text-primary">{s.title}</a>)}</nav>
        <details className="border-y border-border py-5 lg:hidden"><summary className="cursor-pointer font-medium">{t.toc}</summary><nav aria-label={t.toc} className="mt-4 grid gap-3">{toc.map(s => <a key={s.id} href={`#${s.id}`} className="text-sm text-muted-foreground">{s.title}</a>)}</nav></details>
      </aside>
      <div className="min-w-0 max-w-[800px]">
        {(doc.summary || doc.takeaways) && <section className="mb-12 border-y border-border py-8">
          {doc.summary && <><h2 className="text-sm font-medium text-primary">{t.summary}</h2><p className="mt-3 text-lg leading-8">{inline(doc.summary)}</p></>}
          {doc.takeaways && <><h2 className="mt-8 text-sm font-medium text-primary">{t.takeaways}</h2><ul className="mt-4 list-disc space-y-3 ps-6 leading-7 text-muted-foreground">{doc.takeaways.map((k, i) => <li key={i}>{inline(k)}</li>)}</ul></>}
        </section>}
        {doc.sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-28 border-b border-border pb-12 not-first:pt-12"><h2 className="mb-6 text-2xl font-medium leading-tight sm:text-3xl">{section.title}</h2><div className="space-y-5">{section.blocks.map((block, i) => <Block key={i} block={block} cta={cta} />)}</div></section>)}
        {doc.faq.length > 0 && <section id="faq" className="scroll-mt-28 border-b border-border py-12"><h2 className="text-2xl font-medium sm:text-3xl">{t.faq}</h2><div className="mt-6 divide-y divide-border border-y border-border">{doc.faq.map(([q, a]) => <details key={q} className="group py-6"><summary className="flex cursor-pointer list-none justify-between gap-6 font-semibold">{q}<span className="text-primary transition-transform group-open:rotate-45">+</span></summary><p className="mt-4 leading-7 text-muted-foreground">{inline(a)}</p></details>)}</div></section>}
        <section id="erpnext-fit-review" className="scroll-mt-28 py-12"><Eyebrow>{t.form}</Eyebrow><h2 className="text-3xl font-medium">{doc.cta}</h2><p className="mb-8 mt-5 leading-8 text-muted-foreground">{doc.ctaBody}</p><ERPNextEnquiry page={doc.path} lang={doc.lang} submitLabel={doc.cta} /></section>
        <section className="border-t border-border py-12"><h2 className="text-2xl font-medium">{t.sources}</h2><ul className="mt-5 space-y-3 text-sm">{doc.sources.map(([label, url]) => <li key={url}><a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{label}</a></li>)}</ul></section>
      </div>
    </div>
    <ContinueExploring title={doc.relatedTitle} items={doc.related} />
  </div>;
}

function Block({ block, cta }: { block: PillarBlock; cta: (placement: string, label?: string) => React.ReactNode }) {
  if (block.kind === "heading") return <h3 className="pt-4 text-xl font-medium">{block.text}</h3>;
  if (block.kind === "cta") return <>{cta("section", block.text)}</>;
  if (block.kind === "list") return <ul className="list-disc space-y-3 ps-6 leading-8 text-muted-foreground">{block.items.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>;
  if (block.kind === "table") return <div className="overflow-x-auto border-y border-border"><table className="w-full min-w-[600px] text-start text-sm leading-7"><thead><tr>{block.rows[0]?.map(cell => <th className="border-b border-border bg-secondary p-4 text-start font-medium" key={cell}>{cell}</th>)}</tr></thead><tbody>{block.rows.slice(1).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j} className="border-b border-border p-4 align-top text-muted-foreground">{inline(cell)}</td>)}</tr>)}</tbody></table></div>;
  return <p className="leading-8 text-muted-foreground">{inline(block.text)}</p>;
}
