import {
  createTypedComponentRegistry,
  type TypedComponentDescriptor,
} from "../../../lib/ask-xwc/component-registry";
import { EvidencePanel } from "../evidence-panel";
import { HandoffSurface } from "../handoff-surface";

const approvedRenderers = createTypedComponentRegistry({
  evidence_panel: EvidencePanel,
  handoff_preview: HandoffSurface,
});

export function TypedComponentRenderer({
  component,
  onNavigate,
}: {
  component: TypedComponentDescriptor;
  onNavigate: () => void;
}) {
  if (component.type === "evidence_panel" && approvedRenderers.evidence_panel)
    return <EvidencePanel {...component.props} onNavigate={onNavigate} />;
  if (component.type === "handoff_preview" && approvedRenderers.handoff_preview)
    return <HandoffSurface {...component.props} onNavigate={onNavigate} />;
  return null;
}
