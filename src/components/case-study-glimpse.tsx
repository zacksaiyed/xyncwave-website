import { DigitalVisual } from "./digital-visuals";
import { getCaseStudyMedia } from "../lib/media-registry";

export function CaseStudyGlimpse({ slug }: { slug: string }) {
  return <section className="pb-section"><div className="mx-auto max-w-7xl px-5 lg:px-8"><DigitalVisual media={getCaseStudyMedia(slug)} detail className="case-study-glimpse" /></div></section>;
}