import { CSSProperties, PointerEventHandler } from "react";
import {
  WindowTitleButton,
  WindowTitleButtonDefinition
} from "../WindowTitleButton";
import { renderMnemonicText } from "../../../utils/renderMnemonicText";

type WindowTitleBarProps = {
  draggable: boolean;
  onDragStart?: PointerEventHandler<HTMLElement>;
  titleButtons: WindowTitleButtonDefinition[];
  title: string;
};

export function WindowTitleBar({
  draggable,
  onDragStart,
  titleButtons,
  title
}: WindowTitleBarProps) {
  const controlsWidth =
    titleButtons.length > 0
      ? `calc(${titleButtons.length} * 0.95rem + ${
          Math.max(0, titleButtons.length - 1) * 0.35
        }rem + 0.7rem)`
      : "0.45rem";

  return (
    <header
      className="nu-window__title-bar"
      data-draggable={draggable || undefined}
      onPointerDown={onDragStart}
      style={
        {
          "--nu-window-title-controls-width": controlsWidth
        } as CSSProperties
      }
    >
      <span className="nu-window__title">{renderMnemonicText(title)}</span>
      {titleButtons.length > 0 ? (
        <span className="nu-window__title-controls">
          {titleButtons.map((button, index) => (
            <WindowTitleButton
              ariaLabel={button.ariaLabel}
              className={button.className}
              icon={button.icon}
              key={button.key ?? `${String(button.icon)}-${index}`}
              onClick={button.onClick}
              variant={button.variant}
            />
          ))}
        </span>
      ) : null}
    </header>
  );
}
