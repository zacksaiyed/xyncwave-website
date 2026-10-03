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
import refinementCss from "../refinements.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteFooter, SiteHeader, StickyMobileCTA } from "../components/site-shell";
import { Button } from "../components/ui/button";
import { AppearanceProvider } from "../components/appearance";
import type { AppearancePreference } from "../components/appearance";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import {
  absoluteUrl,
  APPROVED_LOGO_PATH,
  isProductionHostname,
  SITE_NAME,
  SITE_ORIGIN,
} from "../lib/site-config";

const appearanceValues: AppearancePreference[] = ["light", "dark", "auto"];
const getInitialAppearance = createServerFn({ method: "GET" }).handler(() => {
  const request = getRequest();
  const cookie = request.headers.get("cookie") ?? "";
  const raw = cookie
    .split(";")
    .map((part) => part.trim().split("="))
    .find(([key]) => key === "xwc-appearance")?.[1];
  const preference = appearanceValues.includes(raw as AppearancePreference)
    ? (raw as AppearancePreference)
    : "auto";
  return {
    preference,
    hasSavedCookie: appearanceValues.includes(raw as AppearancePreference),
    isProductionHost: isProductionHostname(new URL(request.url).hostname),
  };
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-bold text-primary">404</p>
        <h1 className="mt-4 text-4xl font-bold text-foreground">
          Looks like this digital path doesn't exist.
        </h1>
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

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
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
  loader: () => getInitialAppearance(),
  head: ({ loaderData }) => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "XWC — Enterprise Technology Solutions" },
      {
        name: "description",
        content:
          "XWC turns operational complexity into connected digital systems through software engineering, modernization, AI, cloud, and flexible delivery capacity.",
      },
      { name: "author", content: "Xyncwave Corporation LLP" },
      ...(!loaderData?.isProductionHost ? [{ name: "robots", content: "noindex,follow" }] : []),
      { property: "og:title", content: "XWC — Enterprise Technology Solutions" },
      {
        property: "og:description",
        content:
          "Business-first technology for connected operations, scalable platforms, and stronger engineering delivery.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/` },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:image", content: absoluteUrl(APPROVED_LOGO_PATH) },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "XWC — Enterprise Technology Solutions" },
      {
        name: "twitter:description",
        content:
          "Business-first technology for connected operations, scalable platforms, and stronger engineering delivery.",
      },
      { name: "twitter:image", content: absoluteUrl(APPROVED_LOGO_PATH) },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "stylesheet", href: refinementCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "256x256" },
      {
        rel: "apple-touch-icon",
        href: "/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/App_Icons/apple-touch-icon-180x180.png",
        sizes: "180x180",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const loaderData = Route.useLoaderData();
  const preference = loaderData?.preference ?? "auto";
  return (
    <html
      lang="en"
      className={preference === "dark" ? "dark" : undefined}
      data-appearance={preference}
      data-theme={preference === "auto" ? undefined : preference}
      style={preference === "auto" ? undefined : { colorScheme: preference }}
    >
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
  const loaderData = Route.useLoaderData();
  const preference = loaderData?.preference ?? "auto";
  const hasSavedCookie = loaderData?.hasSavedCookie ?? false;

  return (
    <QueryClientProvider client={queryClient}>
      <AppearanceProvider initialPreference={preference} hasSavedCookie={hasSavedCookie}>
        <div>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            <Outlet />
          </main>
          <SiteFooter />
          <StickyMobileCTA />
        </div>
      </AppearanceProvider>
    </QueryClientProvider>
  );
}
