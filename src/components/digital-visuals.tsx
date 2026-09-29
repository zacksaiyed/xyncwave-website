import heroImage from "../assets/digital-system-hero.jpg";
import trackTraceImage from "../assets/track-trace-system.jpg";
import engineeringImage from "../assets/engineering-capacity.jpg";
import digitalizationImage from "../assets/insight-digitalization.jpg";
import capacityImage from "../assets/insight-capacity.jpg";
import aiImage from "../assets/insight-ai.jpg";
import modernizationImage from "../assets/insight-modernization.jpg";
import fragmentationImage from "../assets/insight-fragmentation.jpg";
import aiWorkflowImage from "../assets/insight-ai-workflow.jpg";
import teamModelsImage from "../assets/insight-team-models.jpg";
import { getInsightMedia, type MediaEntry } from "../lib/media-registry";

export const visuals = {
  hero: heroImage,
  trackTrace: trackTraceImage,
  engineering: engineeringImage,
  digitalization: digitalizationImage,
  capacity: capacityImage,
  ai: aiImage,
  modernization: modernizationImage,
} as const;

export const insightVisuals: Record<string, string> = {
  "healthcare-digital-transformation-africa": digitalizationImage,
  "healthcare-data-pipeline-modernization": digitalizationImage,
  "data-silos-business-visibility": fragmentationImage,
  "application-modernization-refactor-replatform-rebuild-replace": modernizationImage,
  "cloud-migration-vs-cloud-modernization": digitalizationImage,
  "legacy-application-business-risk": modernizationImage,
  "digital-transformation-fragmented-systems": fragmentationImage,
  "ai-workflow-automation": aiWorkflowImage,
  "staff-augmentation-vs-dedicated-team-vs-outsourcing": teamModelsImage,
  "logistics-digital-transformation-africa": trackTraceImage,
  "system-integration-strategy": fragmentationImage,
  "erp-vs-custom-software": modernizationImage,
  "data-engineering-growing-businesses": digitalizationImage,
  "modern-data-stack": aiImage,
  "data-warehouse-modernization": modernizationImage,
};

export function getInsightVisual(slug: string) {
  return getInsightMedia(slug).src || insightVisuals[slug] || digitalizationImage;
}

export function DigitalVisual({
  src,
  alt,
  media,
  eager = false,
  className = "",
}: {
  src?: string;
  alt?: string;
  media?: MediaEntry | undefined;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`digital-visual relative overflow-hidden rounded-card border border-border bg-surface-strong ${className}`}
    >
      <img
        src={media?.src ?? src}
        srcSet={media?.srcSet}
        sizes={media ? "(min-width: 1024px) 50vw, 100vw" : undefined}
        alt={media?.alt ?? alt ?? ""}
        width={1600}
        height={1000}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        decoding="async"
        style={media ? { objectPosition: media.position } : undefined}
        className="h-full w-full object-cover"
      />
      <div
        className="digital-visual-wash pointer-events-none absolute inset-0"
        aria-hidden="true"
      />
      <div
        className="digital-visual-index pointer-events-none absolute bottom-0 left-0 h-px w-20 bg-primary"
        aria-hidden="true"
      />
    </div>
  );
}

export function SystemMap() {
  const before = [
    "Disconnected systems",
    "Manual workflows",
    "Fragmented data",
    "Delivery constraints",
  ];
  const after = [
    "Connected systems",
    "Clearer visibility",
    "Structured workflows",
    "Scalable delivery",
  ];
  const stages = ["Understand", "Architect", "Engineer", "Automate", "Scale"];
  return (
    <div
      className="system-map"
      aria-label="Transformation from fragmented operations to connected digital systems"
    >
      <div className="system-process" aria-label="Transformation stages">
        {stages.map((stage, index) => (
          <span className="system-stage" key={stage}>
            <span aria-hidden="true">0{index + 1}</span>
            <strong>{stage}</strong>
          </span>
        ))}
      </div>
      <div className="system-flow">
        {before.map((item, index) => (
          <div className="system-flow-row" key={item}>
            <div className="system-node system-node-muted">
              <span className="system-node-index" aria-hidden="true">
                0{index + 1}
              </span>
              <span>{item}</span>
            </div>
            <div className="system-connector" aria-hidden="true">
              <span />
            </div>
            <div className="system-node system-node-result">
              <span className="system-result-mark" aria-hidden="true" />
              <span>{after[index]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
