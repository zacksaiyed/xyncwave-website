import { useId } from "react";

/** Decorative architectural assembly: separate systems connected through one operating layer. */
export function ConnectedArchitecture() {
  const id = useId().replace(/:/g, "");
  const frontFace = `${id}-front-face`;
  const topFace = `${id}-top-face`;
  const sideFace = `${id}-side-face`;
  const glassFace = `${id}-glass-face`;
  const contactShadow = `${id}-contact-shadow`;
  const connectionGlow = `${id}-connection-glow`;
  const connectionPath = "M40 445 180 364 304 435 438 358 564 431 720 341";

  return (
    <figure className="connected-architecture" aria-hidden="true">
      <svg viewBox="0 0 760 620" role="presentation" focusable="false">
        <defs>
          <linearGradient id={frontFace} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--architecture-face-high)" />
            <stop offset="1" stopColor="var(--architecture-face)" />
          </linearGradient>
          <linearGradient id={topFace} x1="0" y1="0" x2=".85" y2="1">
            <stop offset="0" stopColor="var(--architecture-face-high)" />
            <stop offset=".72" stopColor="var(--architecture-face-high)" />
            <stop offset="1" stopColor="var(--architecture-face)" />
          </linearGradient>
          <linearGradient id={sideFace} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--architecture-side-high)" />
            <stop offset="1" stopColor="var(--architecture-side)" />
          </linearGradient>
          <linearGradient id={glassFace} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--architecture-face-high)" stopOpacity=".72" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity=".08" />
          </linearGradient>
          <filter id={contactShadow} x="-30%" y="-70%" width="170%" height="260%">
            <feGaussianBlur stdDeviation="20" />
          </filter>
          <filter id={connectionGlow} x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <ellipse
          cx="401"
          cy="520"
          rx="310"
          ry="54"
          fill="var(--architecture-shadow)"
          opacity=".12"
          filter={`url(#${contactShadow})`}
        />

        <path
          d={connectionPath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="20"
          strokeLinecap="square"
          strokeLinejoin="miter"
          opacity=".15"
          filter={`url(#${connectionGlow})`}
        />
        <path
          className="architecture-connection"
          d={connectionPath}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* Tall rear system. */}
        <g stroke="var(--architecture-edge)" strokeLinejoin="round">
          <path d="m389 91 36-21 104 60-36 21z" fill={`url(#${topFace})`} />
          <path d="m389 91 104 60v226l-104-60z" fill={`url(#${frontFace})`} />
          <path d="m493 151 36-21v226l-36 21z" fill={`url(#${sideFace})`} />
        </g>
        <text className="architecture-label" transform="matrix(.866 .5 0 1 414 165)">
          <tspan x="0" y="0">
            PEOPLE
          </tspan>
          <tspan x="0" y="17">
            IDEAS
          </tspan>
          <tspan x="0" y="34">
            TECH
          </tspan>
          <tspan x="0" y="51">
            PROGRESS
          </tspan>
        </text>

        {/* Legacy system volume. */}
        <g stroke="var(--architecture-edge)" strokeLinejoin="round">
          <path d="m112 281 116-67 102 59-116 67z" fill={`url(#${topFace})`} />
          <path d="m112 281 102 59v145l-102-59z" fill={`url(#${frontFace})`} />
          <path d="m214 340 116-67v145l-116 67z" fill={`url(#${sideFace})`} />
        </g>
        <text className="architecture-label" transform="matrix(.866 .5 0 1 137 350)">
          <tspan x="0" y="0">
            LEGACY
          </tspan>
          <tspan x="0" y="17">
            TO
          </tspan>
          <tspan x="0" y="34">
            POSSIBILITY
          </tspan>
        </text>

        {/* Open cloud/data plane. */}
        <g stroke="var(--architecture-edge)" strokeLinejoin="round">
          <path d="m528 225 29-17 136 79-29 17z" fill={`url(#${topFace})`} />
          <path d="m528 225 136 79v185l-136-79z" fill={`url(#${glassFace})`} />
          <path d="m664 304 29-17v185l-29 17z" fill={`url(#${sideFace})`} />
          <path
            d="m550 270 91 53v118l-91-53z"
            fill="none"
            stroke="var(--architecture-frame)"
            opacity=".42"
          />
        </g>
        <text className="architecture-label" transform="matrix(.866 .5 0 1 558 330)">
          <tspan x="0" y="0">
            CLOUD
          </tspan>
          <tspan x="0" y="17">
            DATA
          </tspan>
          <tspan x="0" y="34">
            AI
          </tspan>
          <tspan x="0" y="51">
            IMPACT
          </tspan>
        </text>

        {/* Upright shared capability. */}
        <g stroke="var(--architecture-edge)">
          <ellipse cx="375" cy="467" rx="92" ry="116" fill={`url(#${sideFace})`} />
          <ellipse cx="356" cy="456" rx="92" ry="116" fill={`url(#${frontFace})`} />
          <path
            d="M356 340c51 0 92 52 92 116s-41 116-92 116"
            fill="none"
            stroke="var(--architecture-face-high)"
            opacity=".55"
          />
        </g>
        <text className="architecture-label architecture-label--disc" textAnchor="middle">
          <tspan x="356" y="438">
            SIMPLER
          </tspan>
          <tspan x="356" y="455">
            SMARTER
          </tspan>
          <tspan x="356" y="472">
            STRONGER
          </tspan>
          <tspan x="356" y="489">
            TOGETHER
          </tspan>
        </text>

        {/* Connected outcome volume. */}
        <g stroke="var(--architecture-edge)" strokeLinejoin="round">
          <path d="m474 433 111-64 123 71-111 64z" fill={`url(#${topFace})`} />
          <path d="m474 433 123 71v94l-123-71z" fill={`url(#${frontFace})`} />
          <path d="m597 504 111-64v94l-111 64z" fill={`url(#${sideFace})`} />
        </g>
        <text className="architecture-label" transform="matrix(.866 .5 0 1 501 489)">
          <tspan x="0" y="0">
            CONNECTED
          </tspan>
          <tspan x="0" y="17">
            OUTCOMES
          </tspan>
        </text>
      </svg>
    </figure>
  );
}
