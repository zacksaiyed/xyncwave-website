// Central image registry for case studies and Insights.
// New content picks up its hero/card/internal image here; unmapped slugs fall back by category.
const full = import.meta.glob("../assets/media/*.webp", { eager: true, import: "default" }) as Record<string, string>;
const concepts = import.meta.glob("../assets/case-devices/*.webp", { eager: true, import: "default" }) as Record<string, string>;

function img(name: string) {
  const src = full[`../assets/media/${name}.webp`] ?? "";
  const small = full[`../assets/media/${name}-800.webp`];
  return { src, srcSet: `${small} 800w, ${src} 1600w` };
}

export type MediaEntry = { src: string; srcSet: string; alt: string; position: string; concept?: boolean; bg?: [string, string] | undefined };
export type MediaCategory = "logistics" | "ai" | "integration" | "cloud" | "data";

const e = (name: string, alt: string, position = "center center"): MediaEntry => ({ ...img(name), alt, position });
const conceptEdges: Record<string, [string, string]> = {"cloud-data-migration-recovery": ["#d4d6da", "#dadce0"], "cloud-native-dotnet-modernization": ["#c7cbd3", "#cdd0db"], "digital-brokerage-platform": ["#dad0c8", "#dfd6cd"], "engineering-capacity": ["#fdf7eb", "#fbf4e8"], "enterprise-reporting-data-accuracy": ["#fdfaf6", "#f8f3ee"], "healthcare-data-processing-pipelines": ["#d5d8dc", "#dadce0"], "hospital-operations-platform": ["#f9f5f0", "#f0ece7"], "snowflake-data-warehouse-modernization": ["#f8f5f2", "#f8f5f1"], "snowflake-dbt-analytics-platform": ["#e9eaee", "#edeef2"], "spreadsheet-project-tracking-digitalization": ["#fefbee", "#fcf6eb"], "track-trace": ["#f5ebdf", "#f1e8e1"]};
const ui = (slug: string, alt: string): MediaEntry => {
  const src = concepts[`../assets/case-devices/${slug}.webp`] ?? "";
  const small = concepts[`../assets/case-devices/${slug}-800.webp`] ?? src;
  return { src, srcSet: `${small} 800w, ${src} 1600w`, alt: `White or silver device presentation. ${alt}`, position: "center center", concept: true, bg: conceptEdges[slug] };
};

export const fallbacks: Record<MediaCategory, MediaEntry> = {
  logistics: e("topic-logistics", "Logistics coordinator overseeing container operations at a modern distribution hub.", "center 40%"),
  ai: e("topic-ai", "Professional reviewing an AI neural-network workflow visualization in a bright office."),
  integration: e("topic-integration", "Abstract modular software systems connecting into a central integration hub."),
  cloud: e("topic-cloud", "Abstract application modules ascending into a stylized cloud platform."),
  data: e("topic-data", "Abstract data pipelines converging into a unified analytics platform."),
};

export const caseStudyMedia: Record<string, MediaEntry> = {
  "digital-brokerage-platform": ui("digital-brokerage-platform", "Illustrative investment operations interface connecting onboarding, verification, funding and order stages with portfolio and reporting entry points."),
  "track-trace": ui("track-trace", "Illustrative field-service interface with technician assignments, job progress, stock allocation, evidence and job-card status."),
  "cloud-native-dotnet-modernization": ui("cloud-native-dotnet-modernization", "Illustrative application-services interface showing API dependencies, asynchronous jobs and a release validation checklist."),
  "cloud-data-migration-recovery": ui("cloud-data-migration-recovery", "Illustrative storage migration interface showing an interrupted transfer, validation checkpoints and recovery controls."),
  "hospital-operations-platform": ui("hospital-operations-platform", "Illustrative hospital operations interface with anonymous appointments, registration, staff coordination, billing and prescription workflow states."),
  "healthcare-data-processing-pipelines": ui("healthcare-data-processing-pipelines", "Illustrative healthcare data-processing interface showing transformation stages, run logs and validation review."),
  "spreadsheet-project-tracking-digitalization": ui("spreadsheet-project-tracking-digitalization", "Illustrative project-records interface connecting Excel and JSON import, reconciliation, billing readiness and export."),
  "snowflake-dbt-analytics-platform": ui("snowflake-dbt-analytics-platform", "Illustrative analytics transformation workspace with Fivetran ingestion, Snowflake layers, dbt lineage and model validation."),
  "snowflake-data-warehouse-modernization": ui("snowflake-data-warehouse-modernization", "Illustrative warehouse change-control interface with schema changes, environment promotion and deployment checks."),
  "enterprise-reporting-data-accuracy": ui("enterprise-reporting-data-accuracy", "Illustrative reporting validation workbench with report parameters, source mapping, status rules and acceptance checks."),
  "engineering-capacity": ui("engineering-capacity", "Illustrative engineering delivery model showing workstreams, task handoffs and internal product ownership; not a resource-management product."),
};

export const internalMedia: Record<string, MediaEntry> = {
  "track-trace-solution": e("cs-track-trace-scan", "Warehouse specialist scanning cargo container barcode with handheld terminal."),
  "logistics-digital-transformation-africa:operational-journey": e("in-africa-ops", "Warehouse operations team reviewing digital cargo manifest on a mobile tablet."),
};

export const insightMedia: Record<string, MediaEntry> = {
  "fintech-partner-integration-launch-readiness": e("in-fin-launch-r", "Fintech team at night reviewing partner bank and payment integrations mapped into one platform core on a glass wall."),
  "it-consulting-delivery-margin-capacity-scope-handoffs": e("in-consulting-margin-r", "Consulting lead handing a work package from the client-facing team to a delivery engineering pod at dusk."),
  "multi-site-manufacturing-erp-rollout-readiness-africa": e("in-erp-africa-r", "Aerial dusk view of several African manufacturing sites linked by blue data lines to one central ERP system."),
  "fintech-what-to-outsource": e("in-fin-outsource-r", "Executive meeting room above a financial district at dusk with glowing blue capability cards mapped on a glass wall."),
  "fintech-asynchronous-workflows": e("in-fin-async-r", "Dark transaction processing hall with glowing blue event streams and a retry loop running along the server aisles."),
  "fintech-data-engineering": e("in-fin-data-r", "Financial analytics operations desk at blue hour with transaction data streams flowing into layered reporting views."),
  "white-label-software-development": e("in-white-label-r", "Client consulting suite at twilight with an engineering delivery team working behind a glass partition."),
  "evaluate-software-engineering-partner": e("in-partner-eval-r", "Senior technical leaders reviewing architecture drawings in a dark boardroom at dusk."),
  "reduce-engineering-backlog": e("in-backlog-r", "Engineering team room at blue hour with crowded work items narrowing into one clean delivery stream on the wall board."),
  "ai-integration-readiness": e("in-ai-readiness-r", "Enterprise architecture room with stacked glass layers from data through interfaces to an intelligence layer, overseen by one person."),
  "business-case-process-digitalization": e("in-business-case-r", "Executive lounge at dusk where three leaders review a printed process map with a digital process flow above it."),
  "operational-reporting-modernization": e("in-reporting-r", "Executive boardroom at blue hour with several reporting sources converging into one structured wall display."),
  "fintech-scale-engineering-after-funding": e("in-fintech-scale-r", "Engineering floor at twilight with glass-partitioned delivery pods connected by glowing blue delivery tracks."),
  "fintech-platform-modernization": e("in-fintech-modernization-r", "Legacy server hall in warm amber transitioning into a modern modular cloud hall lit in electric blue."),
  "fintech-api-integration-strategy": e("in-fintech-integration-r", "Secure network hub at night with payment, identity and market-data channels converging into one platform core."),
  "workflow-automation-strategy": e("in-workflow-strategy-r", "Automated distribution centre at dusk with parcels passing through glowing blue decision checkpoints on the conveyor."),
  "digitalize-excel-workflows": e("in-excel-process-r", "Operations dispatch desk at twilight where printed spreadsheets give way to a structured digital workflow."),
  "manufacturing-digitalization-africa": e("in-manufacturing-africa-r", "Industrial assembly plant at dusk with robotic welding arms linked by a blue sensor telemetry mesh."),
  "healthcare-digital-transformation-africa": e("in-healthcare-dt-r", "Modern medical centre reception and corridor at twilight with connected patient-flow pathways."),
  "healthcare-data-pipeline-modernization": e("in-healthcare-pipeline-r", "Clinical laboratory corridor with automated analysers and glowing blue data validation checkpoints."),
  "data-silos-business-visibility": e("in-data-silos-r", "Aerial dusk view of separate warehouse, office and branch sites with data pipelines converging into one central point."),
  "logistics-digital-transformation-africa": e("in-africa-hero-r", "Container port and freight terminal at blue hour with blue tracking markers over containers and trucks."),
  "digital-transformation-fragmented-systems": e("in-fragmentation-r", "Operations hub at twilight where scattered disconnected screens converge into one coordinated display."),
  "system-integration-strategy": e("in-integration-r", "Operations command centre at blue hour with separate workstation clusters linked by one central integration spine."),
  "erp-vs-custom-software": e("in-erp-r", "Manufacturing operations office at dusk contrasting standard transaction terminals with a custom mobile console."),
  "ai-workflow-automation": e("in-ai-workflow-r", "Automated fulfilment station at dusk with a robotic arm and a glowing blue verification gate over the conveyor."),
  "data-engineering-growing-businesses": e("in-data-engineering-r", "Data engineering workspace at dusk with several source streams merging into one unified repository."),
  "modern-data-stack": e("in-data-stack-r", "Multi-tier analytics facility at twilight with ingestion, transformation and serving layers linked by blue data paths."),
  "data-warehouse-modernization": e("in-warehouse-mod-r", "Analytics control centre at blue hour with branching pipeline graphs and layered data models on a curved display wall."),
  "application-modernization-refactor-replatform-rebuild-replace": e("in-app-modernization-r", "Legacy mainframe cabinet breaking apart into glowing blue modular services in a dark engineering hall."),
  "cloud-migration-vs-cloud-modernization": e("in-cloud-migration-r", "Server racks being relocated beside a modern cloud hall, joined by glowing blue replication pipelines."),
  "legacy-application-business-risk": e("in-legacy-risk-r", "Ageing industrial control room at night overlaid with faint blue dependency mapping lines."),
  "staff-augmentation-vs-dedicated-team-vs-outsourcing": e("in-team-models-r", "Distributed engineering studio at night with world clocks and blue collaboration streams linking three work zones."),
};

export function categoryFor(text = ""): MediaCategory {
  const t = text.toLowerCase();
  if (/logistic|supply|freight|field/.test(t)) return "logistics";
  if (/\bai\b|automation|intelligen/.test(t)) return "ai";
  if (/data|analytic|report|warehouse/.test(t)) return "data";
  if (/cloud|modern|legacy|application|platform/.test(t)) return "cloud";
  return "integration";
}

export const getInsightMedia = (slug: string, category?: string) => insightMedia[slug] ?? fallbacks[categoryFor(category ?? slug)];
export const getCaseStudyMedia = (slug: string, category?: string) => caseStudyMedia[slug] ?? fallbacks[categoryFor(category ?? slug)];

export const researchMedia: Record<string, MediaEntry> = {
  "southern-africa-logistics-2027": e("wp-logistics-r", "Southern African freight corridor at blue hour with trucks, rail containers and a port linked by blue telemetry lines."),
  "us-fintech-readiness-2027": e("wp-fintech-r", "Fintech engineering team at night reviewing delivery-readiness dashboards above a US financial district."),
};

/** Banners for ERPNext cluster articles, keyed by article path. */
export const erpnextArticleMedia: Record<string, MediaEntry> = {
  "/insights/erpnext-zatca-phase-2-integration-readiness": e("in-erp-zatca", "Finance professional in a Riyadh office at dusk watching digital invoices pass through a secure validation gateway."),
  "/insights/tally-to-erpnext-migration-uae": e("in-erp-tally", "Ledger books on a Dubai trading office desk with data streams migrating into a modern ERP dashboard."),
  "/insights/erpnext-frappe-upgrade-safe-customization": e("in-erp-custom", "Isometric drawing of a stable core platform with separate extension modules moving cleanly to a new version."),
  "/insights/erpnext-implementation-cost-tco-guide": e("in-erp-cost", "Finance lead and project lead reviewing a phased ERP budget and timeline plan."),
  "/de/insights/erpnext-e-rechnung-xrechnung-zugferd": e("in-erp-erechnung", "Blueprint drawing of structured XML and PDF invoice layers flowing from an ERP server to a German public building."),
  "/de/insights/erpnext-datev-schnittstelle-datenexport": e("in-erp-datev", "Accountant in a Munich office reviewing ledger exports linked between two screens."),
};
