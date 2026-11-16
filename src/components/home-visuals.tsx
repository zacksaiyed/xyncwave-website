import { useEffect, useRef, useState } from "react";
import heroLiquid from "@/assets/media/hero-graphite-liquid.webp";
import heroLiquidSmall from "@/assets/media/hero-graphite-liquid-800.webp";
import liquidFlow from "@/assets/media/liquid-flow-graphite.webp";
import liquidFlowSmall from "@/assets/media/liquid-flow-graphite-960.webp";

/** Decorative flowing digital-transformation current for dark sections. */
export function LiquidFlowBackdrop({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden="true" className={`liquid-flow pointer-events-none${flip ? " is-flipped" : ""}`}>
      <img
        src={liquidFlow}
        srcSet={`${liquidFlowSmall} 960w, ${liquidFlow} 1920w`}
        sizes="100vw"
        alt=""
        width={1920}
        height={1088}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/* Restrained graphite liquid current for the homepage hero. Decorative only. */

export function HeroLiquidFlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
      el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="hero-liquid pointer-events-none">
      <img
        src={heroLiquid}
        srcSet={`${heroLiquidSmall} 800w, ${heroLiquid} 1408w`}
        sizes="(min-width: 1024px) 46vw, 0px"
        alt=""
        width={1408}
        height={1408}
        fetchPriority="high"
        className="hero-liquid-img"
      />
    </div>
  );
}


export function TransformationFlow() {
  const before = ["Disconnected systems", "Manual workflows", "Fragmented data", "Delivery constraints"];
  const stages = ["Understand", "Architect", "Engineer", "Automate", "Scale"];
  const after = ["Connected systems", "Clearer visibility", "Structured workflows", "Scalable delivery"];
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(stages.length);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setStep(0);
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.85 - r.top) / (r.height * 0.8);
      setStep(Math.max(0, Math.min(stages.length, Math.floor(p * (stages.length + 1)))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const done = step >= stages.length;
  return (
    <div ref={ref} className="xflow" aria-label="Transformation from fragmented operations to connected digital systems">
      <div className="xflow-col">{before.map((b, i) => <div key={b} className="xflow-node xflow-before" style={{ marginLeft: `${[0, 14, 4, 20][i]}px` }}>{b}</div>)}</div>
      <ol className="xflow-spine">
        <span className="xflow-track" aria-hidden="true"><span style={{ height: `${(step / stages.length) * 100}%` }} /></span>
        {stages.map((s, i) => <li key={s} className={i < step ? "is-active" : ""}>{s}</li>)}
      </ol>
      <div className="xflow-col">{after.map((a) => <div key={a} className={`xflow-node xflow-after ${done ? "is-active" : ""}`}>{a}</div>)}</div>
    </div>
  );
}
