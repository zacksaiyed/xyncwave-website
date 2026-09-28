import { Check } from "lucide-react";
import { Eyebrow } from "./page-sections";

export function SolutionOutcome({ intro, outcomes, muted }: { intro: string; outcomes: string[]; muted?: boolean }) {
  return <section className={`py-section ${muted ? "bg-secondary" : ""}`}><div className="mx-auto max-w-5xl px-5 lg:px-8"><Eyebrow>The result</Eyebrow><h2 className="text-3xl font-bold sm:text-5xl">Solution Outcome</h2><p className="mt-6 text-lg leading-8 text-muted-foreground">{intro}</p><ul className="mt-10 grid gap-x-8 border-t border-border sm:grid-cols-2">{outcomes.map(x => <li key={x} className="flex gap-3 border-b border-border py-4 font-semibold"><Check className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />{x}</li>)}</ul></div></section>;
}
