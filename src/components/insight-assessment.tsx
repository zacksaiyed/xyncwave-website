import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import type { BatchArticle } from "../lib/insights-batch";
import { submitLead } from "../lib/leads";
import { track } from "../lib/analytics";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

type Props = { article: BatchArticle };
export function InsightAssessment({ article }: Props) {
  const config = article.assessment;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [contactDraft, setContactDraft] = useState({
    name: "",
    workEmail: "",
    company: "",
    message: "",
  });
  const complete = step >= config.questions.length;
  const pick = (sc: number, ans: Record<string, string>) => {
    for (const override of [
      ...(config.override ? [config.override] : []),
      ...(config.overrides ?? []),
    ]) {
      if (ans[override.key] === override.value) {
        const o = config.results.find((r) => r.title === override.result);
        if (o) return o;
      }
    }
    const unknown = config.unknownResult;
    if (
      unknown &&
      Object.values(ans).filter((value) => value === unknown.value).length >= unknown.minimum
    ) {
      const o = config.results.find((r) => r.title === unknown.result);
      if (o) return o;
    }
    return (
      [...config.results]
        .filter((r) => r.min < 999)
        .reverse()
        .find((item) => sc >= item.min) ?? config.results[0]
    );
  };
  const result = pick(score, answers);
  function choose(key: string, value: string, points: number) {
    if (step === 0)
      track("assessment_start", {
        article_slug: article.slug,
        topic_cluster: article.cluster,
        lead_magnet: config.title,
      });
    const nextScore = score + points;
    const next = { ...answers, [key]: value };
    setAnswers(next);
    setScore(nextScore);
    setStep(step + 1);
    if (step + 1 === config.questions.length) {
      const completedResult = pick(nextScore, next);
      track("assessment_complete", {
        article_slug: article.slug,
        topic_cluster: article.cluster,
        lead_magnet: config.title,
        result: completedResult?.title,
      });
    }
  }
  function back() {
    const previous = config.questions[step - 1];
    if (!previous) return;
    const prior = previous.choices.find((choice) => choice.value === answers[previous.key]);
    const next = { ...answers };
    delete next[previous.key];
    setAnswers(next);
    setScore(Math.max(0, score - (prior?.score ?? 0)));
    setStep(step - 1);
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await submitLead({
        ...contactDraft,
        leadType: config.leadType,
        problem: `insight-${article.slug}`,
        details: {
          assessment: config.title,
          result: result?.title ?? "Directional result",
          selectedChallenge: result?.title ?? "",
          ctaLabel: config.cta,
          ...(config.context ?? {}),
          ...answers,
        },
        attributionContext: {
          article_slug: article.slug,
          topic_cluster: article.cluster,
          lead_magnet: config.title,
          cta_source: "insight_assessment",
          cta_label: config.cta,
          ...(config.context ?? {}),
          cta_position: "assessment",
          conversion_path: `article > assessment > ${result?.title ?? "result"}`,
        },
      });
      try {
        sessionStorage.setItem(
          "xw_insight_thanks",
          JSON.stringify({
            type: config.leadType,
            slug: article.slug,
            title: article.title,
            related: article.related[0],
          }),
        );
      } catch {
        /* Continue without stored navigation context. */
      }
      track("lead_form_submit", {
        article_slug: article.slug,
        topic_cluster: article.cluster,
        lead_magnet: config.title,
        cta_position: "assessment",
      });
      await navigate({ to: "/thank-you/$type", params: { type: config.leadType } as never });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
    } finally {
      setPending(false);
    }
  }
  if (showForm && result)
    return (
      <div className="rounded-2xl border border-border bg-background p-6 sm:p-9">
        <Button variant="ghost" onClick={() => setShowForm(false)} className="mb-6">
          <ArrowLeft />
          Back to result
        </Button>
        <p className="text-xs font-medium text-primary">
          {config.title} · {result.title}
        </p>
        <h3 className="mt-3 text-2xl font-medium">Share enough context for a useful review.</h3>
        <form
          className="mt-7 space-y-5"
          onSubmit={submit}
          onFocus={() =>
            track("lead_form_start", {
              article_slug: article.slug,
              topic_cluster: article.cluster,
              lead_magnet: config.title,
            })
          }
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              required
              value={contactDraft.name}
              onChange={(event) =>
                setContactDraft((current) => ({ ...current, name: event.target.value }))
              }
            />
            <Field
              label="Work email"
              name="workEmail"
              type="email"
              required
              value={contactDraft.workEmail}
              onChange={(event) =>
                setContactDraft((current) => ({ ...current, workEmail: event.target.value }))
              }
            />
            <Field
              label="Company"
              name="company"
              required
              value={contactDraft.company}
              onChange={(event) =>
                setContactDraft((current) => ({ ...current, company: event.target.value }))
              }
            />
          </div>
          <div>
            <Label htmlFor={`${article.slug}-context`}>Optional context</Label>
            <Textarea
              id={`${article.slug}-context`}
              name="message"
              maxLength={3000}
              className="mt-2 min-h-28"
              placeholder="What is happening now, and what needs to change?"
              value={contactDraft.message}
              onChange={(event) =>
                setContactDraft((current) => ({ ...current, message: event.target.value }))
              }
            />
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-auto whitespace-normal py-3 text-center"
          >
            {pending ? "Sending…" : config.cta}
            <ArrowRight />
          </Button>
          <p className="text-xs leading-5 text-muted-foreground">
            Your assessment answers are included so the first conversation can begin with the
            workflow—not a generic sales script.
          </p>
        </form>
      </div>
    );
  if (complete && result)
    return (
      <div className="rounded-2xl border border-border bg-background p-6 sm:p-9">
        <p className="text-xs font-medium text-primary">Your directional result</p>
        <h3 className="mt-3 text-3xl font-medium">{result.title}</h3>
        <p className="mt-5 leading-7 text-muted-foreground">{result.body}</p>
        <ul className="mt-6 space-y-3 border-y border-border py-6">
          {result.actions.map((action) => (
            <li className="flex gap-3" key={action}>
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
              {action}
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">{config.disclaimer}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button
            size="lg"
            onClick={() => setShowForm(true)}
            className="h-auto whitespace-normal py-3 text-center"
          >
            {config.cta}
            <ArrowRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setStep(0);
              setAnswers({});
              setScore(0);
            }}
          >
            Start again
          </Button>
        </div>
      </div>
    );
  const question = config.questions[step];
  if (!question) return null;
  return (
    <div className="rounded-2xl border border-border bg-background p-6 sm:p-9">
      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <span>{config.title}</span>
        <span>
          {step + 1} / {config.questions.length}
        </span>
      </div>
      <div className="mt-4 h-1 bg-secondary">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((step + 1) / config.questions.length) * 100}%` }}
        />
      </div>
      <h3 className="mt-8 text-2xl font-medium sm:text-3xl">{question.prompt}</h3>
      <div className="mt-7 grid gap-3">
        {question.choices.map((choice) => (
          <Button
            key={choice.value}
            variant="ghost"
            className="h-auto min-h-16 justify-between whitespace-normal rounded-xl border border-border p-5 text-left hover:border-primary hover:bg-secondary"
            onClick={() => choose(question.key, choice.value, choice.score)}
          >
            <span>{choice.label}</span>
            <ArrowRight className="ml-4 size-5 shrink-0 text-primary" />
          </Button>
        ))}
      </div>
      {step > 0 && (
        <Button variant="ghost" className="mt-5" onClick={back}>
          <ArrowLeft />
          Back
        </Button>
      )}
    </div>
  );
}
function Field({
  label,
  name,
  ...props
}: React.ComponentProps<typeof Input> & { label: string; name: string }) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="mt-2 h-12" maxLength={255} {...props} />
    </div>
  );
}
