import { ArrowRight } from "lucide-react";
import type { XwcHandoff } from "../../lib/ask-xwc/types";
import { SmartLink } from "../app-link";

export function HandoffSurface({
  handoff,
  onNavigate,
}: {
  handoff: XwcHandoff;
  onNavigate?: () => void;
}) {
  return (
    <section className="ask-xwc-handoff">
      <p className="ask-xwc-eyebrow">Next action</p>
      <h3>{handoff.title}</h3>
      <p>{handoff.body}</p>
      <SmartLink to={handoff.route} onClick={onNavigate}>
        {handoff.actionLabel}
        <ArrowRight aria-hidden="true" />
      </SmartLink>
    </section>
  );
}
