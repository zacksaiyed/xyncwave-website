/** Only these exact hosts may be indexed. Every other host (Lovable previews, staging, localhost) is noindex. */
export const PRODUCTION_HOSTS = ["xyncwave.com", "www.xyncwave.com"];
export const STAGING_ROBOTS = "noindex, nofollow";
export function isProductionHost(hostname: string) {
  return PRODUCTION_HOSTS.includes(hostname.trim().toLowerCase().replace(/\.$/, ""));
}
