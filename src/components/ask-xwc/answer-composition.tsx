import { RotateCcw } from "lucide-react";
import type { IntelligenceStatus } from "../../lib/ask-xwc/types";
import { AgenticActivity } from "./agentic-activity";

export function AnswerComposition({
  answer,
  status,
  error,
  onRetry,
}: {
  answer: string;
  status: IntelligenceStatus;
  error: string | null;
  onRetry: () => void;
}) {
  const waiting = status === "connecting" || (status === "streaming" && !answer);
  if (waiting) return <AgenticActivity />;
  if (!answer && status !== "error") return null;

  return (
    <section className="ask-xwc-answer" aria-busy={status === "streaming"}>
      {answer ? (
        <>
          <p className="ask-xwc-eyebrow">XWC perspective</p>
          <div className="ask-xwc-answer-copy">
            {answer
              .trim()
              .split(/\n{2,}/)
              .map((paragraph, index) => (
                <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
              ))}
          </div>
        </>
      ) : null}

      {status === "error" ? (
        <div className="ask-xwc-error" role="alert">
          <h3>Ask XWC is temporarily unavailable.</h3>
          <p>{error ?? "The exploration could not be completed just now."}</p>
          <button type="button" onClick={onRetry}>
            <RotateCcw aria-hidden="true" />
            Try again
          </button>
        </div>
      ) : null}
    </section>
  );
}
