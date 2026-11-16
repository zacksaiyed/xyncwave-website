import type { ExploreItem } from "../components/continue-exploring";

/**
 * Single source of truth for buyer-journey routing (related cards + contextual CTA labels)
 * across Solutions, Industries, Case Studies and Insights.
 */
const c = (type: ExploreItem["type"], title: string, body: string, to: string): ExploreItem => ({ type, title, body, to });

const S = {
  sw: c("Solution", "Explore Software Engineering", "Build and extend business-critical applications around real requirements.", "/solutions/software-engineering"),
  dt: c("Solution", "Explore Digital Transformation", "Turn fragmented, manual workflows into structured operational flows.", "/solutions/digital-transformation"),
  mod: c("Solution", "Review the modernization approach", "Remove the constraint around valuable software through staged change.", "/solutions/application-modernization"),
  cloud: c("Solution", "Explore Cloud & Platform Engineering", "Make software easier to release, operate and recover.", "/solutions/cloud-platform-engineering"),
  data: c("Solution", "Explore Data Engineering & Analytics", "Build dependable pipelines and trusted management information.", "/solutions/data-engineering"),
  ai: c("Solution", "Explore AI & Intelligent Automation", "Test AI against one defined workflow with human oversight.", "/solutions/ai-automation"),
  int: c("Solution", "Explore API & System Integration", "Connect systems with clear ownership, validation and failure handling.", "/solutions/integration"),
  erp: c("Solution", "Evaluate the ERP boundary", "Decide what ERP should own and where specialised software fits.", "/solutions/erp-business-systems"),
  cap: c("Solution", "Review the Engineering Capacity model", "Add specialists, pods or project teams around real delivery demand.", "/solutions/engineering-capacity"),
};
const I = {
  log: c("Industry", "Logistics & Supply Chain", "Movement, dispatch, field work and reconciliation across connected systems.", "/industries/logistics"),
  mfg: c("Industry", "Manufacturing", "Production, inventory, quality and reporting as operations grow.", "/industries/manufacturing"),
  hc: c("Industry", "Healthcare", "Administrative, departmental and data workflows without clinical overstatement.", "/industries/healthcare"),
  fin: c("Industry", "Fintech", "Product roadmaps, integrations and controlled engineering delivery.", "/industries/fintech"),
  tech: c("Industry", "Technology & IT Services", "Client delivery, specialist capability and engineering capacity.", "/industries/technology-it-services"),
};
const C = {
  tt: c("Case study", "See the Connected Logistics case study", "Support, technician work, stock and job evidence in one operational platform.", "/case-studies/track-trace"),
  ec: c("Case study", "See the Engineering Capacity case study", "A flexible model for adding engineers and technical leadership around demand.", "/case-studies/engineering-capacity"),
  hosp: c("Case study", "See the Hospital Operations Platform", "Intake, appointments, staff views and billing processes in one connected application.", "/case-studies/hospital-operations-platform"),
  hcdata: c("Case study", "See the Healthcare Data Pipelines case study", "Multi-stage transformation and validation of healthcare operational data.", "/case-studies/healthcare-data-processing-pipelines"),
  sheet: c("Case study", "See how the workflow was digitalized", "Spreadsheet-based project tracking moved into a structured application.", "/case-studies/spreadsheet-project-tracking-digitalization"),
  dotnet: c("Case study", "See the Cloud-Native .NET Modernization", "A legacy application re-architected for cloud-native operation.", "/case-studies/cloud-native-dotnet-modernization"),
  dbt: c("Case study", "See the Snowflake + dbt Analytics Platform", "Modelled, tested transformations on a modern analytics stack.", "/case-studies/snowflake-dbt-analytics-platform"),
  wh: c("Case study", "See the Warehouse Modernization case study", "Evolving a data warehouse without a risky rewrite.", "/case-studies/snowflake-data-warehouse-modernization"),
  mig: c("Case study", "See the Cloud Data Migration & Recovery case study", "Controlled data transfer with recovery and validation built in.", "/case-studies/cloud-data-migration-recovery"),
  rep: c("Case study", "See the Enterprise Reporting case study", "Reporting logic, filters and validation made traceable.", "/case-studies/enterprise-reporting-data-accuracy"),
  brok: c("Case study", "See the Digital Stock Brokering Platform", "Onboarding, payments, trading and reporting connected through one platform.", "/case-studies/digital-brokerage-platform"),
};
const n = (title: string, body: string, slug: string) => c("Insight", title, body, `/insights/${slug}`);
const N = {
  frag: n("Read: Digital transformation starts with fragmentation", "Find the work hidden between spreadsheets, messages and systems.", "digital-transformation-fragmented-systems"),
  aiwf: n("Read: Find an AI use case worth testing", "Start with recurring work, available information and a useful outcome.", "ai-workflow-automation"),
  capm: n("Read: Choosing the right capacity model", "Compare a specialist, pod and project team by ownership and uncertainty.", "staff-augmentation-vs-dedicated-team-vs-outsourcing"),
  logaf: n("Read: Logistics digital transformation in Africa", "Where to start when operational handoffs stop scaling.", "logistics-digital-transformation-africa"),
  sysint: n("Read the System Integration strategy", "Define what moves, who owns it and what happens on failure.", "system-integration-strategy"),
  erpcust: n("Read: ERP vs custom software", "Decide where ERP fits and where custom software is justified.", "erp-vs-custom-software"),
  de: n("Read: Data engineering for growing businesses", "Build the foundation reporting and decisions depend on.", "data-engineering-growing-businesses"),
  mds: n("Read: The modern data stack", "Choose platform components around real information needs.", "modern-data-stack"),
  dwh: n("Read: Data warehouse modernization", "Evolve transformations, testing and governance safely.", "data-warehouse-modernization"),
  appmod: n("Read: Modernize or replace?", "Compare refactor, replatform, rebuild and replace.", "application-modernization-refactor-replatform-rebuild-replace"),
  cloudmig: n("Read: Cloud migration vs modernization", "Separate hosting change from application and data change.", "cloud-migration-vs-cloud-modernization"),
  legacy: n("Read: 12 signs of legacy application risk", "Diagnose whether the application is constraining the business.", "legacy-application-business-risk"),
  hcdt: n("Read: Healthcare digital transformation", "Improve administrative and departmental workflows pragmatically.", "healthcare-digital-transformation-africa"),
  hcpipe: n("Read: Healthcare data pipeline modernization", "Make healthcare data flows validated and observable.", "healthcare-data-pipeline-modernization"),
  silos: n("Read: Data silos and business visibility", "Identify where information is fragmented across systems.", "data-silos-business-visibility"),
  wfa: n("Read the Workflow Automation strategy", "Decide which process to automate, integrate or redesign first.", "workflow-automation-strategy"),
  excel: n("Read: Replacing Excel-based processes", "A staged path from critical workbooks to connected workflows.", "digitalize-excel-workflows"),
  mfgaf: n("Read: Manufacturing digitalization in Africa", "Connect production, inventory and reporting around key handoffs.", "manufacturing-digitalization-africa"),
  fund: n("Read: Scaling fintech engineering after funding", "Decide what to hire, extend or deliver as a bounded project.", "fintech-scale-engineering-after-funding"),
  finmod: n("Read: Fintech platform modernization", "Modernize the constraint slowing the roadmap.", "fintech-platform-modernization"),
  finapi: n("Read the Fintech Integration Strategy", "Connect identity, payments, data, trading and reporting reliably.", "fintech-api-integration-strategy"),
  outsrc: n("Read: What a fintech should outsource", "Decide what to own, extend or delegate.", "fintech-what-to-outsource"),
  async: n("Read: Reliable asynchronous workflows in fintech", "Design retries, reconciliation and audit around critical processing.", "fintech-asynchronous-workflows"),
  findata: n("Read: Fintech data engineering", "A traceable path from transaction to management information.", "fintech-data-engineering"),
  wl: n("Read: White-label software development", "Structure delivery under your brand with clear ownership.", "white-label-software-development"),
  partner: n("Read: Evaluating an engineering partner", "Assess a partner on ownership, communication and continuity.", "evaluate-software-engineering-partner"),
  backlog: n("Read: Reducing an engineering backlog", "Remove delivery constraints before simply adding developers.", "reduce-engineering-backlog"),
  aiready: n("Read: AI integration readiness", "Check data, systems and oversight before building.", "ai-integration-readiness"),
  bizcase: n("Read: The business case for digitalization", "Build a credible case without inventing ROI.", "business-case-process-digitalization"),
  oprep: n("Read: Operational reporting modernization", "Trace reporting back to its source record and definitions.", "operational-reporting-modernization"),
};

const TP = c("Product", "Explore TripOps", "Xyncwave's product for trip records, trip expenses, budgets and reconciliation.", "/products/tripops");

const R = {
  log: c("Research", "Research: Southern Africa Logistics Outlook 2027", "Where operators lose continuity between transport, warehouse, POD and finance.", "/research/southern-africa-logistics-2027"),
  fin: c("Research", "Research: US Fintech Delivery Readiness 2027", "Assess product, integrations, QA, release and data foundations before committing.", "/research/us-fintech-readiness-2027"),
};

type Journey = { items: ExploreItem[]; cta?: string };

export const solutionJourneys: Record<string, Journey> = {
  "software-engineering": { items: [C.brok, C.hosp, N.finmod, N.async, S.int, I.fin], cta: "Discuss what needs to be built or extended" },
  "digital-transformation": { items: [C.tt, C.sheet, N.frag, N.wfa, S.erp, I.log, TP], cta: "Discuss where the process is breaking down" },
  "application-modernization": { items: [C.dotnet, C.brok, N.appmod, N.legacy, S.cloud, I.tech], cta: "Review the application constraint" },
  "cloud-platform-engineering": { items: [C.dotnet, C.mig, N.cloudmig, N.mds, S.mod, I.fin], cta: "Discuss the platform constraint" },
  "data-engineering": { items: [C.dbt, C.rep, N.de, N.oprep, S.int, I.mfg], cta: "Discuss the information or reporting problem" },
  "ai-automation": { items: [N.aiwf, N.aiready, N.wfa, S.data, S.int, I.tech], cta: "Assess whether the workflow is ready for AI" },
  integration: { items: [C.tt, C.brok, R.log, N.sysint, N.finapi, S.erp, I.log], cta: "Discuss where systems are failing to connect" },
  "erp-business-systems": { items: [C.tt, C.sheet, N.erpcust, N.excel, S.dt, I.mfg, TP], cta: "Discuss where ERP should—and should not—own the process" },
  "engineering-capacity": { items: [C.ec, C.brok, R.fin, N.capm, N.wl, N.partner, I.tech], cta: "Tell us where additional capability is needed" },
};

export const industryJourneys: Record<string, Journey> = {
  logistics: { items: [C.tt, TP, R.log, C.rep, N.logaf, N.wfa, S.dt, S.erp], cta: "Discuss the operational workflow" },
  manufacturing: { items: [C.rep, C.sheet, N.mfgaf, N.erpcust, S.erp, S.data], cta: "Discuss where operational complexity is increasing" },
  healthcare: { items: [C.hosp, C.hcdata, N.hcdt, N.hcpipe, S.int, S.data], cta: "Discuss the operational or data workflow" },
  fintech: { items: [C.brok, C.ec, R.fin, N.fund, N.finapi, N.async, S.sw], cta: "Discuss the product or engineering constraint" },
  "technology-it-services": { items: [C.ec, C.dotnet, N.wl, N.partner, S.cap, S.sw], cta: "Discuss the delivery-capacity requirement" },
};

export const caseStudyJourneys: Record<string, Journey> = {
  "track-trace": { items: [I.log, S.dt, R.log, S.erp, S.int, N.logaf, N.sysint], cta: "Discuss a similar operational workflow" },
  "engineering-capacity": { items: [I.tech, S.cap, S.sw, N.wl, N.partner, N.backlog], cta: "Discuss the capability gap" },
  "hospital-operations-platform": { items: [I.hc, S.sw, S.dt, S.int, N.hcdt, N.wfa], cta: "Discuss an operational healthcare workflow" },
  "healthcare-data-processing-pipelines": { items: [I.hc, S.data, S.int, S.cloud, N.hcpipe, N.de], cta: "Discuss the healthcare data workflow" },
  "spreadsheet-project-tracking-digitalization": { items: [S.dt, S.erp, S.sw, N.excel, N.wfa, N.bizcase], cta: "Discuss a spreadsheet-dependent workflow" },
  "cloud-native-dotnet-modernization": { items: [S.mod, S.cloud, S.sw, N.appmod, N.cloudmig, N.legacy], cta: "Review a modernization challenge" },
  "snowflake-dbt-analytics-platform": { items: [S.data, S.cloud, S.int, N.mds, N.de, N.oprep], cta: "Discuss the analytics architecture" },
  "snowflake-data-warehouse-modernization": { items: [S.data, S.cloud, N.dwh, N.mds, N.silos], cta: "Discuss the warehouse modernization requirement" },
  "cloud-data-migration-recovery": { items: [S.data, S.cloud, N.cloudmig, N.dwh, N.de], cta: "Discuss the migration constraint" },
  "enterprise-reporting-data-accuracy": { items: [S.data, S.int, S.dt, N.oprep, N.silos, N.de], cta: "Discuss the reporting problem" },
  "digital-brokerage-platform": { items: [I.fin, S.sw, R.fin, S.int, S.cloud, N.finapi, N.async], cta: "Discuss the platform or engineering challenge" },
};

export const insightJourneys: Record<string, Journey> = {
  "digital-transformation-fragmented-systems": { items: [S.dt, I.log, C.sheet, N.wfa], cta: "Identify where fragmentation is occurring" },
  "ai-workflow-automation": { items: [S.ai, S.dt, N.aiready, N.wfa], cta: "Assess whether the workflow is ready for AI" },
  "staff-augmentation-vs-dedicated-team-vs-outsourcing": { items: [S.cap, I.tech, C.ec, N.partner, N.backlog], cta: "Discuss the capacity constraint" },
  "logistics-digital-transformation-africa": { items: [S.dt, I.log, C.tt, R.log, N.sysint], cta: "Discuss the logistics workflow" },
  "system-integration-strategy": { items: [S.int, S.erp, C.tt, N.finapi], cta: "Discuss the systems that need to connect" },
  "erp-vs-custom-software": { items: [S.erp, I.mfg, C.sheet, N.excel], cta: "Evaluate the right system boundary" },
  "data-engineering-growing-businesses": { items: [S.data, C.dbt, N.mds, N.oprep], cta: "Discuss the data architecture" },
  "modern-data-stack": { items: [S.data, S.cloud, C.dbt, N.dwh], cta: "Review the current data platform" },
  "data-warehouse-modernization": { items: [S.data, C.wh, N.mds, N.silos], cta: "Discuss warehouse modernization" },
  "application-modernization-refactor-replatform-rebuild-replace": { items: [S.mod, C.dotnet, N.cloudmig, N.legacy], cta: "Review the modernization decision" },
  "cloud-migration-vs-cloud-modernization": { items: [S.cloud, S.mod, C.dotnet, N.legacy], cta: "Determine whether migration is enough" },
  "legacy-application-business-risk": { items: [S.mod, S.sw, C.dotnet, N.appmod], cta: "Assess the application constraint" },
  "healthcare-digital-transformation-africa": { items: [S.dt, I.hc, C.hosp, N.hcpipe], cta: "Discuss the operational workflow" },
  "healthcare-data-pipeline-modernization": { items: [S.data, I.hc, C.hcdata, N.silos], cta: "Discuss the healthcare data flow" },
  "data-silos-business-visibility": { items: [S.data, S.int, C.rep, N.oprep], cta: "Identify where information is fragmented" },
  "workflow-automation-strategy": { items: [S.dt, S.ai, C.sheet, N.excel], cta: "Discuss the workflow" },
  "digitalize-excel-workflows": { items: [S.dt, I.mfg, C.sheet, N.wfa], cta: "Assess an Excel-dependent process" },
  "manufacturing-digitalization-africa": { items: [S.erp, I.mfg, N.oprep, N.erpcust], cta: "Discuss the manufacturing workflow" },
  "fintech-scale-engineering-after-funding": { items: [S.cap, I.fin, C.brok, N.outsrc], cta: "Discuss the next stage of engineering capacity" },
  "fintech-platform-modernization": { items: [S.mod, I.fin, C.brok, N.finapi], cta: "Discuss the platform constraint" },
  "fintech-api-integration-strategy": { items: [S.int, I.fin, C.brok, N.async], cta: "Discuss the integration architecture" },
  "fintech-what-to-outsource": { items: [S.cap, I.fin, C.ec, N.partner], cta: "Evaluate the delivery model" },
  "fintech-asynchronous-workflows": { items: [S.sw, I.fin, C.brok, N.finapi], cta: "Discuss the workflow architecture" },
  "fintech-data-engineering": { items: [S.data, I.fin, C.brok, N.de], cta: "Discuss the fintech data architecture" },
  "white-label-software-development": { items: [S.cap, I.tech, C.ec, N.partner], cta: "Explore a white-label delivery model" },
  "evaluate-software-engineering-partner": { items: [S.cap, I.tech, C.ec, N.wl], cta: "Discuss the delivery requirement" },
  "reduce-engineering-backlog": { items: [S.cap, I.tech, C.ec, N.partner], cta: "Discuss where delivery is constrained" },
  "ai-integration-readiness": { items: [S.ai, S.data, S.int, N.aiwf], cta: "Assess AI readiness" },
  "business-case-process-digitalization": { items: [S.dt, I.log, C.sheet, N.wfa], cta: "Evaluate a digitalization opportunity" },
  "operational-reporting-modernization": { items: [S.data, I.mfg, C.rep, N.silos], cta: "Discuss the reporting constraint" },
  "fintech-partner-integration-launch-readiness": { items: [S.int, I.fin, C.brok, R.fin, N.finapi], cta: "Review an Upcoming Integration Launch" },
  "it-consulting-delivery-margin-capacity-scope-handoffs": { items: [S.cap, I.tech, C.ec, R.fin, N.wl], cta: "Discuss a Delivery Capacity Gap" },
  "multi-site-manufacturing-erp-rollout-readiness-africa": { items: [S.erp, I.mfg, R.log, N.mfgaf, N.erpcust], cta: "Discuss a Multi-Site ERP Readiness Review" },
};
