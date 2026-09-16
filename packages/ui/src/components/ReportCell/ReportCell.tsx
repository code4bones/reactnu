import { HTMLAttributes } from "react";

export type ReportCellProps = HTMLAttributes<HTMLSpanElement> & {
  align?: "start" | "center" | "end";
  tone?: "default" | "muted" | "accent" | "danger" | "success";
};

export function ReportCell({
  align = "start",
  className,
  tone = "default",
  ...props
}: ReportCellProps) {
  return (
    <span
      {...props}
      className={[
        "nu-report-cell",
        `nu-report-cell--${align}`,
        tone !== "default" ? `nu-report-cell--${tone}` : null,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
