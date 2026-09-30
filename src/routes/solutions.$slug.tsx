import { createFileRoute, notFound } from "@tanstack/react-router";
import { SolutionPage } from "../components/commercial-pages";
import { getSolution } from "../lib/content";
import { noindexHead, pageHead } from "../lib/seo";
import { breadcrumbSchema, jsonLdScript } from "../lib/structured-data";
export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const item = getSolution(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return noindexHead("Solution unavailable", "The requested solution could not be found.");
    const path = `/solutions/${loaderData.slug}`;
    const base = pageHead(loaderData.metaTitle, loaderData.metaDescription, path);
    return {
      ...base,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          ...breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Solutions", path: "/solutions" },
            { name: loaderData.title, path },
          ]),
        }),
      ],
    };
  },
  component: Page,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-5 py-32">
      <h1 className="text-5xl font-bold">Solution not found.</h1>
    </div>
  ),
});
function Page() {
  return <SolutionPage solution={Route.useLoaderData()} />;
}
