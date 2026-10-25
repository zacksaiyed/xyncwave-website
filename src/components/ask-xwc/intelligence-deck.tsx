import { X } from "lucide-react";
import type { FormEvent, KeyboardEvent, RefObject } from "react";
import type { TypedComponentDescriptor } from "../../lib/ask-xwc/component-registry";
import type { AskXwcState, PageContext } from "../../lib/ask-xwc/types";
import { AnswerComposition } from "./answer-composition";
import { ExplorationTrail } from "./exploration-trail";
import { IntentSurface } from "./intent-surface";
import { TypedComponentRenderer } from "./typed-ui/typed-component-renderer";

type IntelligenceDeckProps = {
  state: AskXwcState;
  value: string;
  pageContext: PageContext;
  isMobile: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  inputRef: RefObject<HTMLTextAreaElement | null>;
  onValueChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRetry: () => void;
  onClose: () => void;
  onNavigate: () => void;
};

function trapMobileFocus(event: KeyboardEvent<HTMLElement>, isMobile: boolean) {
  if (!isMobile || event.key !== "Tab") return;
  const focusable = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("hidden"));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

export function IntelligenceDeck({
  state,
  value,
  pageContext,
  isMobile,
  headingRef,
  inputRef,
  onValueChange,
  onSubmit,
  onRetry,
  onClose,
  onNavigate,
}: IntelligenceDeckProps) {
  const busy = state.status === "connecting" || state.status === "streaming";
  const hasExploration =
    Boolean(state.currentIntent) && !(state.status === "ready" && !state.answer);
  const surfaces: TypedComponentDescriptor[] = [
    ...(state.sources.length
      ? [
          {
            id: "current-evidence",
            type: "evidence_panel" as const,
            props: { sources: state.sources },
          },
        ]
      : []),
    ...(state.handoff
      ? [
          {
            id: "current-handoff",
            type: "handoff_preview" as const,
            props: { handoff: state.handoff },
          },
        ]
      : []),
  ];

  return (
    <aside
      className="ask-xwc-deck"
      role={isMobile ? "dialog" : "region"}
      aria-modal={isMobile ? true : undefined}
      aria-labelledby="ask-xwc-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onClose();
          return;
        }
        trapMobileFocus(event, isMobile);
      }}
    >
      <header className="ask-xwc-deck-header">
        <div>
          <p className="ask-xwc-eyebrow">Intelligent experience</p>
          <h1 id="ask-xwc-title" ref={headingRef} tabIndex={-1}>
            Ask XWC
          </h1>
        </div>
        <button type="button" onClick={onClose} aria-label="Close Ask XWC">
          <X aria-hidden="true" />
        </button>
      </header>

      <div className="ask-xwc-deck-scroll">
        {!hasExploration ? (
          <IntentSurface
            value={value}
            onChange={onValueChange}
            onSubmit={onSubmit}
            pageContext={pageContext}
            busy={busy}
            hasResult={false}
            inputRef={inputRef}
          />
        ) : (
          <div className="ask-xwc-result">
            <ExplorationTrail steps={state.trail} />
            <section className="ask-xwc-current-intent" aria-labelledby="ask-xwc-current-title">
              <p className="ask-xwc-eyebrow">Current exploration</p>
              <h2 id="ask-xwc-current-title">{state.currentIntent}</h2>
            </section>
            <AnswerComposition
              answer={state.answer}
              status={state.status}
              error={state.error}
              onRetry={onRetry}
            />
            {surfaces.map((surface) => (
              <TypedComponentRenderer
                key={surface.id}
                component={surface}
                onNavigate={onNavigate}
              />
            ))}
            {!busy ? (
              <IntentSurface
                value={value}
                onChange={onValueChange}
                onSubmit={onSubmit}
                pageContext={pageContext}
                busy={false}
                hasResult
                inputRef={inputRef}
              />
            ) : null}
          </div>
        )}
      </div>
    </aside>
  );
}
