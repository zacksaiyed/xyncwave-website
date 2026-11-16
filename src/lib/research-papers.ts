export type PaperTable = { headers: string[]; rows: string[][] };
export type PaperSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  subsections?: { title: string; paragraphs: string[] }[];
  table?: PaperTable;
  /** Paragraphs rendered after the table/bullets (closing analysis within a section). */
  afterParagraphs?: string[];
};
export type PaperSource = { institution: string; year: string; title: string; url: string; note?: string };

export type ResearchPaper = {
  assetId: string;
  slug: string;
  title: string;
  subtitle: string;
  audience: string;
  asOf: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  preview: string[];
  keyQuestions: string[];
  scopeNote: string;
  sections: PaperSection[];
  bibliography: PaperSource[];
  gateCta: string;
  afterCta: string;
  afterCtaTo: string;
  pdfFilename: string;
  emailDescription: string;
};
