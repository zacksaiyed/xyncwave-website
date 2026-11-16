import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const zatcaArticle = erpnextDocs.find(d => d.path === "/insights/erpnext-zatca-phase-2-integration-readiness")!;

export const Route = createFileRoute("/insights/erpnext-zatca-phase-2-integration-readiness")({
  head: () => erpDocHead(zatcaArticle),
  component: () => <ERPNextDocument doc={zatcaArticle} />,
});
