import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { CTASection, Hero } from "../components/page-sections";
import { DigitalVisual } from "../components/digital-visuals";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { pageHead } from "../lib/seo";
import { insightCards, formatInsightDate } from "../lib/insights-listing";

// Insights search and topic filter. Protected by scripts/protect.mjs: a Lovable import must not remove it.
type InsightSearch = { q?: string; topic?: string };
const topicOf = (category: string) => category.split("·")[0]?.trim() ?? "";

export const Route = createFileRoute("/insights/")({
  validateSearch: (search: Record<string, unknown>): InsightSearch => {
    const q = typeof search["q"] === "string" ? search["q"].trim().slice(0, 120) : "";
    const topic = typeof search["topic"] === "string" ? search["topic"].trim().slice(0, 80) : "";
    return { ...(q ? { q } : {}), ...(topic ? { topic } : {}) };
  },
  head: () => pageHead("Technology transformation insights", "Practical thinking on digital transformation, AI, engineering, modernization, data, and technology strategy.", "/insights"),
  component: Page,
});

function Page() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [draft, setDraft] = useState(search.q ?? "");
  const [draftTopic, setDraftTopic] = useState(search.topic ?? "");
  useEffect(() => {
    setDraft(search.q ?? "");
    setDraftTopic(search.topic ?? "");
  }, [search.q, search.topic]);
  const topics = [...new Set(insightCards.map((card) => topicOf(card.category)).filter(Boolean))].sort();
  const query = (search.q ?? "").toLocaleLowerCase();
  const filtered = insightCards.filter(
    (card) =>
      (!search.topic || topicOf(card.category) === search.topic) &&
      (!query || `${card.title} ${card.excerpt} ${card.category}`.toLocaleLowerCase().includes(query)),
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ search: { q: draft.trim().slice(0, 120), topic: draftTopic } });
  }
  function reset() {
    setDraft("");
    setDraftTopic("");
    void navigate({ search: {} });
  }
  return (
    <>
      <Hero eyebrow="Technology intelligence" title="Insights for organizations building what comes next." description="Practical thinking on digital transformation, AI, engineering, modernization, data, and technology strategy." />
      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-medium text-primary">Explore the library</p>
              <h2 className="mt-4 text-3xl font-medium">Filter by keyword or topic.</h2>
            </div>
            <form role="search" onSubmit={submit} className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_minmax(13rem,auto)_auto_auto]">
              <label htmlFor="insight-keyword" className="sr-only">Search Insights</label>
              <Input id="insight-keyword" type="search" value={draft} maxLength={120} onChange={(event) => setDraft(event.target.value)} placeholder="Search Insights" className="bg-background" />
              <label htmlFor="insight-topic" className="sr-only">Filter by topic</label>
              <select id="insight-topic" value={draftTopic} onChange={(event) => setDraftTopic(event.target.value)} className="min-h-12 rounded-control border border-input bg-background px-3.5 text-base focus-visible:border-primary">
                <option value="">All topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
              <Button type="submit"><Search /> Apply</Button>
              {(search.q || search.topic) && (
                <Button type="button" variant="outline" onClick={reset}><X /> Reset</Button>
              )}
            </form>
          </div>
          <p className="mt-7 text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>
          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => {
                const inner = (
                  <>
                    {c.media && <DigitalVisual media={c.media} className="aspect-[16/10] rounded-none border-0" />}
                    <div className="flex flex-1 flex-col p-7">
                      <p className="text-xs font-medium text-primary">{c.category}</p>
                      <h3 className="mt-4 text-xl font-medium leading-tight transition-colors duration-300 group-hover:text-primary">{c.title}</h3>
                      <p className="mt-4 leading-7 text-muted-foreground">{c.excerpt}</p>
                      <p className="mt-auto pt-6 text-sm text-muted-foreground">{c.author ?? "Xyncwave editorial"} · <time dateTime={c.date}>{formatInsightDate(c.date)}</time></p>
                      <ArrowRight className="arrow-nudge mt-4 size-5 text-primary" />
                    </div>
                  </>
                );
                const cls = "hover-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-background";
                return c.erp ? (
                  <a key={c.key} href={c.to} lang={c.lang} className={cls}>{inner}</a>
                ) : (
                  <SmartLink key={c.key} to={c.to} className={cls}>{inner}</SmartLink>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 border border-border bg-background p-7 sm:p-10">
              <h2 className="text-2xl font-medium">No Insights match these filters.</h2>
              <p className="mt-3 text-muted-foreground">Try a shorter keyword, choose another topic, or reset the filters to see the complete library.</p>
              <Button className="mt-6" variant="outline" onClick={reset}>Reset filters</Button>
            </div>
          )}
        </div>
      </section>
      <CTASection title="What decision are you working through?" body="Bring the operating problem, technology question, or delivery constraint. We will help you frame the options." cta="Get an Expert Perspective" />
    </>
  );
}
