// Homepage hero illustration: precise shapes, subtle depth, one blue connection.
export function ConnectedArchitecture() {
  const block = (x: number, y: number, w: number, h: number, d = 18) => <g>
    <path d={`M${x} ${y} l${d} ${-d} h${w} l${-d} ${d} z`} className="fill-background stroke-border" />
    <path d={`M${x + w} ${y} l${d} ${-d} v${h} l${-d} ${d} z`} className="fill-secondary stroke-border" />
    <rect x={x} y={y} width={w} height={h} className="fill-background stroke-border" />
  </g>;
  return <figure aria-hidden="true" className="relative mx-auto w-full max-w-[560px]">
    <svg viewBox="0 0 520 440" className="h-auto w-full text-foreground" fill="none" strokeWidth="1">
      <g className="stroke-border" strokeDasharray="2 6">
        <path d="M20 400 H500" /><path d="M20 340 H500" /><path d="M120 40 V420" /><path d="M400 40 V420" />
      </g>
      {block(60, 120, 120, 80)}
      {block(300, 70, 140, 64)}
      {block(250, 260, 150, 90)}
      {block(70, 290, 90, 60)}
      <g className="fill-muted-foreground/40">
        {[0, 1, 2].map((i) => <rect key={`a${i}`} x={76} y={140 + i * 16} width={70 - i * 14} height={4} />)}
        {[0, 1].map((i) => <rect key={`b${i}`} x={316} y={88 + i * 16} width={90 - i * 26} height={4} />)}
        {[0, 1, 2, 3].map((i) => <rect key={`c${i}`} x={268} y={280 + i * 14} width={110 - i * 18} height={4} />)}
      </g>
      <g className="stroke-muted-foreground/50">
        <path d="M180 160 H240 V102 H300" />
        <path d="M115 290 V200" />
      </g>
      <path d="M180 180 H220 V305 H250" className="stroke-primary" strokeWidth="2" />
      <circle cx="180" cy="180" r="4" className="fill-primary" />
      <circle cx="250" cy="305" r="4" className="fill-primary" />
      <g className="fill-background stroke-muted-foreground/60">
        <circle cx="240" cy="102" r="3" /><circle cx="115" cy="245" r="3" />
      </g>
      <text x="300" y="58" className="fill-muted-foreground" fontSize="9" letterSpacing="2">SYSTEM / 02</text>
      <text x="60" y="94" className="fill-muted-foreground" fontSize="9" letterSpacing="2">OPERATIONS / 01</text>
      <text x="250" y="372" className="fill-muted-foreground" fontSize="9" letterSpacing="2">DATA / 03</text>
    </svg>
  </figure>;
}
