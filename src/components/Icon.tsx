type IconProps = {
  size?: number;
  className?: string;
};

const baseProps = {
  fill: "none" as const,
  stroke: "currentColor" as const,
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * Brand mark — the letter Ñ used as Nicolás's monogram.
 * Hand-drawn paths (not SVG <text>) so it renders identically across OS/fonts
 * at every size, including 16×16 favicons.
 */
export function IconMark({ size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 22 22"
      aria-hidden="true"
      className={className}
      fill="currentColor"
      shapeRendering="geometricPrecision"
    >
      {/* Left vertical bar of N */}
      <rect x="5" y="9" width="2.6" height="9" />
      {/* Right vertical bar of N */}
      <rect x="14.4" y="9" width="2.6" height="9" />
      {/* Diagonal of N */}
      <path d="M 5 9 L 7.6 9 L 17 18 L 14.4 18 Z" />
      {/* Tilde — single S-curve wave */}
      <path
        d="M 5.5 5.5 Q 8 3.5 11 5.5 T 16.5 5.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function IconArrowUpRight({ size = 12, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={className}
      {...baseProps}
    >
      <line x1="3" y1="9" x2="9" y2="3" />
      <polyline points="4 3 9 3 9 8" />
    </svg>
  );
}

export function IconArrowUp({ size = 12, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      className={className}
      {...baseProps}
    >
      <line x1="6" y1="9" x2="6" y2="3" />
      <polyline points="3 6 6 3 9 6" />
    </svg>
  );
}
