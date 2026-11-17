import { createFileRoute } from "@tanstack/react-router";
import { getPaperByAssetId, paperStoragePath } from "../lib/research";

const text = (body: string, status: number) =>
  new Response(body, { status, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });

const pdf = (body: BodyInit, filename: string) =>
  new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });

export const Route = createFileRoute("/research-download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") ?? "";

        // Signed, expiring links (white papers and the rate card). No database involved.
        if (token.includes(".")) {
          const { verifyDownloadToken, downloadFilename, downloadAssetUrl } = await import("../lib/download-token.server");
          const verified = await verifyDownloadToken(token);
          if (!verified.ok) {
            return verified.reason === "expired"
              ? text("This download link has expired. Please request the document again from the Xyncwave website.", 410)
              : text("Invalid or expired download link.", 400);
          }
          const filename = downloadFilename(verified.kind, verified.id);
          if (!filename) return text("Unknown document.", 404);
          const file = await fetch(downloadAssetUrl(url.origin, filename));
          if (!file.ok || !(file.headers.get("content-type") ?? "").includes("pdf") || !file.body) {
            console.error("download PDF missing at /downloads/", filename);
            return text("The document is temporarily unavailable. Please try again later.", 503);
          }
          return pdf(file.body, filename);
        }

        // Legacy database-backed links (only valid where the Supabase service-role key is configured).
        if (!/^[a-f0-9]{48}$/.test(token)) {
          return text("Invalid or expired download link.", 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row } = await supabaseAdmin
          .from("whitepaper_requests")
          .select("id, asset_id, token_expires_at, status")
          .eq("download_token", token)
          .maybeSingle();

        if (!row || !["provider_accepted", "direct_download"].includes(row.status)) {
          return text("Invalid or expired download link.", 404);
        }
        if (new Date(row.token_expires_at).getTime() < Date.now()) {
          return text("This download link has expired. Please request the report again.", 410);
        }

        const paper = getPaperByAssetId(row.asset_id);
        if (!paper) return text("Unknown report.", 404);

        const { data: file, error } = await supabaseAdmin.storage
          .from("research-papers")
          .download(paperStoragePath(paper));
        if (error || !file) {
          console.error("research-papers download failed", error?.message);
          return text("The report is temporarily unavailable. Please try again later.", 503);
        }

        return pdf(await file.arrayBuffer(), paper.pdfFilename);
      },
    },
  },
});
