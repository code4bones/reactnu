import { CSSProperties, HTMLAttributes } from "react";

export type InfoProps = HTMLAttributes<HTMLDivElement> & {
  accentColor?: CSSProperties["color"];
  fill?: boolean;
};

export type InfoAccentProps = HTMLAttributes<HTMLSpanElement> & {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  upper?: boolean;
};

export function Info({
  accentColor,
  children,
  className,
  fill = true,
  style,
  ...props
}: InfoProps) {
  return (
    <div
      {...props}
      className={["nu-info", className].filter(Boolean).join(" ")}
      data-fill={fill || undefined}
      style={
        {
          ...style,
          "--nu-info-accent": accentColor
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function InfoAccent({
  bold = false,
  children,
  className,
  italic = false,
  style,
  underline = false,
  upper = false,
  ...props
}: InfoAccentProps) {
  return (
    <span
      {...props}
      className={["nu-info__accent", className].filter(Boolean).join(" ")}
      data-bold={bold || undefined}
      data-italic={italic || undefined}
      data-underline={underline || undefined}
      data-upper={upper || undefined}
      style={style}
    >
      {children}
    </span>
  );
}
