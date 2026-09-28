import { teamMembers } from "./about-content";

// Editorial assignments use the publicly listed technical roles on the About page.
const authorBySlug: Record<string, string> = {
  "fintech-what-to-outsource": "Mizba Siddiqui",
  "fintech-asynchronous-workflows": "Haziq Hasan",
  "fintech-data-engineering": "Ghufran Khan",
  "white-label-software-development": "Mizba Siddiqui",
  "evaluate-software-engineering-partner": "Umar Uddin",
  "reduce-engineering-backlog": "Haziq Hasan",
  "ai-integration-readiness": "Umar Uddin",
  "business-case-process-digitalization": "Mizba Siddiqui",
  "operational-reporting-modernization": "Ghufran Khan",
  "fintech-scale-engineering-after-funding": "Mizba Siddiqui",
  "fintech-platform-modernization": "Umar Uddin",
  "fintech-api-integration-strategy": "Haziq Hasan",
  "workflow-automation-strategy": "Mizba Siddiqui",
  "digitalize-excel-workflows": "Mizba Siddiqui",
  "manufacturing-digitalization-africa": "Haziq Hasan",
  "healthcare-digital-transformation-africa": "Mizba Siddiqui",
  "healthcare-data-pipeline-modernization": "Aman Siddiqui",
  "data-silos-business-visibility": "Ghufran Khan",
  "application-modernization-refactor-replatform-rebuild-replace": "Haziq Hasan",
  "cloud-migration-vs-cloud-modernization": "Umar Uddin",
  "legacy-application-business-risk": "Haziq Hasan",
  "digital-transformation-fragmented-systems": "Mizba Siddiqui",
  "ai-workflow-automation": "Umar Uddin",
  "staff-augmentation-vs-dedicated-team-vs-outsourcing": "Mizba Siddiqui",
  "logistics-digital-transformation-africa": "Mizba Siddiqui",
  "system-integration-strategy": "Haziq Hasan",
  "erp-vs-custom-software": "Haziq Hasan",
  "data-engineering-growing-businesses": "Aman Siddiqui",
  "modern-data-stack": "Ghufran Khan",
  "data-warehouse-modernization": "Furqan Kahn",
};

export function getInsightAuthor(slug: string) {
  const name = authorBySlug[slug];
  return teamMembers.find((member) => member.name === name);
}