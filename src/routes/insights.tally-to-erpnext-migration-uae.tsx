import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const tallyArticle = erpnextDocs.find(d => d.path === "/insights/tally-to-erpnext-migration-uae")!;

export const Route = createFileRoute("/insights/tally-to-erpnext-migration-uae")({
  head: () => erpDocHead(tallyArticle),
  component: () => <ERPNextDocument doc={tallyArticle} />,
});
