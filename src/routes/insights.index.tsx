import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { CTASection, Hero } from "../components/page-sections";
import { DigitalVisual } from "../components/digital-visuals";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getInsightMedia } from "../lib/media-registry";
import { articles } from "../lib/content";
import { pageHead } from "../lib/seo";

type InsightSearch = { q: string; topic: string };
export const Route = createFileRoute("/insights/")({
  validateSearch: (search: Record<string, unknown>): InsightSearch => ({
    q: typeof search["q"] === "string" ? search["q"].trim().slice(0, 120) : "",
    topic: typeof search["topic"] === "string" ? search["topic"].trim().slice(0, 80) : "",
  }),
  head: () =>
    pageHead(
      "Technology transformation insights",
      "Practical thinking on digital transformation, AI, engineering, modernization, data, and technology strategy.",
      "/insights",
    ),
  component: Page,
});

function Page() {
  const [featured, ...rest] = articles;
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [draft, setDraft] = useState(search.q);
  const [draftTopic, setDraftTopic] = useState(search.topic);
  useEffect(() => {
    setDraft(search.q);
    setDraftTopic(search.topic);
  }, [search.q, search.topic]);
  const topics = [
    ...new Set(
      articles
        .map((article) => article.category.split("·")[0]?.trim())
        .filter((topic): topic is string => Boolean(topic)),
    ),
  ].sort();
  const query = search.q.toLocaleLowerCase();
  const filtered = rest.filter(
    (article) =>
      (!search.topic || article.category.split("·")[0]?.trim() === search.topic) &&
      (!query ||
        `${article.title} ${article.excerpt} ${article.category}`
          .toLocaleLowerCase()
          .includes(query)),
  );
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({ search: { q: draft.trim().slice(0, 120), topic: draftTopic } });
  }
  function reset() {
    setDraft("");
    setDraftTopic("");
    void navigate({ search: { q: "", topic: "" } });
  }
  return (
    <>
      <Hero
        eyebrow="Technology intelligence"
        title="Insights for organizations building what comes next."
        description="Practical thinking on digital transformation, AI, engineering, modernization, data, and technology strategy."
      />
      {featured && (
        <section className="py-section">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SmartLink
              to={`/insights/${featured.slug}`}
              className="hover-card group grid overflow-hidden rounded-card border border-border bg-secondary lg:grid-cols-[1.2fr_.8fr]"
            >
              <DigitalVisual
                media={getInsightMedia(featured.slug, featured.category)}
                className="min-h-[380px] rounded-none border-0 lg:min-h-[560px]"
              />
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="type-eyebrow text-primary">Featured insight · {featured.category}</p>
                <h2 className="editorial-title mt-6">{featured.title}</h2>
                <p className="type-lead mt-6 text-muted-foreground">{featured.excerpt}</p>
                <p className="mt-7 text-sm text-muted-foreground">
                  XWC editorial · {featured.read}
                </p>
                <span className="link-sweep mt-9 inline-flex items-center gap-2 font-medium text-primary">
                  Read the Insight <ArrowRight className="arrow-nudge size-4" />
                </span>
              </div>
            </SmartLink>
          </div>
        </section>
      )}
      <section className="bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-8 border-b border-border pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-medium text-primary">Explore the library</p>
              <h2 className="mt-4 text-3xl font-medium">Filter by keyword or topic.</h2>
            </div>
            <form
              role="search"
              onSubmit={submit}
              className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_minmax(13rem,auto)_auto_auto]"
            >
              <label htmlFor="insight-keyword" className="sr-only">
                Search Insights
              </label>
              <Input
                id="insight-keyword"
                type="search"
                value={draft}
                maxLength={120}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Search Insights"
                className="bg-background"
              />
              <label htmlFor="insight-topic" className="sr-only">
                Filter by topic
              </label>
              <select
                id="insight-topic"
                value={draftTopic}
                onChange={(event) => setDraftTopic(event.target.value)}
                className="min-h-12 rounded-control border border-input bg-background px-3.5 text-base focus-visible:border-primary"
              >
                <option value="">All topics</option>
                {topics.map((topic) => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
              <Button type="submit">
                <Search /> Apply
              </Button>
              {(search.q || search.topic) && (
                <Button type="button" variant="outline" onClick={reset}>
                  <X /> Reset
                </Button>
              )}
            </form>
          </div>
          <p className="mt-7 text-sm text-muted-foreground" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </p>
          {filtered.length > 0 ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              {filtered.map((a, i) => (
                <SmartLink
                  key={a.slug}
                  to={`/insights/${a.slug}`}
                  className={`hover-card group overflow-hidden rounded-card border border-border bg-background ${i === 2 ? "lg:col-span-2 lg:grid lg:grid-cols-2" : ""}`}
                >
                  <DigitalVisual
                    media={getInsightMedia(a.slug, a.category)}
                    className="aspect-[16/10] rounded-none border-0"
                  />
                  <div className="p-7 sm:p-9">
                    <p className="text-xs font-medium text-primary">{a.category}</p>
                    <h2 className="type-card-title mt-5 transition-colors duration-300 group-hover:text-primary">
                      {a.title}
                    </h2>
                    <p className="mt-4 leading-7 text-muted-foreground">{a.excerpt}</p>
                    <p className="mt-7 text-sm text-muted-foreground">{a.read}</p>
                    <ArrowRight className="arrow-nudge mt-6 size-5 text-primary" />
                  </div>
                </SmartLink>
              ))}
            </div>
          ) : (
            <div className="mt-8 border border-border bg-background p-7 sm:p-10">
              <h2 className="text-2xl font-medium">No Insights match these filters.</h2>
              <p className="mt-3 text-muted-foreground">
                Try a shorter keyword, choose another topic, or reset the filters to see the
                complete library.
              </p>
              <Button className="mt-6" variant="outline" onClick={reset}>
                Reset filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <CTASection
        title="What decision are you working through?"
        body="Bring the operating problem, technology question, or delivery constraint. We will help you frame the options."
        cta="Get an Expert Perspective"
      />
    </>
  );
}
