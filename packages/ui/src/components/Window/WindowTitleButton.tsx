import { ButtonHTMLAttributes, ReactNode } from "react";
import { NuGlyph, NuGlyphName } from "../Glyph";

export type WindowTitleButtonIcon =
  | "close"
  | "maximize"
  | "minimize"
  | "restore"
  | ReactNode;

export type WindowTitleButtonVariant = "default" | "close";

export type WindowTitleButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  ariaLabel?: string;
  icon: WindowTitleButtonIcon;
  variant?: WindowTitleButtonVariant;
};

export type WindowTitleButtonDefinition = {
  ariaLabel?: string;
  className?: string;
  icon: WindowTitleButtonIcon;
  key?: string;
  onClick?: () => void;
  variant?: WindowTitleButtonVariant;
};

function renderWindowTriangleGlyph(icon: "minimize" | "maximize" | "restore") {
  const glyphNameByIcon: Record<
    "minimize" | "maximize" | "restore",
    NuGlyphName
  > = {
    maximize: "window-maximize",
    minimize: "window-minimize",
    restore: "window-restore"
  };

  return (
    <NuGlyph className="nu-window__title-glyph" name={glyphNameByIcon[icon]} />
  );
}

function renderTitleButtonIcon(icon: WindowTitleButtonIcon) {
  if (icon === "close") {
    return <NuGlyph className="nu-window__title-glyph" name="window-close" />;
  }

  if (icon === "minimize" || icon === "maximize" || icon === "restore") {
    return renderWindowTriangleGlyph(
      icon as "minimize" | "maximize" | "restore"
    );
  }

  return icon;
}

export function WindowTitleButton({
  ariaLabel,
  className,
  icon,
  onClick,
  onPointerDown,
  type = "button",
  variant = icon === "close" ? "close" : "default",
  ...props
}: WindowTitleButtonProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      className={[
        "nu-window__title-button",
        variant === "close" ? "nu-window__title-button--close" : null,
        className
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onPointerDown={(event) => {
        event.stopPropagation();
        onPointerDown?.(event);
      }}
      type={type}
    >
      {renderTitleButtonIcon(icon)}
    </button>
  );
}
