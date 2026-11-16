import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const customizationArticle = erpnextDocs.find(d => d.path === "/insights/erpnext-frappe-upgrade-safe-customization")!;

export const Route = createFileRoute("/insights/erpnext-frappe-upgrade-safe-customization")({
  head: () => erpDocHead(customizationArticle),
  component: () => <ERPNextDocument doc={customizationArticle} />,
});
