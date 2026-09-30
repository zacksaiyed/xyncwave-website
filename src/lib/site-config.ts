export const SITE_ORIGIN = "https://xyncwave.com";
export const SITE_HOSTNAME = "xyncwave.com";
export const SITE_NAME = "XWC";
export const SITE_ALTERNATE_NAME = "Xyncwave";

export const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;

export const APPROVED_LOGO_PATH =
  "/Xyncwave_Brand_Kit_Exact_Approved_v4.0/02_WEB_APP/Logos/logo-header-light-background.png";

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl || "/", `${SITE_ORIGIN}/`).href;
}

export function canonicalUrl(pathOrUrl: string): string {
  const url = new URL(pathOrUrl || "/", `${SITE_ORIGIN}/`);
  url.protocol = "https:";
  url.host = SITE_HOSTNAME;
  url.search = "";
  url.hash = "";
  url.pathname = normalizePath(url.pathname);
  return url.href;
}

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return `/${pathname.replace(/^\/+|\/+$/g, "")}`;
}

export function isProductionHostname(hostname: string): boolean {
  return hostname.toLowerCase().replace(/\.$/, "") === SITE_HOSTNAME;
}
