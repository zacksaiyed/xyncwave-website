export class SseFrameParser {
  private buffer = "";

  push(chunk: string): unknown[] {
    this.buffer += chunk;
    const events: unknown[] = [];

    while (true) {
      const boundary = this.buffer.match(/\r?\n\r?\n/);
      if (!boundary || boundary.index === undefined) break;
      const frame = this.buffer.slice(0, boundary.index);
      this.buffer = this.buffer.slice(boundary.index + boundary[0].length);
      const parsed = parseSseFrame(frame);
      if (parsed !== null) events.push(parsed);
    }

    return events;
  }

  finish(): unknown[] {
    const frame = this.buffer.trim();
    this.buffer = "";
    if (!frame) return [];
    const parsed = parseSseFrame(frame);
    return parsed === null ? [] : [parsed];
  }
}

export function parseSseFrame(frame: string): unknown | null {
  const dataLines: string[] = [];
  let eventName = "";

  for (const rawLine of frame.split(/\r?\n/)) {
    if (!rawLine || rawLine.startsWith(":")) continue;
    const colon = rawLine.indexOf(":");
    const field = colon === -1 ? rawLine : rawLine.slice(0, colon);
    let value = colon === -1 ? "" : rawLine.slice(colon + 1);
    if (value.startsWith(" ")) value = value.slice(1);
    if (field === "data") dataLines.push(value);
    if (field === "event") eventName = value;
  }

  if (!dataLines.length) return eventName ? { type: eventName } : null;
  const rawData = dataLines.join("\n");

  try {
    const value = JSON.parse(rawData) as unknown;
    if (eventName && value && typeof value === "object" && !("type" in value))
      return { ...(value as Record<string, unknown>), type: eventName };
    return value;
  } catch {
    return eventName ? { type: eventName, data: rawData } : null;
  }
}

export async function consumeSseResponse(
  response: Response,
  options: {
    signal: AbortSignal;
    onEvent: (event: unknown) => void;
  },
): Promise<void> {
  if (!response.ok) throw new Error("Ask XWC request was not accepted");
  if (!response.body) throw new Error("Ask XWC response stream was unavailable");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const parser = new SseFrameParser();
  const cancel = () => void reader.cancel().catch(() => undefined);
  options.signal.addEventListener("abort", cancel, { once: true });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const event of parser.push(chunk)) options.onEvent(event);
    }

    const finalChunk = decoder.decode();
    for (const event of parser.push(finalChunk)) options.onEvent(event);
    for (const event of parser.finish()) options.onEvent(event);
  } finally {
    options.signal.removeEventListener("abort", cancel);
    reader.releaseLock();
  }
}
