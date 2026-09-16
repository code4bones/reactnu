import {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  ReactNode
} from "react";
import { NuGlyph } from "../Glyph";
import { cx } from "./slotProps";

type ControlOpenerBaseProps = {
  children?: ReactNode;
  className?: string;
  glyphClassName?: string;
  glyphStyle?: CSSProperties;
  style?: CSSProperties;
};

type ControlOpenerSpanProps = ControlOpenerBaseProps &
  Omit<HTMLAttributes<HTMLSpanElement>, "children" | "style"> & {
    ariaHidden?: boolean;
    as?: "span";
  };

type ControlOpenerButtonProps = ControlOpenerBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "style"> & {
    as: "button";
  };

export type ControlOpenerProps =
  | ControlOpenerSpanProps
  | ControlOpenerButtonProps;

export function ControlOpener(props: ControlOpenerProps) {
  const { children, className, glyphClassName, glyphStyle, style } = props;

  if (props.as === "button") {
    const { as: _as, type = "button", ...buttonProps } = props;
    void _as;

    return (
      <button
        {...buttonProps}
        className={cx("nu-control-opener", className)}
        style={style}
        type={type}
      >
        {children ?? (
          <NuGlyph
            className={cx("nu-control-opener__glyph", glyphClassName)}
            name="dropdown-arrow"
            style={glyphStyle}
          />
        )}
      </button>
    );
  }

  const { ariaHidden = false, as: _as, ...spanProps } = props;
  void _as;

  return (
    <span
      {...spanProps}
      aria-hidden={ariaHidden}
      className={cx("nu-control-opener", className)}
      style={style}
    >
      {children ?? (
        <NuGlyph
          className={cx("nu-control-opener__glyph", glyphClassName)}
          name="dropdown-arrow"
          style={glyphStyle}
        />
      )}
    </span>
  );
}
