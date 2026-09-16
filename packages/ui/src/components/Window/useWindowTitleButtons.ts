import { WindowTitleButtonDefinition } from "./WindowTitleButton";

export type UseWindowTitleButtonsOptions = {
  closeable?: boolean;
  maximizable?: boolean;
  maximized?: boolean;
  minimizable?: boolean;
  minimized?: boolean;
  onClose?: () => void;
  onToggleMaximized?: () => void;
  onToggleMinimized?: () => void;
};

export function useWindowTitleButtons({
  closeable = true,
  maximizable = false,
  maximized = false,
  minimizable = false,
  minimized = false,
  onClose,
  onToggleMaximized,
  onToggleMinimized
}: UseWindowTitleButtonsOptions): WindowTitleButtonDefinition[] {
  return [
    ...(minimizable
      ? [
          {
            ariaLabel: minimized ? "Restore window" : "Minimize window",
            icon: "minimize" as const,
            key: "system-minimize",
            onClick: onToggleMinimized
          }
        ]
      : []),
    ...(maximizable
      ? [
          {
            ariaLabel: maximized ? "Restore window" : "Maximize window",
            icon: maximized ? ("restore" as const) : ("maximize" as const),
            key: "system-maximize",
            onClick: onToggleMaximized
          }
        ]
      : []),
    ...(closeable
      ? [
          {
            ariaLabel: "Close window",
            icon: "close" as const,
            key: "system-close",
            onClick: onClose,
            variant: "close" as const
          }
        ]
      : [])
  ];
}
