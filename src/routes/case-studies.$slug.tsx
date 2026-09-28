import { createFileRoute, notFound } from "@tanstack/react-router";
import { Check, ArrowDown } from "lucide-react";
import { Breadcrumbs, CTASection, Eyebrow, SectionIntro } from "../components/page-sections";
import { ContinueExploring } from "../components/continue-exploring";
import { pageHead } from "../lib/seo";
import { getCaseStudy, type CaseStudy, type DeepDive } from "../lib/case-studies";
import { SmartLink } from "../components/app-link";
import { SolutionOutcome } from "../components/solution-outcome";

export const Route = createFileRoute("/case-studies/$slug")({
  loader: ({ params }) => {
    const study = getCaseStudy(params.slug);
    if (!study) throw notFound();
    return { slug: study.slug };
  },
  head: ({ params }) => {
    const s = getCaseStudy(params.slug);
    return s ? pageHead(s.metaTitle, s.metaDescription, `/case-studies/${s.slug}`, "article") : {};
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useLoaderData();
  const s = getCaseStudy(slug) as CaseStudy;
  return <>
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Case studies", to: "/case-studies" }, { label: s.crumb }]} />
    <section className="bg-surface-hero"><div className="mx-auto flex min-h-[520px] max-w-7xl items-center px-5 py-16 lg:px-8 lg:py-20"><div className="min-w-0 max-w-4xl"><Eyebrow>{s.eyebrow}</Eyebrow><h1 className="hero-title">{s.title}</h1><p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground">{s.heroDescription}</p></div></div></section>
    <section className="py-section"><div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.72fr_1.28fr] lg:px-8"><SectionIntro eyebrow="Project context" title={s.contextTitle} /><div className="grid gap-8 sm:grid-cols-2">{s.context.map(([l, v]) => <Fact key={l} label={l} value={v} />)}</div></div></section>
    <section className="bg-secondary py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="The challenge" title={s.challengeTitle} body={s.challengeBody} /><div className="mt-14 grid border-t border-border md:grid-cols-2">{s.challenges.map((c, i) => <div key={c.title} className="border-b border-border py-9 md:px-9 md:odd:border-r md:odd:pl-0"><span className="text-xs font-bold text-primary">0{i + 1}</span><p className="mt-6 text-xl font-semibold leading-8">{c.title}</p>{c.body && <p className="mt-3 leading-7 text-muted-foreground">{c.body}</p>}</div>)}</div></div></section>
    <section className="bg-surface-inverse py-section text-primary-foreground"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><div><Eyebrow>The solution</Eyebrow><h2 className="editorial-title">{s.solutionTitle}</h2><p className="mt-7 max-w-xl text-lg leading-8 text-primary-foreground/65">{s.solutionBody}</p></div><div className="grid border-y border-primary-foreground/15 sm:grid-cols-2">{s.capabilities.map(x => <div key={x} className="flex gap-3 border-b border-primary-foreground/15 py-6 sm:px-6"><Check className="mt-1 size-5 shrink-0 text-primary" /><span className="font-semibold">{x}</span></div>)}</div></div><div className={`mt-16 grid grid-cols-2 gap-px bg-primary-foreground/15 sm:grid-cols-4 ${s.steps.length === 6 ? "lg:grid-cols-6" : "lg:grid-cols-7"}`}>{s.steps.map((x, i) => <div className="bg-surface-inverse p-5" key={x}><span className="text-xs text-primary">0{i + 1}</span><p className="mt-4 font-semibold">{x}</p></div>)}</div></div></section>
    <Architecture s={s} />
    {s.journey && <Journey j={s.journey} />}
    {s.deepDives?.map(d => <DeepDiveSection key={d.title} d={d} />)}
    <section className="bg-secondary py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-14 lg:grid-cols-2"><div><SectionIntro eyebrow="How it works" title={s.howTitle} body={s.howBody} /><ul className="mt-10 flex flex-wrap gap-2" aria-label="Technology">{s.tags.map(t => <li key={t} className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium">{t}</li>)}</ul></div><div className="border-l-2 border-primary pl-7"><p className="text-xs font-bold uppercase text-muted-foreground">{s.outcomesLabel}</p><ul className="mt-6 space-y-4">{s.outcomes.map(x => <li key={x} className="flex gap-3 leading-7"><Check className="mt-1 size-5 shrink-0 text-primary" />{x}</li>)}</ul></div></div></div></section>
    {s.outcomeCards && <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow={s.outcomesLabel} title="What changed structurally" /><div className="mt-12 grid border-t border-border sm:grid-cols-2 lg:grid-cols-4">{s.outcomeCards.map(([t, b], i) => <div key={t} className="border-b border-border py-8 sm:px-6"><span className="text-xs font-bold text-primary">0{i + 1}</span><h3 className="mt-5 text-lg font-semibold leading-7">{t}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{b}</p></div>)}</div></div></section>}
    <SolutionOutcome intro={s.solutionOutcome.intro} outcomes={s.solutionOutcome.outcomes} />
    <ContinueExploring title="Connected thinking for this challenge" items={s.explore} />
    <CTASection title={s.ctaTitle} body={s.ctaBody} cta={s.cta} />
  </>;
}

function Architecture({ s }: { s: CaseStudy }) {
  const a = s.architecture;
  return <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]"><SectionIntro eyebrow="Architecture" title={a.title} /><figure className="min-w-0"><div role="img" aria-label={a.caption} className="flex flex-col items-stretch">{a.flow.map((n, i) => <div key={i} className="flex flex-col items-center">{i > 0 && <ArrowDown className="my-2 size-4 text-primary" aria-hidden="true" />}{"group" in n ? <div className={`grid w-full gap-3 ${n.group.length > 2 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2"}`}>{n.group.map((g, gi) => <div key={g} className="system-node text-center"><span className="font-semibold">{g}</span>{n.details?.[gi] && <span className="mt-1 block text-xs leading-5 text-muted-foreground">{n.details[gi]}</span>}</div>)}</div> : <div className="system-node w-full text-center"><span className="font-semibold">{n.label}</span>{n.sub && <span className="mt-1 block text-xs text-muted-foreground">{n.sub}</span>}</div>}</div>)}{a.feedback && <p className="mt-4 border-l-2 border-primary pl-4 text-sm text-muted-foreground">↺ {a.feedback}</p>}{a.aside && <div className="mt-6 border-t border-border pt-5"><p className="text-xs font-bold uppercase text-primary">{a.aside.title}</p><div className="mt-3 flex flex-wrap gap-2">{a.aside.items.map(x => <span key={x} className="system-node system-node-muted">{x}</span>)}</div></div>}</div><figcaption className="mt-5 text-xs leading-5 text-muted-foreground">{a.caption}</figcaption></figure></div></div></section>;
}

function Fact({ label, value }: { label: string; value: string }) { return <div className="border-t border-border pt-5"><p className="text-xs font-bold uppercase text-primary">{label}</p><p className="mt-3 text-lg font-semibold leading-7">{value}</p></div>; }

function Flow({ steps }: { steps: string[] }) { return <ol className="flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center">{steps.map((x, i) => <li key={x} className="flex flex-col items-stretch gap-2 md:flex-row md:items-center">{i > 0 && <ArrowDown className="mx-auto size-4 text-primary md:-rotate-90" aria-hidden="true" />}<span className="system-node text-center text-sm font-semibold">{x}</span></li>)}</ol>; }

function Journey({ j }: { j: NonNullable<CaseStudy["journey"]> }) {
  return <section className="bg-secondary py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="End-to-end customer journey" title={j.title} /><ol className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-5">{j.steps.map(([t, b], i) => <li key={t} className="bg-secondary p-6"><span className="text-xs font-bold text-primary">{String(i + 1).padStart(2, "0")}</span><p className="mt-4 font-semibold">{t}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">{b}</p></li>)}</ol></div></section>;
}

function DeepDiveSection({ d }: { d: DeepDive }) {
  return <section className={`py-section ${d.tone === "muted" ? "bg-secondary" : ""}`}><div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div><Eyebrow>{d.eyebrow}</Eyebrow><h2 className="editorial-title">{d.title}</h2></div><div className="min-w-0">{d.body.map(p => <p key={p} className="mb-5 text-lg leading-8 text-muted-foreground">{p}</p>)}
    {d.list && <ul className="mt-6 grid gap-x-8 border-t border-border sm:grid-cols-2">{d.list.map(x => <li key={x} className="flex gap-3 border-b border-border py-4 font-semibold"><Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />{x}</li>)}</ul>}
    {d.flow && <figure className="mt-8">{d.flowLabel && <figcaption className="mb-4 text-xs font-bold uppercase text-primary">{d.flowLabel}</figcaption>}<Flow steps={d.flow} />{d.split && <><ArrowDown className="mx-auto my-3 size-4 text-primary md:mx-0" aria-hidden="true" /><div className="grid gap-4 sm:grid-cols-2">{d.split.map(p => <div key={p.title} className="border-l-2 border-primary pl-5"><p className="mb-3 text-xs font-bold uppercase text-muted-foreground">{p.title}</p><Flow steps={p.steps} /></div>)}</div></>}</figure>}
    {d.link && <SmartLink to={d.link.to} className="mt-6 inline-flex font-semibold text-primary hover:underline">{d.link.label} →</SmartLink>}
  </div></div></section>;
}
