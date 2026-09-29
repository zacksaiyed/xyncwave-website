export type { AppPath } from "./app-link";
import { SmartLink, type AppPath } from "./app-link";

import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { track } from "../lib/analytics";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="type-eyebrow mb-5 flex items-center gap-3 text-foreground before:h-0.5 before:w-6 before:bg-primary">
      {children}
    </p>
  );
}

export function Hero({
  eyebrow,
  title,
  description,
  primary = "Tell Us Your Challenge",
  primaryTo = "/start-a-conversation",
  secondary,
  secondaryTo,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primary?: string;
  primaryTo?: AppPath;
  secondary?: string;
  secondaryTo?: AppPath;
}) {
  return (
    <section className="relative overflow-hidden bg-surface-hero">
      <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-[1.4fr_.6fr] lg:px-8 lg:py-20">
        <div className="max-w-4xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="hero-title">{title}</h1>
          <p className="type-lead mt-7 text-muted-foreground">{description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              asChild
              onClick={() => track("cta_click", { label: primary, placement: "hero" })}
            >
              <SmartLink to={primaryTo}>
                {primary}
                <ArrowRight />
              </SmartLink>
            </Button>
            {secondary && secondaryTo && (
              <Button variant="outline" size="lg" asChild>
                <SmartLink to={secondaryTo}>
                  {secondary}
                  <ArrowRight />
                </SmartLink>
              </Button>
            )}
          </div>
        </div>
        <div className="border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="type-meta text-muted-foreground">XWC principle</p>
          <p className="mt-3 text-xl font-medium leading-7">
            Business problem first.
            <br />
            Technology second.
          </p>
        </div>
      </div>
    </section>
  );
}
export function SectionIntro({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-4xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="editorial-title">{title}</h2>
      {body && <p className="type-lead mt-5 text-muted-foreground">{body}</p>}
    </div>
  );
}
export function ProofStrip() {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 text-sm lg:grid-cols-4 lg:px-8">
        <strong>Business-first discovery</strong>
        <span>Software engineering</span>
        <span>Global delivery capability</span>
        <span>Flexible engagement models</span>
      </div>
    </section>
  );
}
export function CTASection({
  title = "What are you trying to change?",
  body = "Tell us what is slowing the business down, where technology is getting in the way, or what you are trying to build next.",
  cta = "Tell Us Your Challenge",
  to = "/start-a-conversation",
}: {
  title?: string;
  body?: string;
  cta?: string;
  to?: AppPath;
}) {
  return (
    <section className="bg-surface-inverse px-5 py-section text-primary-foreground lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
        <div>
          <p className="type-eyebrow mb-5 flex items-center gap-3 text-primary-foreground/70 before:h-0.5 before:w-6 before:bg-primary">
            Start with the problem
          </p>
          <h2 className="editorial-title max-w-3xl">{title}</h2>
          <p className="type-lead mt-5 text-primary-foreground/70">{body}</p>
        </div>
        <div className="w-full min-w-0 sm:w-auto">
          <Button
            className="h-auto w-full max-w-full whitespace-normal py-3 text-center sm:w-auto"
            size="lg"
            asChild
          >
            <SmartLink to={to}>
              {cta}
              <ArrowRight className="shrink-0" />
            </SmartLink>
          </Button>
          <p className="mt-4 max-w-xs text-xs leading-5 text-primary-foreground/60">
            You do not need to know the answer yet. Start with the problem.
          </p>
        </div>
      </div>
    </section>
  );
}
export function Breadcrumbs({ items }: { items: { label: string; to?: AppPath }[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto flex max-w-7xl gap-2 px-5 py-4 text-xs text-muted-foreground lg:px-8"
    >
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {i > 0 && <ChevronRight className="size-3" />}
          {item.to ? (
            <SmartLink to={item.to} className="hover:text-primary">
              {item.label}
            </SmartLink>
          ) : (
            item.label
          )}
        </span>
      ))}
    </nav>
  );
}
export function TriggerSection({
  triggers,
  title = "You may need this if…",
  body,
  eyebrow = "Buying triggers",
}: {
  triggers: string[];
  title?: string;
  body?: string;
  eyebrow?: string;
}) {
  return (
    <section className="bg-secondary py-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionIntro eyebrow={eyebrow} title={title} {...(body ? { body } : {})} />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {triggers.map((t) => (
            <div className="rounded-card border border-border bg-background p-7" key={t}>
              <span className="mb-7 grid size-10 place-items-center rounded-md bg-muted">
                <Check className="size-5 text-primary" />
              </span>
              <p className="text-base font-medium leading-7">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export function FAQSection({
  items,
  title = "A clearer first step",
  eyebrow = "Common questions",
}: {
  items: [string, string][];
  title?: string;
  eyebrow?: string;
}) {
  return (
    <section className="border-t border-border py-section">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <SectionIntro eyebrow={eyebrow} title={title} />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {items.map(([q, a]) => (
            <details key={q} className="group py-7">
              <summary className="flex cursor-pointer list-none justify-between gap-6 font-semibold">
                {q}
                <span className="text-primary transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
export function LinkCard({
  to,
  title,
  body,
  eyebrow,
}: {
  to: AppPath;
  title: string;
  body: string;
  eyebrow?: string;
}) {
  return (
    <SmartLink
      to={to}
      className="hover-card group block overflow-hidden rounded-card border border-border bg-background p-7 transition-colors duration-300 hover:bg-secondary"
    >
      <span className="type-meta text-muted-foreground">{eyebrow}</span>
      <h3 className="type-card-title mt-4 transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{body}</p>
      <ArrowRight className="arrow-nudge mt-8 size-5 text-primary" />
    </SmartLink>
  );
}
