export type IntelligenceStatus =
  "closed" | "ready" | "connecting" | "streaming" | "complete" | "error";

export type AskXwcMessage = {
  id: string;
  role: "user";
  content: string;
};

export type AskXwcRunInput = {
  threadId: string;
  runId: string;
  messages: AskXwcMessage[];
  tools: [];
  context: [];
  forwardedProps: Record<string, never>;
};

export type XwcSource = {
  id: string;
  title: string;
  route?: string;
};

export type XwcHandoff = {
  title: string;
  body: string;
  route: string;
  actionLabel: string;
};

export type ExplorationStep = {
  id: string;
  label: string;
};

export type PageContext = {
  label: string;
  suggestions: readonly string[];
};

export type AskXwcState = {
  status: IntelligenceStatus;
  threadId: string | null;
  runId: string | null;
  currentIntent: string;
  answer: string;
  sources: XwcSource[];
  handoff: XwcHandoff | null;
  trail: ExplorationStep[];
  error: string | null;
};

export type AgUiEvent = Record<string, unknown> & {
  type: string;
};
