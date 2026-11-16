import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { isProductionHost, STAGING_ROBOTS } from "./lib/indexing";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// Non-production hosts (Lovable staging/previews) get X-Robots-Tag on every response.
const stagingNoindexMiddleware = createMiddleware().server(async ({ next, request }) => {
  const result = await next();
  if (!isProductionHost(new URL(request.url).hostname)) {
    try { result.response.headers.set("X-Robots-Tag", STAGING_ROBOTS); } catch { /* immutable response: meta tag still applies */ }
  }
  return result;
});

// Start installs this automatically when src/start.ts is absent; defining the
// file opts out, so re-add it explicitly to keep server functions protected
// from cross-site requests.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === "serverFn",
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [stagingNoindexMiddleware, errorMiddleware, csrfMiddleware],
}));
