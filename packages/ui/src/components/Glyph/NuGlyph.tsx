import { HTMLAttributes } from "react";

export type NuGlyphName =
  | "check-fill"
  | "check-mark"
  | "dropdown-arrow"
  | "folder"
  | "gear"
  | "radio-fill"
  | "radio-ring"
  | "star"
  | "tree-caret-down"
  | "tree-caret-right"
  | "window-close"
  | "window-maximize"
  | "window-minimize"
  | "window-resize"
  | "window-restore";

export type NuGlyphProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  name: NuGlyphName;
};

function renderGlyphShape(name: NuGlyphName) {
  switch (name) {
    case "check-fill":
      return <rect fill="currentColor" height="7" width="7" x="0.5" y="0.5" />;
    case "check-mark":
      return (
        <path
          d="M1.5 4.5 L3 6 L6.5 1.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1"
        />
      );
    case "dropdown-arrow":
      return (
        <path
          d="M1.5 2.5 L4 5.5 L6.5 2.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1"
        />
      );
    case "folder":
      return (
        <path
          d="M1 2.5 H3 L4 1.5 H7 V6.5 H1 Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="miter"
          strokeWidth="1"
        />
      );
    case "gear":
      return (
        <>
          <circle
            cx="4"
            cy="4"
            fill="none"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M4 0.75 V1.75 M4 6.25 V7.25 M0.75 4 H1.75 M6.25 4 H7.25 M1.55 1.55 L2.2 2.2 M5.8 5.8 L6.45 6.45 M6.45 1.55 L5.8 2.2 M2.2 5.8 L1.55 6.45"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="1"
          />
        </>
      );
    case "radio-fill":
      return <circle cx="4" cy="4" fill="currentColor" r="2" />;
    case "radio-ring":
      return (
        <circle
          cx="4"
          cy="4"
          fill="none"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1"
        />
      );
    case "star":
      return (
        <path
          d="M4 1 L4.8 2.8 L6.9 3 L5.3 4.3 L5.8 6.5 L4 5.4 L2.2 6.5 L2.7 4.3 L1.1 3 L3.2 2.8 Z"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="miter"
          strokeWidth="1"
        />
      );
    case "tree-caret-down":
      return (
        <path
          d="M1.5 2.5 L4 5.5 L6.5 2.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1"
        />
      );
    case "tree-caret-right":
      return (
        <path
          d="M2.5 1.5 L5.5 4 L2.5 6.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1"
        />
      );
    case "window-close":
      return (
        <>
          <path
            d="M2 2 L6 6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="1"
          />
          <path
            d="M6 2 L2 6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="1"
          />
        </>
      );
    case "window-maximize":
      return (
        <rect
          fill="none"
          height="4"
          stroke="currentColor"
          strokeWidth="1"
          width="4"
          x="2"
          y="2"
        />
      );
    case "window-minimize":
      return <rect fill="currentColor" height="1" width="4" x="2" y="5" />;
    case "window-restore":
      return (
        <>
          <rect
            fill="none"
            height="3"
            stroke="currentColor"
            strokeWidth="1"
            width="3"
            x="1.5"
            y="3.5"
          />
          <rect
            fill="none"
            height="3"
            stroke="currentColor"
            strokeWidth="1"
            width="3"
            x="3.5"
            y="1.5"
          />
        </>
      );
    case "window-resize":
      return (
        <>
          <path
            d="M2.5 6.5 L6.5 2.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="1"
          />
          <path
            d="M4.5 6.5 L6.5 4.5"
            fill="none"
            stroke="currentColor"
            strokeLinecap="square"
            strokeWidth="1"
          />
        </>
      );
    default:
      return null;
  }
}

export function NuGlyph({ className, name, ...props }: NuGlyphProps) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={["nu-glyph", `nu-glyph--${name}`, className]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        className="nu-glyph__svg"
        focusable="false"
        viewBox="0 0 8 8"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderGlyphShape(name)}
      </svg>
    </span>
  );
}
