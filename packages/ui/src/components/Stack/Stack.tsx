import { CSSProperties, HTMLAttributes } from "react";

type StackDirection = "row" | "column";
type StackGap = "sm" | "md" | "lg";
type StackAlign = "start" | "center" | "end" | "stretch";
type StackJustify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around";

export type StackProps = HTMLAttributes<HTMLDivElement> & {
  align?: StackAlign;
  direction?: StackDirection;
  gap?: StackGap;
  justify?: StackJustify;
};

function resolveFlexAlign(align?: StackAlign) {
  if (align === "start") {
    return "flex-start";
  }

  if (align === "end") {
    return "flex-end";
  }

  return align;
}

function resolveFlexJustify(justify?: StackJustify) {
  if (justify === "start") {
    return "flex-start";
  }

  if (justify === "end") {
    return "flex-end";
  }

  return justify;
}

export function Stack({
  align,
  children,
  className,
  direction = "column",
  gap = "md",
  justify,
  style,
  ...props
}: StackProps) {
  return (
    <div
      {...props}
      className={["nu-stack", className].filter(Boolean).join(" ")}
      data-align={align}
      data-direction={direction}
      data-gap={gap}
      data-justify={justify}
      style={
        {
          ...style,
          alignItems: resolveFlexAlign(align),
          justifyContent: resolveFlexJustify(justify)
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
