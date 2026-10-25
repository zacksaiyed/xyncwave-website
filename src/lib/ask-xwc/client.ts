import { consumeSseResponse } from "./sse";
import type { AgUiEvent, AskXwcRunInput, XwcHandoff, XwcSource } from "./types";

const PRODUCTION_ENDPOINT = "https://36ujwub6ja.execute-api.ap-south-1.amazonaws.com/dev/";
const ASK_XWC_ENDPOINT = import.meta.env?.DEV
  ? "/api/ask-xwc"
  : (import.meta.env?.["VITE_ASK_XWC_API_URL"] ?? PRODUCTION_ENDPOINT);

export type AskXwcStreamHandlers = {
  onRunStarted?: () => void;
  onTextStarted?: () => void;
  onTextDelta: (delta: string) => void;
  onSources: (sources: XwcSource[]) => void;
  onHandoff: (handoff: XwcHandoff | null) => void;
  onFinished: () => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function nestedString(
  record: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const direct = stringValue(record[key]);
    if (direct) return direct;
  }
  const metadata = isRecord(record["metadata"]) ? record["metadata"] : null;
  if (!metadata) return undefined;
  for (const key of keys) {
    const nested = stringValue(metadata[key]);
    if (nested) return nested;
  }
  return undefined;
}

function internalRoute(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\"))
    return value.split(/[?#]/, 1)[0] || "/";
  try {
    const url = new URL(value);
    if (url.hostname !== "xyncwave.com" && url.hostname !== "www.xyncwave.com") return undefined;
    return url.pathname || "/";
  } catch {
    return undefined;
  }
}

function titleFromRoute(route: string | undefined): string {
  if (!route || route === "/") return "XWC website";
  const segment = route.split("/").filter(Boolean).at(-1) ?? "XWC knowledge";
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function normalizeSources(value: unknown): XwcSource[] {
  const unwrapped = isRecord(value) && Array.isArray(value["sources"]) ? value["sources"] : value;
  const items = Array.isArray(unwrapped) ? unwrapped : unwrapped ? [unwrapped] : [];
  const seen = new Set<string>();
  const sources: XwcSource[] = [];

  for (const item of items) {
    if (typeof item === "string") {
      const route = internalRoute(item);
      const title = route ? titleFromRoute(route) : item.trim();
      if (!title) continue;
      const key = `${title}|${route ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      sources.push({ id: key, title, ...(route ? { route } : {}) });
      continue;
    }
    if (!isRecord(item)) continue;
    const route = internalRoute(
      nestedString(item, ["route", "path", "url", "href", "source_url", "source"]),
    );
    const title =
      nestedString(item, ["title", "name", "label", "document_title"]) ?? titleFromRoute(route);
    const key = `${title}|${route ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({ id: key, title, ...(route ? { route } : {}) });
  }

  return sources;
}

export function normalizeHandoff(value: unknown): XwcHandoff | null {
  if (value === false || value === null || value === undefined) return null;
  if (isRecord(value) && (value["show"] === false || value["recommended"] === false)) return null;
  const record = isRecord(value) ? value : null;
  const body =
    (record && nestedString(record, ["body", "reason", "description", "message"])) ||
    (typeof value === "string" ? value.trim() : "") ||
    "Continue with XWC to examine the situation and define a practical next step.";
  const title =
    (record && nestedString(record, ["title", "headline"])) || "This needs a closer look";
  const route =
    internalRoute(record ? nestedString(record, ["route", "path", "url", "href"]) : undefined) ??
    "/start-a-conversation";
  const actionLabel =
    (record && nestedString(record, ["actionLabel", "action_label", "cta", "label"])) ||
    "Continue with XWC";
  return { title, body, route, actionLabel };
}

function asAgUiEvent(value: unknown): AgUiEvent | null {
  if (!isRecord(value)) return null;
  const type = stringValue(value["type"]);
  return type ? ({ ...value, type } as AgUiEvent) : null;
}

export function textDeltaFromEvent(event: Record<string, unknown>): string | undefined {
  const value = typeof event["delta"] === "string" ? event["delta"] : event["content"];
  return typeof value === "string" && value.length ? value : undefined;
}

function customValue(event: AgUiEvent): unknown {
  if ("value" in event) return event["value"];
  if ("data" in event) return event["data"];
  return undefined;
}

export async function streamAskXwc(
  input: AskXwcRunInput,
  signal: AbortSignal,
  handlers: AskXwcStreamHandlers,
): Promise<void> {
  const response = await fetch(ASK_XWC_ENDPOINT, {
    method: "POST",
    headers: { Accept: "text/event-stream", "Content-Type": "application/json" },
    body: JSON.stringify(input),
    signal,
  });

  let finished = false;
  let failed = false;

  await consumeSseResponse(response, {
    signal,
    onEvent: (rawEvent) => {
      const event = asAgUiEvent(rawEvent);
      if (!event) return;
      switch (event.type.toUpperCase()) {
        case "RUN_STARTED":
          handlers.onRunStarted?.();
          break;
        case "TEXT_MESSAGE_START":
          handlers.onTextStarted?.();
          break;
        case "TEXT_MESSAGE_CONTENT": {
          const delta = textDeltaFromEvent(event);
          if (delta) handlers.onTextDelta(delta);
          break;
        }
        case "CUSTOM": {
          const name = stringValue(event["name"]);
          if (name === "xwc.sources") handlers.onSources(normalizeSources(customValue(event)));
          if (name === "xwc.handoff") handlers.onHandoff(normalizeHandoff(customValue(event)));
          break;
        }
        case "RUN_ERROR":
          failed = true;
          break;
        case "RUN_FINISHED":
          if (!failed) {
            finished = true;
            handlers.onFinished();
          }
          break;
      }
    },
  });

  if (failed) throw new Error("Ask XWC run failed");
  if (!finished) throw new Error("Ask XWC stream ended before completion");
}
