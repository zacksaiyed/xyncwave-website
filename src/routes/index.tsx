import { getInsightMedia, getCaseStudyMedia, caseStudyMedia, type MediaEntry } from "../lib/media-registry";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Network, Layers, Users, Cpu } from "lucide-react";

// Hero media from public directory
const heroPosterUrl = "/xwc-hero-motion-poster.jpg";
const heroVideoUrl = "/xwc-hero-motion-1920.mp4";
// Transformation model diagram
const systemMapUrl = "/xwc-transformation-model.png";

const problemIcons = [Network, Layers, Users, Cpu];
import { SmartLink } from "../components/app-link";
import { Button } from "../components/ui/button";
import { CTASection, Eyebrow, SectionIntro } from "../components/page-sections";
import { DigitalVisual } from "../components/digital-visuals";
import { articles } from "../lib/content";
import { pageHead } from "../lib/seo";
import { SITE_ORIGIN } from "../lib/site-origin";

export const Route = createFileRoute("/")({
  head: () => ({ ...pageHead("Digital transformation for complex operations", "Xyncwave turns fragmented operations, delivery constraints, AI uncertainty, and legacy technology into practical connected systems.", "/"), scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context":"https://schema.org", "@type":"Organization", name:"Xyncwave Corporation LLP", url:SITE_ORIGIN }) }] }),
  component: HomePage,
});

const problems = [
  { title:"Fragmented operations", body:"Too many spreadsheets. Too many systems. Too many manual handoffs.", action:"Explore Digitalization", to:"/solutions/digital-transformation" },
  { title:"Legacy technology", body:"The system still works—but every change costs more than it should.", action:"Discuss Modernization", to:"/solutions/application-modernization" },
  { title:"Engineering constraints", body:"Demand is growing faster than the team can deliver.", action:"Discuss Engineering Capacity", to:"/solutions/engineering-capacity" },
  { title:"AI uncertainty", body:"Everyone is talking about AI. You need to know where it actually creates value.", action:"Find Your AI Opportunity", to:"/ai-opportunity-assessment" },
] as const;

const choices = [
  ["Our operations are too manual", "Start with the workflow", "/digitalization-assessment"],
  ["Our systems do not connect", "Map the integration gaps", "/solutions/integration"],
  ["Our technology is difficult to maintain", "Explore modernization options", "/solutions/application-modernization"],
  ["We need more engineering capacity", "Clarify the delivery model", "/engineering-capacity-assessment"],
  ["We want to use AI but do not know where", "Find a practical opportunity", "/ai-opportunity-assessment"],
  ["We need to modernize our platform", "Identify what should change", "/solutions/cloud-platform-engineering"],
  ["We need a technology partner", "Talk through the requirement", "/technology-partnership"],
] as const;

const featuredSlugs = ["fintech-what-to-outsource", "business-case-process-digitalization", "ai-workflow-automation"];
const featuredInsights = featuredSlugs
  .map((slug) => articles.find((article) => article.slug === slug))
  .filter((article): article is (typeof articles)[number] => Boolean(article));

function HomePage() { return <div className="home-live">
  <section className="relative overflow-hidden bg-surface-hero">
    <div className="architectural-grid absolute inset-0 opacity-25"/>
    <div aria-hidden="true" className="home-motion pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] md:block"><video className="h-full w-full object-cover" poster={heroPosterUrl} autoPlay loop muted playsInline preload="metadata" disablePictureInPicture tabIndex={-1}><source src={heroVideoUrl} type="video/mp4"/></video></div>
    <p className="absolute right-5 top-8 z-10 hidden items-center gap-3 text-[11px] font-medium tracking-[0.2em] text-muted-foreground before:h-px before:w-7 before:bg-primary md:flex lg:right-8">LET'S CONNECT. <strong className="text-primary">DIGITALLY.</strong></p>
    <div className="relative mx-auto grid min-h-[600px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-20"><div>
      <Eyebrow>Digital transformation · Modern engineering</Eyebrow>
      <h1 className="hero-title max-w-3xl">What technology challenge is holding <span className="text-primary">your business</span> back?</h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-muted-foreground sm:text-xl">From fragmented operations to overloaded engineering teams, Xyncwave helps organizations turn technology challenges into practical digital systems that move the business forward.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button size="lg" asChild><SmartLink to="/start-a-conversation">Tell Us What You're Trying to Solve <ArrowRight/></SmartLink></Button><Button size="lg" variant="outline" asChild><a href="#challenges">Explore the Challenges We Solve <ArrowRight/></a></Button></div>
      <p className="mt-4 text-xs text-muted-foreground">No sales pitch. Start with the problem.</p>
    </div><div/></div>
  </section>

  <section id="challenges" className="home-challenges py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="max-w-3xl [&_h2]:max-w-xl"><SectionIntro eyebrow="Problem recognition" title="The technology problem usually isn't the technology." body="It is the disconnected process, the legacy system, the delivery bottleneck, or the uncertainty about what to change next."/></div><div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{problems.map((p,i)=>{const Icon=problemIcons[i] ?? Network;return <SmartLink key={p.title} to={p.to} className="hover-card home-problem-card group flex flex-col border border-border bg-background p-6 sm:p-7"><div className="flex items-center justify-between"><span className="grid size-11 place-items-center border border-border bg-secondary text-primary"><Icon className="size-5" strokeWidth={1.6}/></span><span className="text-xs font-medium text-muted-foreground">0{i+1}</span></div><h3 className="mt-6 text-2xl font-medium leading-tight">{p.title}</h3><p className="mt-4 flex-1 leading-7 text-muted-foreground">{p.body}</p><span className="link-sweep mt-8 inline-flex items-center gap-2 text-sm font-medium text-primary">{p.action}<ArrowRight className="arrow-nudge size-4"/></span></SmartLink>})}</div></div></section>

  <section className="bg-secondary py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:gap-20"><SectionIntro eyebrow="Start where you are" title="What are you trying to solve?" body="You do not need to know exactly what technology you need. Start by telling us where the problem is."/><div className="border-t border-border">{choices.map(([title,outcome,to],i)=><SmartLink key={title} to={to} className="hover-row group relative grid gap-3 overflow-hidden border-b border-border py-6 transition-colors duration-300 hover:text-primary sm:grid-cols-[2.5rem_1fr_auto] sm:items-center"><span className="text-xs font-bold text-primary">0{i+1}</span><span><strong className="block text-lg">{title}</strong><span className="mt-1 block text-sm text-muted-foreground">{outcome}</span></span><ArrowRight className="arrow-nudge size-5 text-primary"/></SmartLink>)}</div></div></div></section>

  <section className="relative overflow-hidden py-section"><div className="relative mx-auto max-w-7xl px-5 lg:px-8"><div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="mb-5 flex items-center gap-3 text-xs font-medium text-foreground before:h-0.5 before:w-6 before:bg-primary">Transformation story</p><h2 className="editorial-title">From complexity to clarity.</h2><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Understand the operation. Architect the right intervention. Engineer and connect what matters. Create a system the business can keep moving with.</p><p className="mt-6 max-w-xl leading-7 text-muted-foreground">That may mean connecting existing systems, replacing one fragile workflow, modernizing a constrained application, or adding the engineering capacity to move a defined roadmap. The scope follows the operating problem—not a predetermined technology sale.</p></div><figure><img src={systemMapUrl} alt="Xyncwave transformation model: From disconnected systems, manual workflows, fragmented data and delivery constraints to connected systems, clearer visibility, structured workflows and scalable delivery through Understand, Architect, Engineer, Automate and Scale." width={1672} height={941} loading="lazy" decoding="async" className="h-auto w-full"/></figure></div></div></section>

  <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="Transformation experience" title="Real operating detail. Practical connected technology."/><div className="hover-card group mt-12 grid overflow-hidden rounded-2xl border border-border bg-background lg:grid-cols-[1.35fr_.65fr]"><DigitalVisual media={caseStudyMedia["track-trace"]} className="min-h-[360px] rounded-none border-0 lg:min-h-[560px]"/><div className="relative flex flex-col justify-between p-8 sm:p-12"><span className="proof-link" aria-hidden="true"/><div><p className="text-xs font-medium text-primary">Case study · Logistics operations</p><h3 className="mt-6 text-3xl font-medium leading-tight sm:text-4xl">From fragmented field work to one connected operational platform.</h3><p className="mt-6 leading-8 text-muted-foreground">ERPNext/Frappe web workflows, a Flutter technician application, stock traceability, job status, communication, evidence, and an AWS serverless application layer.</p></div><div className="mt-12"><Button asChild><SmartLink to="/case-studies/track-trace">See How the System Works <ArrowRight/></SmartLink></Button></div></div></div></div></section>

  <section className="bg-secondary py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><SectionIntro eyebrow="Technology intelligence" title="Useful thinking for active decisions."/><div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:items-start">{featuredInsights.map((a)=><SmartLink key={a.slug} to={`/insights/${a.slug}`} className="hover-card group block overflow-hidden border border-transparent bg-background"><DigitalVisual media={getInsightMedia(a.slug,a.category)} className="aspect-[16/10]"/><div className="p-7 sm:p-8"><p className="text-xs font-bold uppercase text-primary">{a.category} · {a.read}</p><h3 className="mt-5 text-2xl font-bold leading-tight">{a.title}</h3><p className="mt-4 leading-7 text-muted-foreground">{a.excerpt}</p><span className="link-sweep mt-7 inline-flex items-center gap-2 font-semibold text-primary">Read the Insight <ArrowRight className="arrow-nudge size-4"/></span></div></SmartLink>)}</div></div></section>
  <section className="border-y border-border py-12"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between lg:px-8"><div><p className="text-xs font-medium text-primary">Xyncwave product</p><p className="mt-3 text-2xl font-medium">TripOps — trip records, expenses, budgets and reconciliation in one workflow.</p></div><Button variant="outline" asChild><SmartLink to="/products/tripops">Explore TripOps <ArrowRight/></SmartLink></Button></div></section>
  <CTASection/>
</div>; }