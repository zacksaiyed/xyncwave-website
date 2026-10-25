import type { AskXwcState, ExplorationStep, PageContext, XwcHandoff, XwcSource } from "./types";

const THREAD_STORAGE_KEY = "xwc-intelligence-thread";

export const initialAskXwcState: AskXwcState = {
  status: "closed",
  threadId: null,
  runId: null,
  currentIntent: "",
  answer: "",
  sources: [],
  handoff: null,
  trail: [],
  error: null,
};

export type AskXwcAction =
  | { type: "open" }
  | { type: "close" }
  | { type: "set_thread"; threadId: string }
  | { type: "start"; intent: string; runId: string }
  | { type: "stream_started" }
  | { type: "append_text"; text: string }
  | { type: "set_sources"; sources: XwcSource[] }
  | { type: "set_handoff"; handoff: XwcHandoff | null }
  | { type: "cancel_current" }
  | { type: "complete" }
  | { type: "fail"; message: string };

function makeTrailStep(label: string): ExplorationStep {
  return {
    id: crypto.randomUUID(),
    label: label.length > 84 ? `${label.slice(0, 81).trimEnd()}…` : label,
  };
}

export function askXwcReducer(state: AskXwcState, action: AskXwcAction): AskXwcState {
  switch (action.type) {
    case "open":
      return {
        ...state,
        status: state.error ? "error" : state.answer ? "complete" : "ready",
      };
    case "close":
      return { ...state, status: "closed" };
    case "set_thread":
      return { ...state, threadId: action.threadId };
    case "start": {
      const prior = state.currentIntent.trim();
      const nextTrail =
        prior && prior !== action.intent ? [...state.trail, makeTrailStep(prior)] : state.trail;
      return {
        ...state,
        status: "connecting",
        runId: action.runId,
        currentIntent: action.intent,
        answer: "",
        sources: [],
        handoff: null,
        trail: nextTrail.slice(-5),
        error: null,
      };
    }
    case "stream_started":
      return state.status === "error" ? state : { ...state, status: "streaming" };
    case "append_text":
      return { ...state, answer: state.answer + action.text };
    case "set_sources":
      return { ...state, sources: action.sources };
    case "set_handoff":
      return { ...state, handoff: action.handoff };
    case "cancel_current":
      return {
        ...state,
        status: "ready",
        runId: null,
        answer: "",
        sources: [],
        handoff: null,
        error: null,
      };
    case "complete":
      return state.status === "error" ? state : { ...state, status: "complete" };
    case "fail":
      return { ...state, status: "error", error: action.message };
  }
}

const routeContexts: Record<string, PageContext> = {
  "/": {
    label: "XWC home",
    suggestions: [
      "Fragmented operations",
      "Systems do not connect",
      "Legacy technology",
      "Engineering constraints",
      "AI uncertainty",
    ],
  },
  "/about": {
    label: "About XWC",
    suggestions: ["Explore how XWC works with organizations"],
  },
  "/why-xyncwave": {
    label: "Why XWC",
    suggestions: ["Explore the XWC approach to technology delivery"],
  },
  "/solutions": {
    label: "Solutions",
    suggestions: ["Help me shape the problem before choosing a solution"],
  },
  "/industries": {
    label: "Industries",
    suggestions: ["Explore an operational problem in my industry"],
  },
  "/case-studies": {
    label: "Case Studies",
    suggestions: ["Find XWC evidence relevant to my situation"],
  },
  "/case-studies/track-trace": {
    label: "Track & Trace case study",
    suggestions: ["Explore how this connected-operations evidence relates to my situation"],
  },
  "/case-studies/engineering-capacity": {
    label: "Engineering Capacity case study",
    suggestions: ["Explore how this delivery evidence relates to my situation"],
  },
  "/insights": {
    label: "Insights",
    suggestions: ["Find an XWC perspective relevant to my situation"],
  },
  "/contact": {
    label: "Contact XWC",
    suggestions: ["Help me shape what I need before contacting XWC"],
  },
  "/start-a-conversation": {
    label: "Start a Conversation",
    suggestions: ["Help me clarify the challenge I want to discuss"],
  },
  "/technology-partnership": {
    label: "Technology Partnership",
    suggestions: ["Explore the technology partnership I need"],
  },
  "/digitalization-assessment": {
    label: "Digitalization Assessment",
    suggestions: ["Explore a manual or disconnected workflow"],
  },
  "/ai-opportunity-assessment": {
    label: "AI Opportunity Assessment",
    suggestions: ["Explore where AI could create practical value"],
  },
  "/engineering-capacity-assessment": {
    label: "Engineering Capacity Assessment",
    suggestions: ["Explore an engineering delivery constraint"],
  },
  "/search": {
    label: "Site Search",
    suggestions: ["Help me find the most relevant XWC information"],
  },
  "/privacy": {
    label: "Privacy",
    suggestions: ["Help me understand XWC or find another page"],
  },
  "/terms": {
    label: "Website Terms",
    suggestions: ["Help me understand XWC or find another page"],
  },
  "/industries/logistics": {
    label: "Logistics & Supply Chain",
    suggestions: ["Explore a logistics operations problem"],
  },
  "/industries/manufacturing": {
    label: "Manufacturing",
    suggestions: ["Explore a manufacturing operations problem"],
  },
  "/industries/healthcare": {
    label: "Healthcare",
    suggestions: ["Explore a healthcare workflow or data problem"],
  },
  "/industries/fintech": {
    label: "Fintech",
    suggestions: ["Explore a fintech platform or integration problem"],
  },
  "/industries/technology-it-services": {
    label: "Technology & IT Services",
    suggestions: ["Explore a technology delivery constraint"],
  },
  "/solutions/software-engineering": {
    label: "Software Engineering",
    suggestions: ["Explore a software engineering requirement"],
  },
  "/solutions/application-modernization": {
    label: "Application Modernization",
    suggestions: ["Explore a modernization decision"],
  },
  "/solutions/digital-transformation": {
    label: "Digital Transformation",
    suggestions: ["Explore a disconnected operational workflow"],
  },
  "/solutions/cloud-platform-engineering": {
    label: "Cloud & Platform Engineering",
    suggestions: ["Explore a cloud or platform engineering decision"],
  },
  "/solutions/data-engineering": {
    label: "Data Engineering & Analytics",
    suggestions: ["Explore a data pipeline or reporting problem"],
  },
  "/solutions/ai-automation": {
    label: "AI & Intelligent Automation",
    suggestions: ["Explore where AI could create practical value"],
  },
  "/solutions/integration": {
    label: "API & System Integration",
    suggestions: ["Explore a system integration boundary"],
  },
  "/solutions/erp-business-systems": {
    label: "ERP / Business Systems",
    suggestions: ["Explore an ERP / operational-system boundary"],
  },
  "/solutions/engineering-capacity": {
    label: "Engineering Capacity",
    suggestions: ["Explore an engineering delivery constraint"],
  },
};

function pageNameFromPath(route: string): string {
  const segment = route.split("/").filter(Boolean).at(-1);
  if (!segment) return "XWC home";
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getPageContext(pathname: string): PageContext {
  const route = pathname.replace(/\/+$/, "") || "/";
  const exact = routeContexts[route];
  if (exact) return exact;
  if (route.startsWith("/insights/"))
    return {
      label: `Insight · ${pageNameFromPath(route)}`,
      suggestions: ["Explore how this perspective applies to my situation"],
    };
  if (route.startsWith("/case-studies/"))
    return {
      label: `Case study · ${pageNameFromPath(route)}`,
      suggestions: ["Explore how this evidence relates to my situation"],
    };
  if (route.startsWith("/lp/"))
    return {
      label: `XWC guide · ${pageNameFromPath(route)}`,
      suggestions: ["Explore how this relates to my business problem"],
    };
  if (route.startsWith("/thank-you/"))
    return {
      label: `Next steps · ${pageNameFromPath(route)}`,
      suggestions: ["Continue exploring this topic"],
    };
  return {
    label: pageNameFromPath(route),
    suggestions: ["Help me understand where to start"],
  };
}

export function getOrCreateThreadId(storage: Pick<Storage, "getItem" | "setItem"> | null): string {
  try {
    const stored = storage?.getItem(THREAD_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    // Session storage may be unavailable; an in-memory ID still supports the active exploration.
  }

  const threadId = crypto.randomUUID();
  try {
    storage?.setItem(THREAD_STORAGE_KEY, threadId);
  } catch {
    // Storage restrictions must never prevent Ask XWC from working.
  }
  return threadId;
}
