import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SmartLink } from "../components/app-link";
import { Breadcrumbs, CTASection, Hero } from "../components/page-sections";
import { products } from "../lib/products";
import { pageHead } from "../lib/seo";

export const Route = createFileRoute("/products/")({
  head: () => pageHead("Products", "Software products built by Xyncwave for specific operational problems, starting with TripOps for trip, expense and budget workflows.", "/products"),
  component: ProductsHub,
});

function ProductsHub() {
  return <>
    <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Products" }]} />
    <Hero eyebrow="Products" title="Focused products for specific operating problems." description="Alongside client engineering work, Xyncwave builds its own software products. Each one addresses a defined operational workflow." primary="Discuss a product" primaryTo="/start-a-conversation" />
    <section className="py-section"><div className="mx-auto max-w-7xl px-5 lg:px-8">
      <div className="divide-y divide-border border-y border-border">
        {products.map((p, i) => <SmartLink key={p.slug} to={`/products/${p.slug}`} className="hover-row group grid py-8 transition-colors duration-300 hover:bg-secondary md:grid-cols-[90px_1fr_1.4fr_auto] md:items-center md:gap-8 md:px-6">
          <span className="text-xs font-medium text-primary">{String(i + 1).padStart(2, "0")}</span>
          <div><p className="text-xs font-medium text-muted-foreground">{p.category}</p><h2 className="mt-2 text-2xl font-medium transition-colors duration-300 group-hover:text-primary">{p.name}</h2></div>
          <p className="mt-3 leading-7 text-muted-foreground md:mt-0">{p.summary}</p>
          <ArrowRight className="arrow-nudge mt-6 size-5 text-primary md:mt-0" />
        </SmartLink>)}
      </div>
      <p className="mt-8 max-w-2xl text-sm leading-6 text-muted-foreground">More products will be added here as they become available.</p>
    </div></section>
    <CTASection title="Have an operational workflow a product could serve?" body="Tell us about the workflow, the people involved and the systems around it." cta="Discuss a product requirement" />
  </>;
}
