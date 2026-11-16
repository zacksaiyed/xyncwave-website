import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const deDatev = erpnextDocs.find(d => d.path === "/de/insights/erpnext-datev-schnittstelle-datenexport")!;

export const Route = createFileRoute("/de/insights/erpnext-datev-schnittstelle-datenexport")({
  head: () => erpDocHead(deDatev),
  component: () => <ERPNextDocument doc={deDatev} />,
});
