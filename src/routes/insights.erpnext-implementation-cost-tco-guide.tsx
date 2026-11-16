import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const costArticle = erpnextDocs.find(d => d.path === "/insights/erpnext-implementation-cost-tco-guide")!;

export const Route = createFileRoute("/insights/erpnext-implementation-cost-tco-guide")({
  head: () => erpDocHead(costArticle),
  component: () => <ERPNextDocument doc={costArticle} />,
});
