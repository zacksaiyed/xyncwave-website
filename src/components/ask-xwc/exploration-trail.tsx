import { ChevronRight } from "lucide-react";
import type { ExplorationStep } from "../../lib/ask-xwc/types";

export function ExplorationTrail({ steps }: { steps: ExplorationStep[] }) {
  if (!steps.length) return null;
  return (
    <nav className="ask-xwc-trail" aria-label="Exploration trail">
      <p>Exploration trail</p>
      <ol>
        {steps.map((step) => (
          <li key={step.id}>
            <ChevronRight aria-hidden="true" />
            <span>{step.label}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
