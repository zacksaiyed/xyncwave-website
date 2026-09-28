"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type MutableRefObject,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import type { Industry } from "../lib/content";
import { getIndustryConversion, type IndustryConversion } from "../lib/industry-conversion";
import { submitLead } from "../lib/leads";
import { track } from "../lib/analytics";
import { SmartLink, type AppPath } from "./app-link";
import { Breadcrumbs, Eyebrow, FAQSection, SectionIntro } from "./page-sections";
import { ContinueExploring } from "./continue-exploring";
import { relatedForIndustry } from "../lib/content-relations";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const FORM_ID = "industry-challenge-form";

type CtaPosition = "hero" | "pain" | "future" | "proof" | "trigger" | "sticky";

export function IndustryLandingPage({ industry }: { industry: Industry }) {
  const config = getIndustryConversion(industry.slug);
  if (!config) return null;
  return <IndustryLandingContent industry={industry} config={config} />;
}

function IndustryLandingContent({
  industry,
  config,
}: {
  industry: Industry;
  config: IndustryConversion;
}) {
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [selectedProblem, setSelectedProblem] = useState("");
  const [ctaSource, setCtaSource] = useState(`${industry.slug}_direct_form`);
  const [showSticky, setShowSticky] = useState(false);
  const pathRef = useRef<string[]>([]);

  useEffect(() => {
    const campaign = new URLSearchParams(window.location.search).get("utm_campaign") ?? undefined;
    track("industry_page_view", { industry: industry.slug, campaign, device: deviceClass() });
    const onScroll = () => setShowSticky(window.scrollY > 560 && !isFormVisible());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [industry.slug]);

  function recordPath(value: string) {
    if (!pathRef.current.includes(value)) pathRef.current.push(value);
  }

  function chooseProblem(title: string) {
    const challenge = matchChallenge(title, config);
    setSelectedProblem(title);
    setSelectedChallenge(challenge);
    recordPath(`pain:${title}`);
    track("pain_card_click", {
      industry: industry.slug,
      challenge,
      problem: title,
      device: deviceClass(),
    });
    track("challenge_selected", { industry: industry.slug, challenge, source: "pain_card" });
  }

  function goToForm(position: CtaPosition, label: string) {
    const source = `${industry.slug}_${position}_cta`;
    setCtaSource(source);
    recordPath(`cta:${source}`);
    track(position === "hero" ? "hero_cta_click" : "cta_click", {
      industry: industry.slug,
      label,
      cta_source: source,
      cta_position: position,
      challenge: selectedChallenge,
      device: deviceClass(),
    });
    window.requestAnimationFrame(() =>
      document.getElementById(FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Industries", to: "/industries" },
          { label: industry.title },
        ]}
      />
      <section className="bg-surface-hero" data-industry-hero>
        <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-12 px-5 py-14 lg:grid-cols-[1.4fr_.6fr] lg:px-8 lg:py-20">
          <div className="min-w-0 max-w-4xl">
            <Eyebrow>{industry.eyebrow}</Eyebrow>
            <h1 className="hero-title">{industry.heroTitle}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              {industry.short}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                className="h-auto max-w-full whitespace-normal py-3 text-center"
                onClick={() => goToForm("hero", industry.primaryCta)}
              >
                {industry.primaryCta}
                <ArrowDown />
              </Button>
              {industry.secondaryCta && industry.secondaryTo && (
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  onClick={() =>
                    track("case_study_click", {
                      industry: industry.slug,
                      cta_source: `${industry.slug}_hero_proof`,
                    })
                  }
                >
                  <SmartLink to={industry.secondaryTo as AppPath}>
                    {industry.secondaryCta}
                    <ArrowRight />
                  </SmartLink>
                </Button>
              )}
            </div>
            <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
              {config.heroMicrocopy}
            </p>
          </div>
          <div className="min-w-0 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs font-medium text-muted-foreground">XWC principle</p>
            <p className="mt-3 text-xl font-medium leading-7">
              Business problem first.
              <br />
              Technology second.
            </p>
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.78fr_1.22fr] lg:px-8">
          <SectionIntro eyebrow={industry.openingEyebrow} title={industry.openingTitle} />
          <p className="max-w-3xl text-lg leading-8 text-muted-foreground">
            {industry.openingBody}
          </p>
        </div>
      </section>

      <section className="bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow={config.recognitionEyebrow}
            title={config.recognitionTitle}
            body={industry.frictionsIntro}
          />
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {industry.frictions.slice(0, 6).map((item, i) => {
              const active = selectedProblem === item.title;
              return (
                <Button
                  key={item.title}
                  type="button"
                  variant="ghost"
                  aria-pressed={active}
                  onClick={() => chooseProblem(item.title)}
                  className={`h-auto min-h-40 justify-start whitespace-normal rounded-xl border p-6 text-left transition-colors ${active ? "border-primary bg-background" : "border-border bg-background hover:border-primary"}`}
                >
                  <span className="self-start">
                    <span className="flex items-center justify-between gap-4">
                      <span className="text-xs font-medium text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {active && <Check className="size-5 text-primary" />}
                    </span>
                    <strong className="mt-5 block text-lg font-medium">{item.title}</strong>
                    <span className="mt-3 block text-sm font-normal leading-6 text-muted-foreground">
                      {item.body}
                    </span>
                  </span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionIntro
              eyebrow="Why it matters"
              title={industry.consequenceTitle}
              body={industry.consequenceBody}
            />
            <div className="rounded-2xl border border-border bg-secondary p-8 sm:p-10">
              <p className="text-xs font-medium text-primary">A practical next step</p>
              <p className="mt-5 text-2xl font-medium leading-tight">
                The cost is often in repeated coordination, delayed visibility, and decisions made
                from records that do not agree.
              </p>
              <Button
                className="mt-7"
                variant="outline"
                onClick={() => goToForm("pain", config.painCta)}
              >
                {config.painCta}
                <ArrowDown />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-inverse py-section text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="A more connected state"
            title={industry.futureTitle}
            body={industry.futureBody}
          />
          <div className="mt-12 grid gap-px bg-primary-foreground/15 md:grid-cols-[1fr_auto_1fr]">
            <div className="bg-surface-inverse p-8">
              <p className="text-xs font-medium text-primary">Before</p>
              <p className="mt-5 text-2xl font-medium">{config.beforeLabel}</p>
            </div>
            <div className="hidden items-center px-4 text-primary md:flex">
              <ArrowRight />
            </div>
            <div className="bg-surface-inverse p-8">
              <p className="text-xs font-medium text-primary">After</p>
              <p className="mt-5 text-2xl font-medium">{config.afterLabel}</p>
            </div>
          </div>
          <div className="mt-8 grid gap-px bg-primary-foreground/15 sm:grid-cols-2 lg:grid-cols-3">
            {industry.futureSteps.map((step, i) => (
              <div key={step} className="bg-surface-inverse p-6">
                <span className="text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-medium">{step}</p>
              </div>
            ))}
          </div>
          <Button className="mt-8" onClick={() => goToForm("future", config.futureCta)}>
            {config.futureCta}
            <ArrowDown />
          </Button>
        </div>
      </section>

      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Problem to improvement"
            title={config.solutionTitle}
            body={config.solutionIntro}
          />
          <div className="mt-12 divide-y divide-border border-y border-border">
            {config.solutionMap.map((item, i) => (
              <div
                key={item.problem}
                className="grid gap-5 py-7 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-center"
              >
                <div>
                  <span className="text-xs font-medium text-primary">Problem {i + 1}</span>
                  <p className="mt-2 font-medium">{item.problem}</p>
                </div>
                <ArrowRight className="hidden size-5 text-primary md:block" />
                <div>
                  <span className="text-xs text-muted-foreground">Intervention</span>
                  <p className="mt-2 font-medium">{item.intervention}</p>
                </div>
                <ArrowRight className="hidden size-5 text-primary md:block" />
                <div>
                  <span className="text-xs text-muted-foreground">Business improvement</span>
                  <p className="mt-2 font-medium">{item.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="Practical use cases"
            title={industry.useCasesTitle}
            body={industry.useCasesIntro}
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {config.useCases.map((item, i) => (
              <article
                key={item.situation}
                className="rounded-2xl border border-border bg-background p-7"
              >
                <span className="text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")} · {item.capability}
                </span>
                <h3 className="mt-5 text-xl font-medium">{item.situation}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{item.approach}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-inverse py-section text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-medium text-primary">Relevant proof</p>
            <h2 className="mt-5 text-3xl font-medium">{industry.proofTitle}</h2>
          </div>
          <div>
            <p className="leading-7 text-primary-foreground/70">{industry.proofBody}</p>
            {industry.proofTo && industry.proofLink && (
              <SmartLink
                to={industry.proofTo as AppPath}
                onClick={() =>
                  track("case_study_click", {
                    industry: industry.slug,
                    cta_source: `${industry.slug}_proof_link`,
                  })
                }
                className="mt-7 inline-flex items-center gap-2 font-medium text-primary"
              >
                {industry.proofLink}
                <ArrowRight className="size-4" />
              </SmartLink>
            )}
            <p className="mt-7 font-medium">Facing something similar?</p>
            <Button className="mt-4" onClick={() => goToForm("proof", config.proofCta)}>
              {config.proofCta}
              <ArrowDown />
            </Button>
          </div>
        </div>
      </section>

      <TriggerBlock
        industry={industry}
        config={config}
        onCta={() => goToForm("trigger", config.triggerCta)}
      />

      <section className="py-section">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionIntro
            eyebrow="A practical engagement"
            title={industry.engagementTitle}
            body={industry.engagementBody}
          />
          <div className="mt-12 grid border-y border-border md:grid-cols-2 lg:grid-cols-4">
            {industry.engagement.map((step, i) => (
              <div
                key={step.title}
                className="border-b border-border py-8 md:px-7 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <span className="text-xs font-medium text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 text-xl font-medium">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <IndustryLeadForm
        industry={industry}
        config={config}
        selectedChallenge={selectedChallenge}
        selectedProblem={selectedProblem}
        ctaSource={ctaSource}
        pathRef={pathRef}
        onChallengeChange={setSelectedChallenge}
      />
      <ContinueExploring
        title={`Explore the ${industry.title.toLowerCase()} path`}
        items={relatedForIndustry(industry.slug)}
      />
      <FAQSection eyebrow="Operational questions" title={industry.faqTitle} items={industry.faq} />

      {showSticky && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 shadow-lg backdrop-blur sm:left-auto sm:right-5 sm:bottom-5 sm:max-w-sm sm:rounded-xl sm:border">
          <Button className="w-full" onClick={() => goToForm("sticky", config.stickyCta)}>
            {config.stickyCta}
            <ArrowDown />
          </Button>
        </div>
      )}
    </>
  );
}

function TriggerBlock({
  industry,
  config,
  onCta,
}: {
  industry: Industry;
  config: IndustryConversion;
  onCta: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("trigger_section_view", { industry: industry.slug });
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [industry.slug]);
  return (
    <section ref={ref} className="bg-secondary py-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionIntro
          eyebrow="Signals for action"
          title={industry.triggersHeading}
          body={industry.triggersIntro}
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {industry.triggers.slice(0, 8).map((t) => (
            <div className="rounded-xl border border-border bg-background p-6" key={t}>
              <Check className="size-5 text-primary" />
              <p className="mt-5 font-medium leading-7">{t}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-start gap-4 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-2xl font-medium">Is one of these happening in your business?</p>
          <Button onClick={onCta}>
            {config.triggerCta}
            <ArrowDown />
          </Button>
        </div>
      </div>
    </section>
  );
}

type FormProps = {
  industry: Industry;
  config: IndustryConversion;
  selectedChallenge: string;
  selectedProblem: string;
  ctaSource: string;
  pathRef: MutableRefObject<string[]>;
  onChallengeChange: (value: string) => void;
};
function IndustryLeadForm({
  industry,
  config,
  selectedChallenge,
  selectedProblem,
  ctaSource,
  pathRef,
  onChallengeChange,
}: FormProps) {
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const submitted = useRef(false);
  const progressive = config.progressiveFields?.[selectedChallenge] ?? [];
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          track("lead_form_view", { industry: industry.slug, challenge: selectedChallenge });
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [industry.slug, selectedChallenge]);
  useEffect(
    () => () => {
      if (started && !submitted.current)
        track("lead_form_abandon", {
          industry: industry.slug,
          challenge: selectedChallenge,
          cta_source: ctaSource,
        });
    },
    [started, industry.slug, selectedChallenge, ctaSource],
  );
  function begin() {
    if (started) return;
    setStarted(true);
    track("lead_form_start", {
      industry: industry.slug,
      challenge: selectedChallenge,
      cta_source: ctaSource,
      device: deviceClass(),
    });
  }
  function complete(field: string, value: string) {
    if (!value || completed.includes(field)) return;
    setCompleted((v) => [...v, field]);
    track("lead_form_field_complete", {
      industry: industry.slug,
      field,
      challenge: selectedChallenge,
    });
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const data = new FormData(event.currentTarget);
    const ctaPosition = ctaSource.replace(`${industry.slug}_`, "").replace("_cta", "");
    const details: Record<string, string> = {
      industry: industry.slug,
      industry_name: industry.title,
      selected_problem_card: selectedProblem,
      cta_clicked: ctaSource,
      cta_position: ctaPosition,
    };
    const dynamicFields = config.optionalField
      ? [config.optionalField, ...progressive]
      : progressive;
    for (const field of dynamicFields) {
      const value = String(data.get(field.key) || "").trim();
      if (value) details[field.key] = value;
    }
    try {
      await submitLead({
        name: String(data.get("name") || ""),
        workEmail: String(data.get("workEmail") || ""),
        company: String(data.get("company") || ""),
        leadType: config.leadType,
        problem: selectedChallenge,
        message: String(data.get("message") || ""),
        details,
        attributionContext: {
          industry: industry.slug,
          selected_challenge: selectedChallenge,
          selected_problem_card: selectedProblem,
          cta_source: ctaSource,
          cta_position: ctaPosition,
          page_url: window.location.pathname,
          session_conversion_path: pathRef.current.join(" > "),
          device: deviceClass(),
        },
      });
      submitted.current = true;
      track("lead_form_submit", {
        industry: industry.slug,
        challenge: selectedChallenge,
        cta_source: ctaSource,
        device: deviceClass(),
      });
      track("lead_generated", {
        lead_type: config.leadType,
        industry: industry.slug,
        challenge: selectedChallenge,
      });
      await navigate({ to: "/thank-you/$type", params: { type: industry.slug } as never });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
      track("form_error", { industry: industry.slug, challenge: selectedChallenge });
    } finally {
      setPending(false);
    }
  }
  return (
    <section
      ref={sectionRef}
      id={FORM_ID}
      className="scroll-mt-24 bg-surface-inverse py-section text-primary-foreground"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <div>
          <p className="text-xs font-medium text-primary">Start a qualified conversation</p>
          <h2 className="mt-5 text-4xl font-medium leading-tight sm:text-5xl">
            {config.formTitle}
          </h2>
          <p className="mt-5 max-w-xl leading-8 text-primary-foreground/70">{config.formBody}</p>
        </div>
        <form
          onSubmit={submit}
          onFocus={begin}
          className="rounded-2xl bg-background p-6 text-foreground sm:p-9"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Name"
              name="name"
              autoComplete="name"
              required
              onComplete={complete}
            />
            <FormField
              label="Work email"
              name="workEmail"
              type="email"
              autoComplete="email"
              required
              onComplete={complete}
            />
            <FormField
              label="Company"
              name="company"
              autoComplete="organization"
              required
              onComplete={complete}
            />
            <div>
              <Label htmlFor={`${industry.slug}-challenge`}>{config.challengeLabel}</Label>
              <Select
                value={selectedChallenge}
                onValueChange={(value) => {
                  onChallengeChange(value);
                  pathRef.current.push(`challenge:${value}`);
                  track("challenge_selected", {
                    industry: industry.slug,
                    challenge: value,
                    source: "form",
                  });
                }}
                required
              >
                <SelectTrigger id={`${industry.slug}-challenge`} className="mt-2 h-12">
                  <SelectValue placeholder="Select the closest challenge" />
                </SelectTrigger>
                <SelectContent>
                  {config.challengeOptions.map((option) => (
                    <SelectItem value={option.value} key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {(config.optionalField || progressive.length > 0) && (
            <div className="mt-6 grid gap-5 border-y border-border py-6 sm:grid-cols-2">
              {config.optionalField && (
                <DynamicField field={config.optionalField} onComplete={complete} />
              )}{" "}
              {progressive.map((field) => (
                <DynamicField field={field} onComplete={complete} key={field.key} />
              ))}
            </div>
          )}
          <div className="mt-6">
            <Label htmlFor={`${industry.slug}-message`}>
              {config.messageLabel}{" "}
              <span className="font-normal text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id={`${industry.slug}-message`}
              name="message"
              maxLength={3000}
              onBlur={(e) => complete("message", e.currentTarget.value)}
              className="mt-2 min-h-32"
              placeholder={config.messagePlaceholder}
            />
          </div>
          {error && (
            <p role="alert" className="mt-5 text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={pending || !selectedChallenge}
            className="mt-6 w-full sm:w-auto"
          >
            {pending ? "Sending…" : config.submitLabel}
            <ArrowRight />
          </Button>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted-foreground">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
            {config.reassurance}
          </p>
        </form>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  onComplete,
  ...props
}: ComponentProps<typeof Input> & {
  label: string;
  name: string;
  onComplete: (name: string, value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        className="mt-2 h-12"
        maxLength={255}
        onBlur={(e) => onComplete(name, e.currentTarget.value)}
        {...props}
      />
    </div>
  );
}
function DynamicField({
  field,
  onComplete,
}: {
  field: NonNullable<IndustryConversion["optionalField"]>;
  onComplete: (name: string, value: string) => void;
}) {
  if (field.choices)
    return (
      <div>
        <Label htmlFor={field.key}>{field.label}</Label>
        <Select name={field.key} onValueChange={(value) => onComplete(field.key, value)}>
          <SelectTrigger id={field.key} className="mt-2 h-12">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {field.choices.map((choice) => (
              <SelectItem value={choice} key={choice}>
                {choice}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  return (
    <FormField
      label={field.label}
      name={field.key}
      placeholder={field.placeholder}
      onComplete={onComplete}
    />
  );
}
function matchChallenge(title: string, config: IndustryConversion) {
  const normalized = title.toLowerCase();
  return (
    config.challengeOptions.find(
      (option) =>
        normalized.includes(option.label.toLowerCase()) ||
        option.label
          .toLowerCase()
          .split(" ")
          .some((word) => word.length > 4 && normalized.includes(word)),
    )?.value ??
    config.challengeOptions.at(-1)?.value ??
    "other"
  );
}
function deviceClass() {
  if (typeof window === "undefined") return "unknown";
  return window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop";
}
function isFormVisible() {
  const form = document.getElementById(FORM_ID);
  if (!form) return false;
  const rect = form.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.8 && rect.bottom > 120;
}
