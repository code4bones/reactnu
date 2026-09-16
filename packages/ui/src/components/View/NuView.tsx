import { HTMLAttributes } from "react";

type NuViewPadding = "none" | "cell" | "sm" | "md" | "lg";
type NuViewScroll = "auto" | "x" | "y" | "both" | "hidden";

export type NuViewProps = HTMLAttributes<HTMLDivElement> & {
  fill?: boolean;
  padding?: NuViewPadding;
  scroll?: NuViewScroll;
};

export function NuView({
  children,
  className,
  fill = true,
  padding = "none",
  scroll = "auto",
  ...props
}: NuViewProps) {
  return (
    <div
      {...props}
      className={["nu-view", className].filter(Boolean).join(" ")}
      data-fill={fill || undefined}
      data-padding={padding}
      data-scroll={scroll}
    >
      {children}
    </div>
  );
}
