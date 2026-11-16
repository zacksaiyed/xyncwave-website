import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const gccLanding = erpnextDocs.find(d => d.path === "/gcc/erpnext-implementation")!;

export const Route = createFileRoute("/gcc/erpnext-implementation")({
  head: () => erpDocHead(gccLanding),
  component: () => <ERPNextDocument doc={gccLanding} />,
});
