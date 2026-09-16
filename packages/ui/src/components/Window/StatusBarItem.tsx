import { HTMLAttributes, ReactNode } from "react";

export type StatusBarItemProps = HTMLAttributes<HTMLSpanElement> & {
  align?: "start" | "center" | "end";
  children: ReactNode;
  grow?: boolean;
};

export function StatusBarItem({
  align = "start",
  children,
  className,
  grow = false,
  ...props
}: StatusBarItemProps) {
  return (
    <span
      {...props}
      className={[
        "nu-window__status-bar-item",
        `nu-window__status-bar-item--${align}`,
        grow ? "nu-window__status-bar-item--grow" : null,
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
