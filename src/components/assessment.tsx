import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { LeadForm } from "./lead-form";
import type { LeadType } from "../lib/leads";
import { track } from "../lib/analytics";

type Question = { prompt: string; options: { label: string; score: number }[] };
type Config = {
  label: string;
  title: string;
  description: string;
  questions: Question[];
  results: { min: number; title: string; body: string; actions: string[] }[];
};
const configs: Record<Exclude<LeadType, "general" | "partnership">, Config> = {
  digitalization: {
    label: "Digitalization readiness",
    title: "How connected are your operations?",
    description: "Get a practical readiness view before deciding whether to speak with us.",
    questions: [
      {
        prompt: "How do teams move work between departments?",
        options: [
          { label: "Mostly paper, messages, or spreadsheets", score: 0 },
          { label: "A mix of systems and manual handoffs", score: 1 },
          { label: "Mostly through connected systems", score: 2 },
        ],
      },
      {
        prompt: "How is management reporting produced?",
        options: [
          { label: "Manually consolidated", score: 0 },
          { label: "Partially automated", score: 1 },
          { label: "Live and dependable", score: 2 },
        ],
      },
      {
        prompt: "How consistent are processes across locations?",
        options: [
          { label: "Each location works differently", score: 0 },
          { label: "Some shared standards", score: 1 },
          { label: "Consistent and visible", score: 2 },
        ],
      },
    ],
    results: [
      {
        min: 0,
        title: "Fragmented",
        body: "Core work is likely being carried by people between disconnected tools. Start by mapping one high-friction workflow end to end.",
        actions: [
          "Document the current handoffs",
          "Identify duplicate data entry",
          "Choose one measurable outcome",
        ],
      },
      {
        min: 3,
        title: "Developing",
        body: "Some digital foundations exist, but key gaps may still limit visibility and control. Prioritize the connections with the highest operating cost.",
        actions: [
          "Map system ownership",
          "Find manual work between systems",
          "Sequence integrations by impact",
        ],
      },
      {
        min: 5,
        title: "Connected",
        body: "Your foundations appear relatively connected. The next opportunity is likely optimization, analytics, or targeted automation.",
        actions: [
          "Test data reliability",
          "Identify decision delays",
          "Prioritize high-value automation",
        ],
      },
    ],
  },
  engineering: {
    label: "Engineering capacity",
    title: "What delivery model fits the work?",
    description:
      "Clarify whether you need a specialist, pod, project team, or delivery partnership.",
    questions: [
      {
        prompt: "How defined is the work?",
        options: [
          { label: "A specific specialist gap", score: 0 },
          { label: "A roadmap with changing priorities", score: 1 },
          { label: "A defined project outcome", score: 2 },
        ],
      },
      {
        prompt: "Who can own delivery decisions?",
        options: [
          { label: "Our internal lead", score: 0 },
          { label: "Shared ownership", score: 1 },
          { label: "We need delivery ownership", score: 2 },
        ],
      },
      {
        prompt: "How long is the likely need?",
        options: [
          { label: "Short, focused requirement", score: 0 },
          { label: "Several months", score: 1 },
          { label: "Ongoing or multi-phase", score: 2 },
        ],
      },
    ],
    results: [
      {
        min: 0,
        title: "Specialist engineer",
        body: "A focused capability gap may be best served by an engineer who works within your existing team and ownership model.",
        actions: [
          "Define the specialist skill",
          "Confirm internal ownership",
          "Set practical overlap",
        ],
      },
      {
        min: 3,
        title: "Dedicated pod",
        body: "A stable cross-functional pod can add capacity while sharing roadmap and delivery responsibility with your team.",
        actions: ["Define pod outcomes", "Agree decision ownership", "Set delivery cadence"],
      },
      {
        min: 5,
        title: "Project team or delivery partnership",
        body: "The work may benefit from clearer external delivery ownership, a defined project team, or a longer-term partner model.",
        actions: ["Clarify outcome boundaries", "Agree governance", "Plan phased delivery"],
      },
    ],
  },
  ai: {
    label: "AI opportunity exploration",
    title: "Where might AI be worth testing?",
    description:
      "Highlight exploration areas based on the work, information, and outcome—not an automated diagnosis.",
    questions: [
      {
        prompt: "What type of recurring work creates the most friction?",
        options: [
          { label: "Finding information", score: 0 },
          { label: "Reading or producing documents", score: 1 },
          { label: "Making repeated process decisions", score: 2 },
        ],
      },
      {
        prompt: "How available is the underlying information?",
        options: [
          { label: "Scattered or inconsistent", score: 0 },
          { label: "Available but not well connected", score: 1 },
          { label: "Structured and accessible", score: 2 },
        ],
      },
      {
        prompt: "How clear is the desired outcome?",
        options: [
          { label: "Still exploratory", score: 0 },
          { label: "A workflow to improve is known", score: 1 },
          { label: "A measurable outcome is defined", score: 2 },
        ],
      },
    ],
    results: [
      {
        min: 0,
        title: "Knowledge access exploration",
        body: "A useful first test may focus on retrieving and summarizing trusted internal information while you improve data foundations.",
        actions: [
          "Choose a bounded knowledge source",
          "Define trusted answers",
          "Test retrieval quality",
        ],
      },
      {
        min: 3,
        title: "AI-assisted workflow",
        body: "A recurring workflow appears suitable for a focused prototype that keeps people in control while testing usefulness.",
        actions: ["Map the current workflow", "Define review points", "Measure time or quality"],
      },
      {
        min: 5,
        title: "Focused proof-of-concept",
        body: "You may have the process clarity and information needed for a bounded proof-of-concept with explicit success criteria.",
        actions: [
          "Define one use case",
          "Agree evaluation criteria",
          "Limit the initial data scope",
        ],
      },
    ],
  },
};

export function Assessment({ type }: { type: Exclude<LeadType, "general" | "partnership"> }) {
  const config = configs[type];
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [contact, setContact] = useState(false);
  const complete = step >= config.questions.length;
  const total = scores.reduce((a, b) => a + b, 0);
  const result = [...config.results].reverse().find((r) => total >= r.min) ?? {
    min: 0,
    title: "Exploration result",
    body: "Your answers provide a useful starting point for a focused conversation.",
    actions: ["Review the current process"],
  };
  function answer(score: number) {
    const next = [...scores];
    next[step] = score;
    setScores(next);
    setStep(step + 1);
    track(step + 1 === config.questions.length ? "assessment_complete" : "assessment_step", {
      assessment: type,
      step: step + 1,
    });
  }
  return (
    <>
      <div hidden={!contact} className="mx-auto max-w-2xl">
        <Button variant="ghost" className="mb-6" onClick={() => setContact(false)}>
          <ArrowLeft className="size-4" />
          Back to your result
        </Button>
        <LeadForm initialType={type} />
      </div>
      <div hidden={contact} className="mx-auto max-w-3xl">
        {!complete ? (
          <>
            <div className="mb-10">
              <div className="mb-3 flex justify-between text-xs font-medium text-muted-foreground">
                <span>{config.label}</span>
                <span>
                  {step + 1} / {config.questions.length}
                </span>
              </div>
              <div className="h-1 bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((step + 1) / config.questions.length) * 100}%` }}
                />
              </div>
            </div>
            <h2 className="text-3xl font-medium">{config.questions[step]?.prompt}</h2>
            <div className="mt-8 grid gap-3">
              {config.questions[step]?.options.map((option) => (
                <Button
                  variant="ghost"
                  key={option.label}
                  aria-pressed={scores[step] === option.score}
                  onClick={() => answer(option.score)}
                  className={`flex h-auto min-h-16 justify-between whitespace-normal rounded-control border bg-background p-5 text-left font-medium hover:border-primary hover:bg-secondary ${
                    scores[step] === option.score ? "border-primary bg-secondary" : "border-border"
                  }`}
                >
                  {option.label}
                  <ArrowRight className="size-5 text-primary" />
                </Button>
              ))}
            </div>
            {step > 0 && (
              <Button
                variant="ghost"
                className="mt-6"
                onClick={() => {
                  setStep(step - 1);
                }}
              >
                <ArrowLeft />
                Back
              </Button>
            )}
          </>
        ) : (
          <div className="rounded-card border border-border bg-secondary p-7 sm:p-10">
            <p className="text-xs font-medium text-primary">Your exploration area</p>
            <h2 className="mt-4 text-4xl font-medium">{result.title}</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{result.body}</p>
            <div className="mt-8 border-y border-border py-6">
              <p className="text-xs font-medium">Useful next actions</p>
              <ul className="mt-4 space-y-3">
                {result.actions.map((x) => (
                  <li className="flex gap-3" key={x}>
                    <CheckCircle2 className="mt-0.5 size-5 text-primary" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              This result is directional, based only on your answers. It is not a technical
              diagnosis.
            </p>
            <Button size="lg" className="mt-7" onClick={() => setContact(true)}>
              Discuss this result
              <ArrowRight />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export function AssessmentIntro({ type }: { type: Exclude<LeadType, "general" | "partnership"> }) {
  const c = configs[type];
  return (
    <>
      <div className="mb-12 max-w-2xl">
        <p className="type-eyebrow text-primary">{c.label}</p>
        <h1 className="hero-title mt-5">{c.title}</h1>
        <p className="type-lead mt-6 text-muted-foreground">{c.description}</p>
        <p className="mt-5 text-sm text-muted-foreground">
          Three questions. Your result appears before any contact details are requested.
        </p>
      </div>
      <Assessment type={type} />
    </>
  );
}
