import { useId } from "react";

/** Decorative, deterministic geometry. All business meaning stays in the adjacent HTML. */
export function ConnectedArchitecture() {
  const id = useId().replace(/:/g, "");
  const face = `${id}-face`;
  const top = `${id}-top`;
  const side = `${id}-side`;
  const shadow = `${id}-shadow`;

  return (
    <figure className="connected-architecture" aria-hidden="true">
      <svg viewBox="0 0 760 620" role="presentation" focusable="false">
        <defs>
          <linearGradient id={face} x1="0" y1="0" x2="1" y2="0.85">
            <stop offset="0" stopColor="var(--architecture-face-high)" />
            <stop offset="1" stopColor="var(--architecture-face)" />
          </linearGradient>
          <linearGradient id={top} x1="0" y1="0" x2="0.75" y2="1">
            <stop offset="0" stopColor="var(--architecture-face-high)" />
            <stop offset="1" stopColor="var(--architecture-side-high)" />
          </linearGradient>
          <linearGradient id={side} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--architecture-side-high)" />
            <stop offset="1" stopColor="var(--architecture-side)" />
          </linearGradient>
          <filter id={shadow} x="-25%" y="-55%" width="150%" height="210%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        {/* Grounding, not glow. The shadow bounds are fully contained in the viewBox. */}
        <g fill="var(--architecture-shadow)" opacity="0.12" filter={`url(#${shadow})`}>
          <path d="m124 375 128-74 108 62-128 74z" />
          <path d="m356 308 114-66 109 63-114 66z" />
          <path d="m531 409 123-71 63 36-123 71z" />
          <path d="m291 502 173-100 172 99-173 100z" />
        </g>

        {/* Rear plane: the common axis from which the assembly is organised. */}
        <g stroke="var(--architecture-edge)" strokeWidth="0.7" strokeLinejoin="round">
          <path d="m356 99 27-16 132 76-27 16z" fill={`url(#${top})`} />
          <path d="m356 99 132 76v220l-132-76z" fill={`url(#${face})`} />
          <path d="m488 175 27-16v220l-27 16z" fill={`url(#${side})`} />
        </g>

        {/* One continuous blue connection, weaving through the neutral assembly. */}
        <path
          className="architecture-connection"
          d="M155 370 255 428 342 378 342 319 441 262 590 348 590 447 462 521 365 465"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="butt"
        />

        {/* Independent system volume. */}
        <g stroke="var(--architecture-edge)" strokeWidth="0.7" strokeLinejoin="round">
          <path d="m113 261 114-66 106 61-114 66z" fill={`url(#${top})`} />
          <path d="m113 261 106 61v123l-106-61z" fill={`url(#${face})`} />
          <path d="m219 322 114-66v123l-114 66z" fill={`url(#${side})`} />
        </g>

        {/* An open architectural frame, not another labelled glass card. */}
        <g stroke="var(--architecture-edge)" strokeWidth="0.7" strokeLinejoin="round">
          <path d="m531 235 24-14 135 78-24 14z" fill={`url(#${top})`} />
          <path d="m666 313 24-14v183l-24 14z" fill={`url(#${side})`} />
          <path
            d="M531 235 666 313 666 496 531 418Z M552 277 552 405 645 459 645 331Z"
            fill={`url(#${face})`}
            fillRule="evenodd"
          />
          <path d="m552 277 15 9v110l-15 9z" fill={`url(#${side})`} />
          <path d="m552 405 15-9 78 45v18z" fill={`url(#${top})`} />
        </g>

        {/* Two lower planes give depth without competing with the upright frame. */}
        <g stroke="var(--architecture-edge)" strokeWidth="0.7" strokeLinejoin="round">
          <path d="m350 476 138-80 129 75-138 80z" fill={`url(#${top})`} />
          <path d="m350 476 129 75v30l-129-75z" fill={`url(#${face})`} />
          <path d="m479 551 138-80v30l-138 80z" fill={`url(#${side})`} />
          <path d="m267 443 64-37 81 47-64 37z" fill={`url(#${top})`} />
          <path d="m267 443 81 47v23l-81-47z" fill={`url(#${face})`} />
          <path d="m348 490 64-37v23l-64 37z" fill={`url(#${side})`} />
        </g>
      </svg>
    </figure>
  );
}
