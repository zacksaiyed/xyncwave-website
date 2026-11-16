import type { ResearchPaper } from "./research-papers";
import { logisticsPaper } from "./research-paper-logistics";
import { fintechPaper } from "./research-paper-fintech";

export const researchPapers: ResearchPaper[] = [logisticsPaper, fintechPaper];

export const getPaperBySlug = (slug: string) => researchPapers.find((p) => p.slug === slug);
export const getPaperByAssetId = (assetId: string) => researchPapers.find((p) => p.assetId === assetId);

/** Storage object path inside the private `research-papers` bucket. Server-side only. */
export const paperStoragePath = (paper: ResearchPaper) => `${paper.assetId}/${paper.pdfFilename}`;
