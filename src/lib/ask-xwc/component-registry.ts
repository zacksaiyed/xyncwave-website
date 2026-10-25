import type { ComponentType } from "react";
import type { XwcHandoff, XwcSource } from "./types";

export const approvedComponentTypes = [
  "intent_summary",
  "choice_selector",
  "current_state_map",
  "opportunity_map",
  "evidence_panel",
  "navigation_options",
  "handoff_preview",
  "brief_section",
] as const;

export type TypedComponentType = (typeof approvedComponentTypes)[number];

export type TypedComponentPayloads = {
  intent_summary: { title: string; detail?: string };
  choice_selector: { prompt: string; options: Array<{ id: string; label: string }> };
  current_state_map: { title: string; nodes: Array<{ id: string; label: string }> };
  opportunity_map: { title: string; opportunities: Array<{ id: string; label: string }> };
  evidence_panel: { sources: XwcSource[] };
  navigation_options: { options: Array<{ label: string; route: string }> };
  handoff_preview: { handoff: XwcHandoff };
  brief_section: { title: string; body: string };
};

export type TypedComponentDescriptor = {
  [Type in TypedComponentType]: {
    id: string;
    type: Type;
    props: TypedComponentPayloads[Type];
  };
}[TypedComponentType];

export type TypedComponentRegistry = Partial<{
  [Type in TypedComponentType]: ComponentType<TypedComponentPayloads[Type]>;
}>;

const approvedTypes = new Set<string>(approvedComponentTypes);

export function isApprovedComponentType(value: unknown): value is TypedComponentType {
  return typeof value === "string" && approvedTypes.has(value);
}

/**
 * Creates a closed registry. Future AG-UI events may select one of these renderers,
 * but can never supply executable markup, styles, or JavaScript.
 */
export function createTypedComponentRegistry(
  renderers: TypedComponentRegistry,
): Readonly<TypedComponentRegistry> {
  const filtered: TypedComponentRegistry = {};
  for (const type of approvedComponentTypes) {
    const renderer = renderers[type] as ComponentType<never> | undefined;
    if (renderer) (filtered as Record<string, ComponentType<never>>)[type] = renderer;
  }
  return Object.freeze(filtered);
}
