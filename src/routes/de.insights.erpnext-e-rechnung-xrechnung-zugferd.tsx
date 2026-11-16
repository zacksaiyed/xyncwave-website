import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const deERechnung = erpnextDocs.find(d => d.path === "/de/insights/erpnext-e-rechnung-xrechnung-zugferd")!;

export const Route = createFileRoute("/de/insights/erpnext-e-rechnung-xrechnung-zugferd")({
  head: () => erpDocHead(deERechnung),
  component: () => <ERPNextDocument doc={deERechnung} />,
});
