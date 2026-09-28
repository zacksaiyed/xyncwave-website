import { ArrowRight } from "lucide-react";
import { SmartLink, type AppPath } from "./app-link";
import { Eyebrow } from "./page-sections";

export type ExploreItem = {
  type: "Solution" | "Industry" | "Case study" | "Insight" | "Assessment";
  title: string;
  body: string;
  to: AppPath;
};

export function ContinueExploring({ items, title = "Continue exploring" }: { items: ExploreItem[]; title?: string }) {
  return (
    <section className="bg-secondary py-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Eyebrow>Connected thinking</Eyebrow>
        <h2 className="max-w-3xl text-3xl font-medium leading-tight sm:text-4xl">{title}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <SmartLink key={`${item.type}-${item.to}`} to={item.to} className="hover-card group flex min-h-72 flex-col overflow-hidden rounded-2xl border border-border bg-background p-7 transition-colors duration-300 hover:bg-muted">
              <span className="text-xs font-medium text-muted-foreground">{item.type}</span>
              <h3 className="mt-4 text-xl font-medium transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
              <ArrowRight className="arrow-nudge mt-auto size-5 shrink-0 text-primary" />
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  );
}