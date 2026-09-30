import { createFileRoute, notFound } from "@tanstack/react-router";
import { IndustryPage } from "../components/commercial-pages";
import { getIndustry } from "../lib/content";
import { noindexHead, pageHead } from "../lib/seo";
import { breadcrumbSchema, jsonLdScript } from "../lib/structured-data";
export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const item = getIndustry(params.slug);
    if (!item) throw notFound();
    return item;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return noindexHead("Industry unavailable", "The requested industry page could not be found.");
    const path = `/industries/${loaderData.slug}`;
    const base = pageHead(loaderData.metaTitle, loaderData.metaDescription, path);
    return {
      ...base,
      scripts: [
        jsonLdScript({
          "@context": "https://schema.org",
          ...breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: loaderData.title, path },
          ]),
        }),
      ],
    };
  },
  component: Page,
});
function Page() {
  return <IndustryPage industry={Route.useLoaderData()} />;
}
