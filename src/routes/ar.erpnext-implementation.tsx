import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const arLanding = erpnextDocs.find(d => d.path === "/ar/erpnext-implementation")!;

export const Route = createFileRoute("/ar/erpnext-implementation")({
  head: () => erpDocHead(arLanding),
  component: () => <ERPNextDocument doc={arLanding} />,
});
