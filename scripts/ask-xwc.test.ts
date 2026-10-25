import assert from "node:assert/strict";
import test from "node:test";
import { normalizeHandoff, normalizeSources, textDeltaFromEvent } from "../src/lib/ask-xwc/client";
import { SseFrameParser, parseSseFrame } from "../src/lib/ask-xwc/sse";
import { askXwcReducer, getPageContext, initialAskXwcState } from "../src/lib/ask-xwc/state";
import {
  accessibleIndexablePathsNotInSitemap,
  getSitemapEntries,
  noindexExactPaths,
} from "../src/lib/public-routes";

test("SSE frames survive arbitrary chunk boundaries and multiline data", () => {
  const parser = new SseFrameParser();
  assert.deepEqual(parser.push('data: {"type":"TEXT_MESSAGE_CON'), []);
  assert.deepEqual(parser.push('TENT","delta":"XWC"}\n\n'), [
    { type: "TEXT_MESSAGE_CONTENT", delta: "XWC" },
  ]);
  assert.deepEqual(
    parseSseFrame('event: CUSTOM\ndata: {"name":"xwc.sources",\ndata: "value":[]}'),
    { type: "CUSTOM", name: "xwc.sources", value: [] },
  );
});

test("malformed untyped SSE data is ignored without stopping later frames", () => {
  const parser = new SseFrameParser();
  assert.deepEqual(parser.push('data: not-json\n\ndata: {"type":"RUN_FINISHED"}\n\n'), [
    { type: "RUN_FINISHED" },
  ]);
});

test("streamed text deltas retain meaningful leading whitespace", () => {
  assert.equal(textDeltaFromEvent({ delta: " connected" }), " connected");
  assert.equal(textDeltaFromEvent({ content: "systems" }), "systems");
});

test("source normalization keeps only safe internal routes and removes retrieval detail", () => {
  assert.deepEqual(
    normalizeSources({
      sources: [
        { title: "Integration", url: "https://xyncwave.com/solutions/integration?score=0.91" },
        { title: "External", url: "https://example.com/source", score: 0.99 },
        { title: "Unsafe", url: "//example.com/redirect" },
      ],
    }),
    [
      {
        id: "Integration|/solutions/integration",
        title: "Integration",
        route: "/solutions/integration",
      },
      { id: "External|", title: "External" },
      { id: "Unsafe|", title: "Unsafe" },
    ],
  );
});

test("handoff events remain optional and default to the existing contact journey", () => {
  assert.equal(normalizeHandoff(false), null);
  assert.deepEqual(
    normalizeHandoff({ reason: "The operating boundary needs closer examination." }),
    {
      title: "This needs a closer look",
      body: "The operating boundary needs closer examination.",
      route: "/start-a-conversation",
      actionLabel: "Continue with XWC",
    },
  );
});

test("route context is business-first and the reducer maintains one exploration trail", () => {
  assert.deepEqual(getPageContext("/industries/logistics/"), {
    label: "Logistics & Supply Chain",
    suggestions: ["Explore a logistics operations problem"],
  });
  const first = askXwcReducer(initialAskXwcState, {
    type: "start",
    intent: "Our operations are fragmented",
    runId: "run-1",
  });
  const second = askXwcReducer(first, {
    type: "start",
    intent: "The ERP boundary is unclear",
    runId: "run-2",
  });
  assert.equal(second.trail.length, 1);
  assert.equal(second.trail[0]?.label, "Our operations are fragmented");
  assert.equal(second.currentIntent, "The ERP boundary is unclear");
});

test("every published and utility page resolves specific internal context", () => {
  const paths = [
    ...getSitemapEntries().map((entry) => entry.path),
    ...accessibleIndexablePathsNotInSitemap,
    ...noindexExactPaths,
    "/thank-you/contact",
  ];

  for (const path of paths) {
    const context = getPageContext(path);
    assert.notEqual(context.label, "XWC", `${path} fell back to generic XWC context`);
    assert.ok(context.label.trim(), `${path} has no page label`);
    assert.ok(context.suggestions.length, `${path} has no contextual starting point`);
  }

  assert.deepEqual(getPageContext("/about"), {
    label: "About XWC",
    suggestions: ["Explore how XWC works with organizations"],
  });
});
