import { getInsightAuthor } from "../lib/insight-authors";
import { SmartLink } from "./app-link";

export function InsightAuthor({ slug, date }: { slug: string; date?: string }) {
  const author = getInsightAuthor(slug);
  if (!author) return null;
  return <div className="mt-7 flex items-center gap-3 text-sm">
    <img src={author.image} alt="" className="size-11 shrink-0 rounded-full border border-border object-cover" style={{ objectPosition: author.focalPoint }} />
    <div className="min-w-0">
      <p className="font-medium text-foreground">By {author.name} <span className="font-normal text-muted-foreground">· {author.role}</span></p>
      {date && <p className="text-muted-foreground">Published {date}</p>}
      <SmartLink to="/about" className="text-xs text-primary hover:underline">Meet the Xyncwave team</SmartLink>
    </div>
  </div>;
}