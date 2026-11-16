import { createFileRoute } from "@tanstack/react-router";
import { ERPNextDocument } from "../components/erpnext-document";
import { erpDocHead } from "../lib/erpnext-docs/head";
import { erpnextDocs } from "../lib/erpnext-docs";
const deLanding = erpnextDocs.find(d => d.path === "/de/erpnext-implementierung")!;

export const Route = createFileRoute("/de/erpnext-implementierung")({
  head: () => erpDocHead(deLanding),
  component: () => <ERPNextDocument doc={deLanding} />,
});
