import { Children, PointerEventHandler, PropsWithChildren } from "react";
import { NuGlyph } from "../../Glyph";
import { StatusBarItem } from "../StatusBarItem";

type WindowStatusBarProps = PropsWithChildren<{
  onResizeStart?: PointerEventHandler<HTMLButtonElement>;
  resizable?: boolean;
  statusBarClassName?: string;
}>;

export function WindowStatusBar({
  children,
  onResizeStart,
  resizable = false,
  statusBarClassName
}: WindowStatusBarProps) {
  const resolvedChildren = Children.toArray(children);
  const hasCustomItems = resolvedChildren.some(
    (child) => typeof child !== "string" && typeof child !== "number"
  );

  return (
    <footer
      className={["nu-window__status-bar", statusBarClassName]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="nu-window__status-bar-items">
        {hasCustomItems
          ? resolvedChildren
          : resolvedChildren.map((child, index) => (
              <StatusBarItem grow={index === 0} key={`status-item-${index}`}>
                {child}
              </StatusBarItem>
            ))}
      </span>
      {resizable ? (
        <button
          aria-label="Resize window"
          className="nu-window__resize-handle"
          onPointerDown={onResizeStart}
          type="button"
        >
          <NuGlyph name="window-resize" />
        </button>
      ) : null}
    </footer>
  );
}
