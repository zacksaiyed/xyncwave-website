import type { PageDepth } from "../lib/solution-depth";
import { SectionIntro } from "./page-sections";

export function DepthSections({ depth }: { depth: PageDepth | undefined }) {
  if (!depth) return null;
  return <>
    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <SectionIntro eyebrow="Technical considerations" title={depth.considerationsTitle} />
      <div className="mt-12 grid border-t border-border md:grid-cols-2">{depth.considerations.map((item, i) => <div key={item.title} className="border-b border-border py-8 md:px-8 md:odd:border-r md:odd:pl-0">
        <span className="text-xs font-medium text-primary">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="mt-5 text-xl font-medium">{item.title}</h3>
        <p className="mt-3 leading-7 text-muted-foreground">{item.body}</p>
      </div>)}</div>
    </div></section>
    <section className="bg-secondary py-section"><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
      <div><SectionIntro eyebrow="Before starting" title="What to evaluate first" />
        <div className="mt-10 grid gap-px border border-border bg-border">{depth.evaluate.map((item) => <div key={item.title} className="bg-background p-7"><h3 className="text-lg font-medium">{item.title}</h3><p className="mt-2 leading-7 text-muted-foreground">{item.body}</p></div>)}</div>
      </div>
      <div><p className="text-xs font-medium text-primary">Illustrative examples</p><h2 className="mt-5 text-3xl font-medium leading-tight">What this can look like</h2><p className="mt-4 text-sm leading-6 text-muted-foreground">Typical scenarios, shown to illustrate the kind of work involved.</p>
        <ul className="mt-8 border-t border-border">{depth.illustrative.map((item, i) => <li key={item} className="flex gap-4 border-b border-border py-5"><span className="text-xs font-medium text-primary">{String(i + 1).padStart(2, "0")}</span><span className="font-medium">{item}</span></li>)}</ul>
      </div>
    </div></section>
  </>;
}
