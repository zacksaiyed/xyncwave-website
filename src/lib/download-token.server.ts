// Stateless, signed, expiring download links for gated PDFs. Server-only.
// No database needed: the link itself carries what it unlocks and when it expires, signed with HMAC-SHA256.
// Secret: DOWNLOAD_SIGNING_SECRET (optional), otherwise derived from RESEND_API_KEY.
import { getPaperByAssetId } from "./research";
import { RATE_CARD_FILENAME } from "./rate-card";

export type DownloadKind = "paper" | "ratecard";
export const DOWNLOAD_TTL_MS = 72 * 60 * 60 * 1000;
/** Folder under public/ that holds the gated PDFs (served via the signed route). */
export const DOWNLOADS_DIR = "/downloads";

const enc = new TextEncoder();
const toB64Url = (bytes: Uint8Array) => {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64Url = (value: string) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const raw = atob(padded);
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
};

async function hmacKey() {
  const secret = process.env["DOWNLOAD_SIGNING_SECRET"] || process.env["RESEND_API_KEY"];
  if (!secret) return null;
  return crypto.subtle.importKey("raw", enc.encode(`xwc-download:${secret}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function signDownloadToken(kind: DownloadKind, id: string, ttlMs = DOWNLOAD_TTL_MS): Promise<string | null> {
  const key = await hmacKey();
  if (!key) return null;
  const payload = toB64Url(enc.encode(`${kind}.${id}.${Date.now() + ttlMs}`));
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(payload)));
  return `${payload}.${toB64Url(sig)}`;
}

export type VerifiedDownload = { ok: true; kind: DownloadKind; id: string } | { ok: false; reason: "invalid" | "expired" };

export async function verifyDownloadToken(token: string): Promise<VerifiedDownload> {
  try {
    const [payload, sig] = token.split(".");
    const key = await hmacKey();
    if (!payload || !sig || !key) return { ok: false, reason: "invalid" };
    const valid = await crypto.subtle.verify("HMAC", key, fromB64Url(sig), enc.encode(payload));
    if (!valid) return { ok: false, reason: "invalid" };
    const [kind, id, exp] = new TextDecoder().decode(fromB64Url(payload)).split(".");
    if ((kind !== "paper" && kind !== "ratecard") || !id) return { ok: false, reason: "invalid" };
    if (Number(exp) < Date.now()) return { ok: false, reason: "expired" };
    return { ok: true, kind, id };
  } catch {
    return { ok: false, reason: "invalid" };
  }
}

/** The PDF filename a token kind/id unlocks, or null when unknown. */
export function downloadFilename(kind: DownloadKind, id: string): string | null {
  if (kind === "paper") return getPaperByAssetId(id)?.pdfFilename ?? null;
  return id === "rate-card" ? RATE_CARD_FILENAME : null;
}

export const downloadAssetUrl = (origin: string, filename: string) => `${origin}${DOWNLOADS_DIR}/${encodeURIComponent(filename)}`;

type AssetsBinding = { fetch: (request: Request) => Promise<Response> };

/**
 * Reads a deployed PDF. On Cloudflare the static-assets binding (env.ASSETS, exposed by nitro on globalThis.__env__)
 * is used, because a Worker fetching its own public hostname over HTTP is not reliable. Elsewhere (local dev) it
 * falls back to a normal fetch.
 */
export async function fetchDownloadAsset(origin: string, filename: string, method: "GET" | "HEAD" = "GET"): Promise<Response> {
  const url = downloadAssetUrl(origin, filename);
  const assets = (globalThis as { __env__?: { ASSETS?: AssetsBinding } }).__env__?.ASSETS;
  return assets ? assets.fetch(new Request(url, { method })) : fetch(url, { method });
}

/** True when the PDF has actually been deployed. Lets flows fail honestly until the file exists. */
export async function pdfIsAvailable(origin: string, filename: string): Promise<boolean> {
  try {
    const res = await fetchDownloadAsset(origin, filename, "HEAD");
    const ok = res.ok && (res.headers.get("content-type") ?? "").includes("pdf");
    if (!ok) console.error("pdf availability check negative:", res.status, res.headers.get("content-type"));
    return ok;
  } catch (error) {
    console.error("pdf availability check failed", error instanceof Error ? error.message : error);
    return false;
  }
}
