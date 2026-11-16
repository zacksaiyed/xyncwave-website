import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { initAnalytics } from "../lib/analytics";
import { SiteFooter, SiteHeader, StickyMobileCTA } from "../components/site-shell";
import { Button } from "../components/ui/button";
import { RateCardCaptureProvider } from "../components/rate-card-capture";
import { currentHostIndexable } from "../lib/indexing.server";
import { STAGING_ROBOTS } from "../lib/indexing";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold text-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold text-foreground">Looks like this digital path doesn't exist.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page may have moved, or the address may be incomplete.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Button
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </Button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Xyncwave — Enterprise Technology Solutions" },
      { name: "description", content: "Xyncwave turns operational complexity into connected digital systems through software engineering, modernization, AI, cloud, and flexible delivery capacity." },
      { name: "author", content: "Xyncwave Corporation LLP" },
      { property: "og:title", content: "Xyncwave — Enterprise Technology Solutions" },
      { property: "og:description", content: "Business-first technology for connected operations, scalable platforms, and stronger engineering delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      ...(currentHostIndexable() ? [] : [{ name: "robots", content: STAGING_ROBOTS }]),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useEffect(() => { initAnalytics(); }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RateCardCaptureProvider><div>
        <SiteHeader />
        <main id="main-content"><Outlet /></main>
        <SiteFooter />
        <StickyMobileCTA />
      </div></RateCardCaptureProvider>
    </QueryClientProvider>
  );
}
