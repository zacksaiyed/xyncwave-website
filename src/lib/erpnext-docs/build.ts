import type { PillarBlock, PillarSection } from "../erpnext-pillar";

export const p = (text: string): PillarBlock => ({ kind: "paragraph", text });
export const h = (text: string): PillarBlock => ({ kind: "heading", text });
export const c = (text: string): PillarBlock => ({ kind: "cta", text });
export const l = (...items: string[]): PillarBlock => ({ kind: "list", items });
export const tb = (...rows: string[][]): PillarBlock => ({ kind: "table", rows });
export const s = (id: string, title: string, ...blocks: PillarBlock[]): PillarSection => ({ id, title, blocks });
/** Internal link token understood by the shared inline renderer. */
export const a = (label: string, path: string) => `[${label}](https://xyncwave.com${path})`;

export const SRC = {
  frappeLicense: ["Frappe — ERPNext open-source licensing (GPLv3)", "https://docs.frappe.io/erpnext/open-source"],
  frappeDocs: ["Frappe — ERPNext documentation", "https://docs.frappe.io/erpnext"],
  frappeFramework: ["Frappe Framework documentation", "https://docs.frappe.io/framework"],
  bmf: ["Bundesministerium der Finanzen — FAQ E-Rechnung (Stand 23.03.2026)", "https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.htm"],
  zatcaFaq: ["ZATCA — E-Invoicing FAQs", "https://www.zatca.gov.sa/en/E-Invoicing/Introduction/FAQ/Pages/default.aspx"],
  zatcaWave: ["ZATCA — Wave 25 e-invoicing integration announcement (24 July 2026)", "https://www.zatca.gov.sa/en/MediaCenter/News/Pages/Wave25-E-invoicing.aspx"],
  mofScope: ["UAE Ministry of Finance — e-invoicing scope and timelines decisions", "https://mof.gov.ae/en/news/ministry-of-finance-announces-the-issuance-of-two-ministerial-decisions-on-the-scope-of-obligations-and-the-timelines-for-implementing-the-electronic-invoicing-system-2/"],
  mofAsp: ["UAE Ministry of Finance — accreditation of e-invoicing service providers", "https://mof.gov.ae/en/news/ministry-of-finance-issues-decision-on-accreditation-of-einvoicing-service-providers-under-updated-regulatory-framework/"],
  gdpr: ["EUR-Lex — Datenschutz-Grundverordnung (EU) 2016/679", "https://eur-lex.europa.eu/eli/reg/2016/679/oj"],
} satisfies Record<string, [string, string]>;
