import { ArrowUpRight, FileCheck2 } from "lucide-react";
import type { XwcSource } from "../../lib/ask-xwc/types";
import { SmartLink } from "../app-link";

export function EvidencePanel({
  sources,
  onNavigate,
}: {
  sources: XwcSource[];
  onNavigate?: () => void;
}) {
  if (!sources.length) return null;
  return (
    <section className="ask-xwc-evidence" aria-labelledby="ask-xwc-evidence-title">
      <div className="ask-xwc-section-heading">
        <FileCheck2 aria-hidden="true" />
        <h3 id="ask-xwc-evidence-title">Verified from XWC</h3>
      </div>
      <ul>
        {sources.map((source) => (
          <li key={source.id}>
            {source.route ? (
              <SmartLink to={source.route} onClick={onNavigate}>
                <span>
                  <strong>{source.title}</strong>
                  <small>{source.route}</small>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </SmartLink>
            ) : (
              <div>
                <span>
                  <strong>{source.title}</strong>
                  <small>XWC knowledge</small>
                </span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
