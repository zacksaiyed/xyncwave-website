import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { submitLead, type LeadType } from "../lib/leads";
import { track } from "../lib/analytics";

const problems: {
  value: LeadType | "not-sure";
  problem: string;
  label: string;
  description: string;
}[] = [
  {
    value: "digitalization",
    problem: "operations",
    label: "Operations",
    description: "Manual processes, spreadsheets, or work that is difficult to see and control.",
  },
  {
    value: "engineering",
    problem: "engineering",
    label: "Engineering",
    description: "A backlog, deadline, specialist gap, or delivery-capacity constraint.",
  },
  {
    value: "ai",
    problem: "ai",
    label: "AI",
    description: "A recurring workflow or knowledge problem that may benefit from AI.",
  },
  {
    value: "digitalization",
    problem: "modernization",
    label: "Modernization",
    description: "An application or platform that is increasingly difficult to change.",
  },
  {
    value: "digitalization",
    problem: "integration",
    label: "Integration",
    description: "Systems or data that do not move together reliably.",
  },
  {
    value: "partnership",
    problem: "technology-strategy",
    label: "Technology strategy",
    description: "A decision, roadmap, or longer-term delivery partnership.",
  },
  {
    value: "not-sure",
    problem: "something-else",
    label: "Something else",
    description: "There is a problem, but the right technical path is not clear yet.",
  },
];

const detailFields: Record<LeadType, { key: string; label: string; placeholder: string }[]> = {
  general: [],
  digitalization: [
    { key: "industry", label: "Industry", placeholder: "e.g. Logistics" },
    {
      key: "current_systems",
      label: "Current systems",
      placeholder: "ERP, spreadsheets, internal tools…",
    },
    {
      key: "manual_process",
      label: "Biggest manual process",
      placeholder: "What takes the most effort today?",
    },
    { key: "locations", label: "Locations or facilities", placeholder: "e.g. 3 warehouses" },
  ],
  engineering: [
    {
      key: "skills",
      label: "Skills or capability",
      placeholder: "e.g. React, platform engineering",
    },
    { key: "capacity", label: "Capacity needed", placeholder: "Engineer, pod, or project team" },
    { key: "duration", label: "Likely duration", placeholder: "e.g. 6 months" },
    { key: "timezone", label: "Timezone overlap", placeholder: "What overlap is important?" },
  ],
  ai: [
    {
      key: "process",
      label: "Process to explore",
      placeholder: "What recurring work is involved?",
    },
    {
      key: "current_usage",
      label: "Current AI usage",
      placeholder: "None, informal tools, or existing pilots",
    },
    {
      key: "data",
      label: "Available information",
      placeholder: "Documents, records, messages, or other data",
    },
    { key: "outcome", label: "Desired outcome", placeholder: "What should improve?" },
  ],
  partnership: [
    {
      key: "partnership_need",
      label: "Partnership need",
      placeholder: "What should a partner help you achieve?",
    },
    { key: "timing", label: "Timing", placeholder: "When does the work need to begin?" },
  ],
};

export function LeadForm({
  initialType = "general",
  compact = false,
}: {
  initialType?: LeadType;
  compact?: boolean;
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(initialType === "general" ? 1 : 2);
  const [leadType, setLeadType] = useState<LeadType>(initialType);
  const [problem, setProblem] = useState(initialType === "general" ? "" : initialType);
  const [detailsByType, setDetailsByType] = useState<
    Partial<Record<LeadType, Record<string, string>>>
  >({});
  const [draft, setDraft] = useState({
    name: "",
    workEmail: "",
    company: "",
    role: "",
    message: "",
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function choose(value: LeadType | "not-sure", selectedProblem: string) {
    const mapped = value === "not-sure" ? "general" : value;
    setLeadType(mapped);
    setProblem(selectedProblem);
    setStep(2);
    track("form_step", { step: 1, solution: mapped });
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await submitLead({
        ...draft,
        leadType,
        problem: problem || leadType,
        details: detailsByType[leadType] ?? {},
      });
      track("form_submit", { lead_type: leadType });
      track("lead_generated", { lead_type: leadType });
      await navigate({ to: "/thank-you/$type", params: { type: leadType } as never });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again.");
      track("form_error", { lead_type: leadType });
    } finally {
      setPending(false);
    }
  }

  if (step === 1)
    return (
      <div
        onFocus={() =>
          track("form_start", { placement: compact ? "embedded" : "conversation_page" })
        }
      >
        <p className="mb-2 text-2xl font-medium">What are you trying to solve?</p>
        <p className="mb-7 text-sm leading-6 text-muted-foreground">
          Choose the closest starting point. You can explain the detail next.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {problems.map((item) => (
            <Button
              variant="ghost"
              type="button"
              key={item.problem}
              onClick={() => choose(item.value, item.problem)}
              className="group h-auto min-h-28 justify-between rounded-xl border border-border bg-background p-5 text-left whitespace-normal hover:border-primary hover:bg-secondary"
            >
              <span>
                <strong className="block text-base font-medium">{item.label}</strong>
                <span className="mt-2 block text-sm font-normal leading-5 text-muted-foreground">
                  {item.description}
                </span>
              </span>
              <ArrowRight className="ml-5 size-5 shrink-0 text-primary" />
            </Button>
          ))}
        </div>
      </div>
    );

  const fields = detailFields[leadType];
  const details = detailsByType[leadType] ?? {};
  const selectedProblemLabel = problems.find((item) => item.problem === problem)?.label;
  return (
    <form
      onSubmit={submit}
      className="space-y-6"
      onFocus={() =>
        track("form_start", {
          placement: compact ? "embedded" : "conversation_page",
          solution: leadType,
        })
      }
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className="text-xs font-medium text-primary">
            {selectedProblemLabel ??
              (leadType === "general"
                ? "Start here"
                : problems.find((item) => item.value === leadType)?.label)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            We use this context to make the first conversation useful.
          </p>
        </div>
        {initialType === "general" && (
          <Button type="button" variant="ghost" size="sm" onClick={() => setStep(1)}>
            <ArrowLeft /> Change
          </Button>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          autoComplete="name"
          required
          value={draft.name}
          onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
        />
        <Field
          label="Work email"
          name="workEmail"
          type="email"
          autoComplete="email"
          required
          value={draft.workEmail}
          onChange={(event) =>
            setDraft((current) => ({ ...current, workEmail: event.target.value }))
          }
        />
        <Field
          label="Company"
          name="company"
          autoComplete="organization"
          required
          value={draft.company}
          onChange={(event) => setDraft((current) => ({ ...current, company: event.target.value }))}
        />
        <Field
          label="Role (optional)"
          name="role"
          autoComplete="organization-title"
          value={draft.role}
          onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))}
        />
      </div>
      {fields.length > 0 && (
        <div className="grid gap-5 border-y border-border py-6 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                className="mt-2 h-12"
                placeholder={field.placeholder}
                value={details[field.key] ?? ""}
                onChange={(event) =>
                  setDetailsByType((current) => ({
                    ...current,
                    [leadType]: { ...(current[leadType] ?? {}), [field.key]: event.target.value },
                  }))
                }
              />
            </div>
          ))}
        </div>
      )}
      <div>
        <Label htmlFor="message">What are you trying to solve?</Label>
        <Textarea
          id="message"
          name="message"
          required
          maxLength={3000}
          className="mt-2 min-h-32"
          placeholder="Tell us what is not working, what needs to change, and any timing that matters."
          value={draft.message}
          onChange={(event) => setDraft((current) => ({ ...current, message: event.target.value }))}
        />
      </div>
      <div aria-hidden="true" className="hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Share the Challenge"}
        <ArrowRight />
      </Button>
      <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
        No budget field. No generic sales script. Just enough context for a relevant conversation.
      </p>
    </form>
  );
}

function Field(props: React.ComponentProps<typeof Input> & { label: string; name: string }) {
  const { label, name, ...rest } = props;
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} className="mt-2 h-12" maxLength={255} {...rest} />
    </div>
  );
}
