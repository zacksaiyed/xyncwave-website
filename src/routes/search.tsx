import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { searchContent, searchResultTypes, type SearchResultType } from "../lib/search-index";

type SearchParams = { q: string; type?: SearchResultType };
const isResultType = (value: unknown): value is SearchResultType =>
  searchResultTypes.includes(value as SearchResultType);

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    q: typeof search["q"] === "string" ? search["q"].trim().slice(0, 120) : "",
    ...(isResultType(search["type"]) ? { type: search["type"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Search | XWC" },
      {
        name: "description",
        content: "Search XWC solutions, industries, case studies, insights, and company pages.",
      },
      { name: "robots", content: "noindex,follow" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [draft, setDraft] = useState(search.q);
  useEffect(() => setDraft(search.q), [search.q]);
  const results = searchContent(search.q, search.type);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void navigate({
      search: { q: draft.trim().slice(0, 120), ...(search.type ? { type: search.type } : {}) },
    });
  }
  function setType(type?: SearchResultType) {
    void navigate({ search: { q: search.q, ...(type ? { type } : {}) } });
  }
  function reset() {
    setDraft("");
    void navigate({ search: { q: "" } });
  }

  return (
    <>
      <section className="bg-surface-hero py-section">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <p className="text-xs font-medium text-primary">Search</p>
          <h1 className="mt-5 text-4xl font-medium sm:text-6xl">Find the most useful path.</h1>
          <form role="search" onSubmit={submit} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <label htmlFor="site-search" className="sr-only">
              Search XWC
            </label>
            <Input
              id="site-search"
              name="q"
              type="search"
              value={draft}
              maxLength={120}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search solutions, industries, case studies, and insights"
              className="h-13 flex-1 bg-background"
              autoFocus
            />
            <Button type="submit" size="lg">
              <Search /> Search
            </Button>
            {(search.q || search.type) && (
              <Button type="button" size="lg" variant="outline" onClick={reset}>
                <X /> Reset
              </Button>
            )}
          </form>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          {!search.q ? (
            <EmptySearch
              onSelect={(q) => {
                setDraft(q);
                void navigate({ search: { q } });
              }}
            />
          ) : (
            <>
              <div className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Results for</p>
                  <h2 className="mt-1 break-words text-2xl font-medium">“{search.q}”</h2>
                </div>
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  {results.length} {results.length === 1 ? "result" : "results"}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Filter search results by type">
                <FilterButton active={!search.type} onClick={() => setType()}>
                  All
                </FilterButton>
                {searchResultTypes.map((type) => (
                  <FilterButton
                    key={type}
                    active={search.type === type}
                    onClick={() => setType(type)}
                  >
                    {type}
                  </FilterButton>
                ))}
              </div>
              {results.length > 0 ? (
                <ol className="mt-10 divide-y divide-border border-y border-border">
                  {results.map((result) => (
                    <li key={result.id}>
                      <SmartLink
                        to={result.route}
                        className="group grid gap-3 py-7 sm:grid-cols-[9rem_1fr_auto] sm:items-start sm:gap-6"
                      >
                        <span className="text-xs font-medium text-primary">{result.type}</span>
                        <span>
                          <span className="block text-xl font-medium group-hover:text-primary">
                            <Highlight text={result.title} query={search.q} />
                          </span>
                          <span className="mt-2 block leading-7 text-muted-foreground">
                            <Highlight text={result.summary} query={search.q} />
                          </span>
                        </span>
                        <ArrowRight className="arrow-nudge mt-1 size-5 text-primary" />
                      </SmartLink>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="mt-12 border border-border bg-secondary p-7 sm:p-10">
                  <h2 className="text-2xl font-medium">No matching pages found.</h2>
                  <p className="mt-3 leading-7 text-muted-foreground">
                    Try a shorter phrase, remove the type filter, or search for a business problem
                    such as integration, reporting, modernization, or engineering capacity.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button variant="outline" onClick={() => setType()}>
                      Show all types
                    </Button>
                    <Button onClick={reset}>Start a new search</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="min-h-11 border border-border bg-background px-4 text-sm font-medium hover:border-primary aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
    >
      {children}
    </button>
  );
}

function EmptySearch({ onSelect }: { onSelect: (query: string) => void }) {
  const suggestions = [
    "Digital transformation",
    "System integration",
    "Engineering capacity",
    "AI automation",
  ];
  return (
    <div>
      <h2 className="text-3xl font-medium">Search by problem, capability, or industry.</h2>
      <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
        Results include published Solutions, Industries, Case Studies, Insights, and useful company
        pages.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {suggestions.map((query) => (
          <Button key={query} variant="outline" onClick={() => onSelect(query)}>
            {query}
          </Button>
        ))}
      </div>
    </div>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const terms = [
    ...new Set(
      query
        .trim()
        .split(/\s+/)
        .filter((term) => term.length >= 2),
    ),
  ].slice(0, 8);
  if (!terms.length) return <>{text}</>;
  const expression = new RegExp(
    `(${terms.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  return (
    <>
      {text.split(expression).map((part, index) =>
        terms.some((term) => term.toLowerCase() === part.toLowerCase()) ? (
          <mark key={`${part}-${index}`} className="bg-primary/15 text-inherit">
            {part}
          </mark>
        ) : (
          <Fragment key={`${part}-${index}`}>{part}</Fragment>
        ),
      )}
    </>
  );
}
