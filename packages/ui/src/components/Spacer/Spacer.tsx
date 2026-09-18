import { HTMLAttributes } from "react";

export type SpacerProps = Omit<HTMLAttributes<HTMLSpanElement>, "children">;

/**
 * Flexible, decorative space for a horizontal or vertical flex layout.
 * Place it before controls that should move to the opposite edge.
 */
export function Spacer({ className, ...props }: SpacerProps) {
  return (
    <span
      {...props}
      aria-hidden={props["aria-hidden"] ?? true}
      className={["nu-spacer", className].filter(Boolean).join(" ")}
    />
  );
}
