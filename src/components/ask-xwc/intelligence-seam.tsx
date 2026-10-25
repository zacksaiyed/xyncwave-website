import { ArrowUpRight } from "lucide-react";
import { forwardRef } from "react";
import "./intelligence-seam.css";

export const IntelligenceSeam = forwardRef<
  HTMLButtonElement,
  { onOpen: () => void; loading?: boolean }
>(function IntelligenceSeam({ onOpen, loading = false }, ref) {
  return (
    <div className="ask-xwc-seam-wrap">
      <button
        ref={ref}
        type="button"
        className="ask-xwc-seam"
        onClick={onOpen}
        disabled={loading}
        aria-haspopup="dialog"
        aria-label="Ask XWC — explore this page intelligently"
      >
        <span className="ask-xwc-seam-mark" aria-hidden="true" />
        <span className="ask-xwc-seam-title">Ask XWC</span>
        <span className="ask-xwc-seam-divider" aria-hidden="true" />
        <span className="ask-xwc-seam-copy">
          {loading ? "Opening intelligent experience" : "Explore this intelligently"}
        </span>
        <ArrowUpRight className="ask-xwc-seam-arrow" aria-hidden="true" />
      </button>
    </div>
  );
});
