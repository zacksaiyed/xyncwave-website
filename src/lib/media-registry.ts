// Central image registry for case studies and Insights.
// New content picks up its hero/card/internal image here; unmapped slugs fall back by category.
const full = import.meta.glob("../assets/media/*.webp", { eager: true, import: "default" }) as Record<string, string>;

function img(name: string) {
  const src = full[`../assets/media/${name}.webp`] ?? "";
  const small = full[`../assets/media/${name}-800.webp`];
  return { src, srcSet: `${small} 800w, ${src} 1600w` };
}

export type MediaEntry = { src: string; srcSet: string; alt: string; position: string };
export type MediaCategory = "logistics" | "ai" | "integration" | "cloud" | "data";

const e = (name: string, alt: string, position = "center center"): MediaEntry => ({ ...img(name), alt, position });

export const fallbacks: Record<MediaCategory, MediaEntry> = {
  logistics: e("topic-logistics", "Logistics coordinator overseeing container operations at a modern distribution hub.", "center 40%"),
  ai: e("topic-ai", "Professional reviewing an AI neural-network workflow visualization in a bright office."),
  integration: e("topic-integration", "Abstract modular software systems connecting into a central integration hub."),
  cloud: e("topic-cloud", "Abstract application modules ascending into a stylized cloud platform."),
  data: e("topic-data", "Abstract data pipelines converging into a unified analytics platform."),
};

export const caseStudyMedia: Record<string, MediaEntry> = {
  "digital-brokerage-platform": e("cs-brokerage-r", "Financial trading operations floor at night with panoramic market monitoring displays and glowing blue transaction streams."),
  "track-trace": e("cs-track-trace-r", "Intermodal container terminal at blue hour with gantry cranes and glowing blue scan-tracking lines across the freight yard."),
  "cloud-native-dotnet-modernization": e("cs-dotnet-r", "Legacy server room in warm amber transitioning into a modern cloud data centre in electric blue, linked by glowing service pathways."),
  "cloud-data-migration-recovery": e("cs-cloud-migration-r", "Enterprise data centre vault with towering server racks and glowing blue replication streams running along the aisle."),
  "hospital-operations-platform": e("cs-hospital-r", "Modern hospital corridor and nursing station at twilight with diagnostic suites and soft blue clinical data flows."),
  "healthcare-data-processing-pipelines": e("cs-healthcare-data-r", "High-security clinical laboratory with automated analysers and glowing blue data validation streams."),
  "spreadsheet-project-tracking-digitalization": e("cs-spreadsheet-r", "Project site office at dusk overlooking an illuminated construction site, with glowing blue workflow stages rising from paper drawings."),
  "snowflake-dbt-analytics-platform": e("cs-snowflake-r", "Data engineering workspace at dusk with branching blue data lineage graphs flowing across multiple screens."),
  "snowflake-data-warehouse-modernization": e("cs-warehouse-r", "Enterprise analytics operations centre at twilight with a panoramic wall of layered blue analytical displays."),
  "enterprise-reporting-data-accuracy": e("cs-reporting-r", "Executive boardroom at blue hour with a city view and glowing blue reporting data lines converging on one wall display."),
  "engineering-capacity": e("cs-engineering-pods-r", "Contemporary engineering studio at dusk with glass-partitioned delivery pods connected by glowing blue pipeline tracks."),
};

export const internalMedia: Record<string, MediaEntry> = {
  "track-trace-solution": e("cs-track-trace-scan", "Warehouse specialist scanning cargo container barcode with handheld terminal."),
  "logistics-digital-transformation-africa:operational-journey": e("in-africa-ops", "Warehouse operations team reviewing digital cargo manifest on a mobile tablet."),
};

export const insightMedia: Record<string, MediaEntry> = {
  "fintech-what-to-outsource": e("in-fin-outsource", "Product and engineering leaders sorting responsibilities into internally owned and externally extended groups on a glass wall.", "40% center"),
  "fintech-asynchronous-workflows": e("in-fin-async", "Architectural abstraction of processing stages with event packets, a retry loop and a reconciliation ring."),
  "fintech-data-engineering": e("in-fin-data", "Data engineer in a fintech office as transaction data streams converge into structured reporting layers.", "45% center"),
  "white-label-software-development": e("in-white-label", "Client-facing delivery lead on a call in the foreground with an engineering team working behind a glass partition.", "35% center"),
  "evaluate-software-engineering-partner": e("in-partner-eval", "Senior technical leaders scrutinising architecture diagrams during partner due diligence."),
  "reduce-engineering-backlog": e("in-backlog", "Abstract workstreams crowding at a constrained gate before flowing through a clean delivery path."),
  "ai-integration-readiness": e("in-ai-readiness", "Layered system architecture from data through interfaces and permissions to an intelligence layer with human oversight."),
  "business-case-process-digitalization": e("in-business-case", "Executive leadership reviewing a process map and investment decision in a premium lounge.", "center 40%"),
  "operational-reporting-modernization": e("in-reporting", "Operations leader watching several source-data panels converge into one structured reporting view.", "40% center"),
  "fintech-scale-engineering-after-funding": e("in-fintech-scale", "Fintech product and engineering leads reviewing a financial app and architecture sketch together."),
  "fintech-platform-modernization": e("in-fintech-modernization", "Abstract platform modules reorganizing from a tangled cluster into a clear modular grid."),
  "fintech-api-integration-strategy": e("in-fintech-integration", "Abstract financial-service domains connected through a central controlled platform layer."),
  "workflow-automation-strategy": e("in-workflow-strategy", "Operations team mapping a recurring workflow together in a modern office."),
  "digitalize-excel-workflows": e("in-excel-process", "Operations coordinator reviewing a printed spreadsheet beside a laptop in a workplace."),
  "manufacturing-digitalization-africa": e("in-manufacturing-africa", "Manufacturing leaders discussing production beside machinery on a factory floor."),
  "healthcare-digital-transformation-africa": e("in-healthcare-dt", "Healthcare administrative staff coordinating appointment schedules on a desktop and tablet in a modern hospital office.", "60% 35%"),
  "healthcare-data-pipeline-modernization": e("in-healthcare-pipeline", "Data engineer reviewing data pipeline flow diagrams on dual monitors in a healthcare operations office.", "center 40%"),
  "data-silos-business-visibility": e("in-data-silos", "Architectural abstraction of five separate information systems with connections converging toward one central business view."),
  "logistics-digital-transformation-africa": e("in-africa-hero", "Operations manager reviewing freight fleet dispatch metrics at a modern African port terminal.", "center 30%"),
  "digital-transformation-fragmented-systems": e("in-fragmentation", "Operations leader surrounded by fragmented manual tools transitioning to central digital system.", "center 35%"),
  "system-integration-strategy": e("in-integration-hd", "High-definition isometric view of separate business systems connected through a single controlled integration core."),
  "erp-vs-custom-software": e("in-erp", "Conceptual 3D architectural rendering contrasting monolithic ERP systems with modular custom applications."),
  "ai-workflow-automation": e("in-ai-workflow-hd", "High-definition abstraction of an automated workflow passing through a review checkpoint before continuing."),
  "data-engineering-growing-businesses": e("in-data-engineering", "Multiple operational data streams converging into a unified analytical repository."),
  "modern-data-stack": e("in-data-stack-hd", "High-definition layered view of data ingestion, transformation and analytical serving planes."),
  "data-warehouse-modernization": e("cs-warehouse-hd", "High-definition abstraction of dense legacy data structures resolving into clean layered analytical models."),
  "application-modernization-refactor-replatform-rebuild-replace": e("in-app-modernization", "Software evolution concept showing monolithic application converting into modular cloud API microservices."),
  "cloud-migration-vs-cloud-modernization": e("in-cloud-migration", "Architectural visualization comparing cloud lift-and-shift with cloud-native application refactoring."),
  "legacy-application-business-risk": e("in-legacy-risk", "Senior engineer analyzing complex legacy software system dependencies and potential bottlenecks.", "center 35%"),
  "staff-augmentation-vs-dedicated-team-vs-outsourcing": e("in-team-models", "Distributed software engineering leadership reviewing architecture and delivery velocity.", "center 35%"),
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
