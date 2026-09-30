type IconProps = { strokeWidth?: number };

/** Right arrow used on pills and buttons. */
export function ArrowRight({ strokeWidth = 1.8 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpRight({ strokeWidth = 1.6 }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  );
}
