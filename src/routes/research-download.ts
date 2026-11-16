import { createFileRoute } from "@tanstack/react-router";
import { getPaperByAssetId, paperStoragePath } from "../lib/research";

export const Route = createFileRoute("/research-download")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const token = url.searchParams.get("token") ?? "";
        if (!/^[a-f0-9]{48}$/.test(token)) {
          return new Response("Invalid or expired download link.", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: row } = await supabaseAdmin
          .from("whitepaper_requests")
          .select("id, asset_id, token_expires_at, status")
          .eq("download_token", token)
          .maybeSingle();

        if (!row || !["provider_accepted", "direct_download"].includes(row.status)) {
          return new Response("Invalid or expired download link.", { status: 404 });
        }
        if (new Date(row.token_expires_at).getTime() < Date.now()) {
          return new Response("This download link has expired. Please request the report again.", { status: 410 });
        }

        const paper = getPaperByAssetId(row.asset_id);
        if (!paper) return new Response("Unknown report.", { status: 404 });

        const { data: file, error } = await supabaseAdmin.storage
          .from("research-papers")
          .download(paperStoragePath(paper));
        if (error || !file) {
          console.error("research-papers download failed", error?.message);
          return new Response("The report is temporarily unavailable. Please try again later.", { status: 503 });
        }

        const buffer = await file.arrayBuffer();
        return new Response(buffer, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${paper.pdfFilename}"`,
            "Cache-Control": "private, no-store",
          },
        });
      },
    },
  },
});
