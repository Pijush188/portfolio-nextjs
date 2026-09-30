import type { AnchorHTMLAttributes } from "react";

/** Anchor that opens in a new tab safely. */
export function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a target="_blank" rel="noopener" {...props} />;
}
