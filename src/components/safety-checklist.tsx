import { useState } from "react";
import { Check } from "lucide-react";
import { track } from "../lib/analytics";

export function SafetyChecklist({
  items,
  slug,
  cluster,
}: {
  items: { label: string; question: string }[];
  slug: string;
  cluster: string;
}) {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const count = items.filter((i) => done[i.label]).length;
  function toggle(label: string) {
    setDone((d) => ({ ...d, [label]: !d[label] }));
    track("diagram_interaction", {
      article_slug: slug,
      topic_cluster: cluster,
      diagram: `safety-gate-${label}`,
    });
  }
  return (
    <div className="my-8 rounded-card border border-border bg-background p-5 sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium text-primary">Interactive checklist</p>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {count} of {items.length} answered
        </p>
      </div>
      <div className="mt-3 h-1 w-full bg-secondary">
        <div
          className="h-1 bg-primary transition-all"
          style={{ width: `${(count / items.length) * 100}%` }}
        />
      </div>
      <ul className="mt-5 grid gap-2" role="list">
        {items.map((item, i) => (
          <li key={item.label}>
            <button
              type="button"
              role="checkbox"
              aria-checked={!!done[item.label]}
              onClick={() => toggle(item.label)}
              className="flex w-full items-start gap-4 rounded-control border border-border p-4 text-left transition-colors hover:border-primary"
            >
              <span
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border ${done[item.label] ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}
              >
                {done[item.label] && <Check className="size-3.5" />}
              </span>
              <span>
                <span className="block text-xs text-primary">
                  0{i + 1} · {item.label}
                </span>
                <span className="mt-1 block font-medium">{item.question}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-sm text-muted-foreground">
        {count === items.length
          ? "All seven answered. The change has a clear basis for promotion."
          : "If any question has no clear answer, the change is not yet ready for production."}
      </p>
    </div>
  );
}
