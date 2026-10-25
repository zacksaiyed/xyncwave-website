import { ArrowRight } from "lucide-react";
import type { FormEvent, RefObject } from "react";
import type { PageContext } from "../../lib/ask-xwc/types";

type IntentSurfaceProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  pageContext: PageContext;
  busy: boolean;
  hasResult: boolean;
  inputRef: RefObject<HTMLTextAreaElement | null>;
};

export function IntentSurface({
  value,
  onChange,
  onSubmit,
  pageContext,
  busy,
  hasResult,
  inputRef,
}: IntentSurfaceProps) {
  const inputId = "ask-xwc-intent";
  return (
    <section className={`ask-xwc-intent-surface ${hasResult ? "is-follow-up" : ""}`}>
      <div className="ask-xwc-intent-heading">
        {hasResult ? <p className="ask-xwc-eyebrow">Continue exploring</p> : null}
        <h2 id="ask-xwc-question">
          {hasResult
            ? "What should we examine next?"
            : "What are you trying to understand or improve?"}
        </h2>
        <p>Describe the situation, system, workflow or technology decision.</p>
      </div>

      {!hasResult && pageContext.suggestions.length ? (
        <div className="ask-xwc-suggestions" aria-label="Suggested starting points">
          {pageContext.suggestions.map((suggestion) => (
            <button
              type="button"
              key={suggestion}
              onClick={() => {
                onChange(suggestion);
                inputRef.current?.focus();
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="ask-xwc-intent-form">
        <label htmlFor={inputId} className="sr-only">
          Describe what you are trying to understand or improve
        </label>
        <textarea
          ref={inputRef}
          id={inputId}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="For example: We run key operations across WhatsApp, Excel and Tally…"
          maxLength={2000}
          rows={hasResult ? 3 : 5}
          disabled={busy}
        />
        <div className="ask-xwc-form-actions">
          <span>{value.length ? `${value.length} / 2000` : "Start with the business problem"}</span>
          <button type="submit" disabled={busy || !value.trim()}>
            {hasResult ? "Continue" : "Explore"}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </form>
    </section>
  );
}
