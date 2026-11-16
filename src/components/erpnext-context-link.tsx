import { ArrowRight } from "lucide-react";
import { SmartLink } from "./app-link";

export function ERPNextContextLink({ context }: { context: string }) {
  const labels: Record<string, string> = {
    "erp-business-systems": "ERPNext implementation and Frappe engineering",
    integration: "ERPNext APIs and operational system integration",
    "software-engineering": "Frappe extensions and ERPNext custom development",
    "engineering-capacity": "Engineering support for ERPNext and Frappe workstreams",
    manufacturing: "ERPNext fit for production, materials and multi-site workflows",
    logistics: "ERPNext integration for warehouse, stock and finance records",
    "track-trace": "Explore ERPNext implementation and connected operational workflows",
  };
  const label = labels[context];
  if (!label) return null;
  return <section className="border-y border-border"><div className="mx-auto max-w-7xl px-5 py-8 lg:px-8"><p className="text-xs font-medium text-muted-foreground">ERP & operational system fit</p><SmartLink to="/solutions/erpnext-implementation" className="mt-3 inline-flex items-center gap-3 text-base font-medium text-primary">{label}<ArrowRight className="size-4 shrink-0" /></SmartLink></div></section>;
}