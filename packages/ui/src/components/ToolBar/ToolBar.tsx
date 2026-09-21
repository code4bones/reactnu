import {
  Children,
  HTMLAttributes,
  ReactNode,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import {
  CommandButton,
  CommandButtonProps
} from "../CommandButton/CommandButton";
import {
  MainMenuItem,
  MainMenuNode,
  isMainMenuItem
} from "../MainMenu/MainMenu.types";
import { Spacer } from "../Spacer";

export type ToolBarSlot = "root" | "overflowButton";

export type ToolBarProps = HTMLAttributes<HTMLDivElement> & {
  /** Static decorative or informative content before the tool controls. */
  startContent?: ReactNode;
  /** Static decorative or informative content after the tool controls. */
  endContent?: ReactNode;
  fill?: boolean;
  overflowButtonIcon?: CommandButtonProps["icon"];
  overflowButtonLabel?: ReactNode;
  slotClassNames?: SlotCustomizationProps<ToolBarSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<ToolBarSlot>["slotStyles"];
  wrap?: boolean;
};

export type ToolButtonSlot = "button" | "icon" | "label" | "caret";

export type ToolButtonProps = Omit<
  CommandButtonProps,
  | "menuItems"
  | "onMenuItemSelect"
  | "uncheckedShape"
  | "slotClassNames"
  | "slotStyles"
> & {
  slotClassNames?: SlotCustomizationProps<ToolButtonSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<ToolButtonSlot>["slotStyles"];
};

export type ToolSeparatorProps = HTMLAttributes<HTMLDivElement> &
  SlotCustomizationProps<"separator">;

export type ToolDropButtonProps = ToolButtonProps & {
  menuItems?: MainMenuNode[];
  onMenuItemSelect?: (item: MainMenuItem) => void;
  uncheckedShape?: "box" | "none";
};

function getToolOverflowText(children: ReactNode, index: number) {
  return typeof children === "string" || typeof children === "number"
    ? String(children)
    : `Tool ${index + 1}`;
}

function bindToolDropMenuItems(
  items: MainMenuNode[],
  onMenuItemSelect?: (item: MainMenuItem) => void
): MainMenuNode[] {
  return items.map((item) => {
    if (!isMainMenuItem(item)) {
      return item;
    }

    if (item.items?.length) {
      return {
        ...item,
        items: bindToolDropMenuItems(item.items, onMenuItemSelect)
      };
    }

    return {
      ...item,
      onSelect: () => {
        item.onSelect?.();
        onMenuItemSelect?.(item);
      }
    };
  });
}

export function ToolBar({
  children,
  className,
  endContent,
  fill = true,
  overflowButtonIcon,
  overflowButtonLabel,
  slotClassNames,
  slotStyles,
  startContent,
  wrap = false,
  ...props
}: ToolBarProps) {
  const toolChildren = useMemo(() => Children.toArray(children), [children]);
  const toolRefs = useRef<Record<number, HTMLSpanElement | null>>({});
  const toolViewportRef = useRef<HTMLDivElement | null>(null);
  const [overflowToolIndexes, setOverflowToolIndexes] = useState<number[]>([]);

  useEffect(() => {
    const toolViewport = toolViewportRef.current;

    if (wrap || !toolViewport) {
      setOverflowToolIndexes([]);
      return;
    }

    const toolViewportElement = toolViewport;

    function updateOverflowTools() {
      const visibleWidth = toolViewportElement.clientWidth;
      const nextOverflowToolIndexes = toolChildren
        .map((_, index) => index)
        .filter((index) => {
          const tool = toolRefs.current[index];

          return tool
            ? tool.offsetLeft -
                toolViewportElement.offsetLeft +
                tool.offsetWidth >
                visibleWidth + 1
            : false;
        });

      setOverflowToolIndexes((currentIndexes) =>
        currentIndexes.length === nextOverflowToolIndexes.length &&
        currentIndexes.every(
          (index, position) => index === nextOverflowToolIndexes[position]
        )
          ? currentIndexes
          : nextOverflowToolIndexes
      );
    }

    updateOverflowTools();
    const resizeObserver = new ResizeObserver(updateOverflowTools);
    resizeObserver.observe(toolViewportElement);
    toolChildren.forEach((_, index) => {
      const tool = toolRefs.current[index];

      if (tool) {
        resizeObserver.observe(tool);
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [toolChildren, wrap]);

  function activateOverflowTool(index: number) {
    toolRefs.current[index]
      ?.querySelector<HTMLButtonElement>("button")
      ?.click();
  }

  const overflowMenuItems = useMemo<MainMenuNode[]>(
    () =>
      overflowToolIndexes.flatMap<MainMenuNode>((index): MainMenuNode[] => {
        const child = toolChildren[index];

        if (!isValidElement(child)) {
          return [];
        }

        if (child.type === ToolDropButton) {
          const toolDropButtonProps = child.props as ToolDropButtonProps;

          if (!toolDropButtonProps.menuItems?.length) {
            return [
              {
                disabled: toolDropButtonProps.disabled,
                id: `toolbar-overflow-${index}`,
                onSelect: () => activateOverflowTool(index),
                text: getToolOverflowText(toolDropButtonProps.children, index)
              }
            ];
          }

          return [
            {
              disabled: toolDropButtonProps.disabled,
              id: `toolbar-overflow-${index}`,
              items: bindToolDropMenuItems(
                toolDropButtonProps.menuItems,
                toolDropButtonProps.onMenuItemSelect
              ),
              text: getToolOverflowText(toolDropButtonProps.children, index)
            }
          ];
        }

        if (child.type !== ToolButton) {
          return [];
        }

        const toolButtonProps = child.props as ToolButtonProps;

        return [
          {
            checkable:
              toolButtonProps.pressed !== undefined ||
              toolButtonProps.toggled !== undefined,
            checked: toolButtonProps.toggled ?? toolButtonProps.pressed,
            disabled: toolButtonProps.disabled,
            id: `toolbar-overflow-${index}`,
            onSelect: () => activateOverflowTool(index),
            text: getToolOverflowText(toolButtonProps.children, index)
          }
        ];
      }),
    [overflowToolIndexes, toolChildren]
  );
  const resolvedOverflowButtonIcon = overflowButtonIcon ?? "dropdown-arrow";
  const hasOverflowButtonLabel =
    overflowButtonLabel !== undefined && overflowButtonLabel !== null;

  return (
    <div
      {...props}
      className={cx("nu-toolbar", slotClassNames?.root, className)}
      data-fill={fill || undefined}
      data-wrap={wrap || undefined}
      role="toolbar"
      style={mergeSlotStyle(props.style, slotStyles?.root)}
    >
      {startContent !== null && startContent !== undefined ? (
        <span className="nu-toolbar__static nu-toolbar__static--start">
          {startContent}
        </span>
      ) : null}
      {wrap ? (
        children
      ) : (
        <div className="nu-toolbar__tool-viewport" ref={toolViewportRef}>
          {toolChildren.map((child, index) => (
            <span
              key={isValidElement(child) ? child.key : index}
              className="nu-toolbar__tool"
              data-spacer={
                isValidElement(child) && child.type === Spacer
                  ? true
                  : undefined
              }
              ref={(node) => {
                toolRefs.current[index] = node;
              }}
            >
              {child}
            </span>
          ))}
        </div>
      )}
      {overflowMenuItems.length > 0 ? (
        <CommandButton
          aria-label="More toolbar commands"
          className={cx(
            "nu-toolbar__button",
            "nu-toolbar__overflow-button",
            slotClassNames?.overflowButton
          )}
          icon={resolvedOverflowButtonIcon}
          menuItems={overflowMenuItems}
          style={slotStyles?.overflowButton}
        >
          {hasOverflowButtonLabel ? overflowButtonLabel : null}
        </CommandButton>
      ) : null}
      {endContent !== null && endContent !== undefined ? (
        <span className="nu-toolbar__static nu-toolbar__static--end">
          {endContent}
        </span>
      ) : null}
    </div>
  );
}

export function ToolButton({
  className,
  slotClassNames,
  slotStyles,
  ...props
}: ToolButtonProps) {
  return (
    <CommandButton
      {...props}
      className={cx("nu-toolbar__button", slotClassNames?.button, className)}
      slotClassNames={{
        caret: slotClassNames?.caret,
        icon: slotClassNames?.icon,
        label: slotClassNames?.label,
        root: slotClassNames?.button
      }}
      slotStyles={{
        caret: slotStyles?.caret,
        icon: slotStyles?.icon,
        label: slotStyles?.label,
        root: slotStyles?.button
      }}
      style={mergeSlotStyle(props.style, slotStyles?.button)}
    />
  );
}

export function ToolDropButton({
  className,
  menuItems,
  onMenuItemSelect,
  slotClassNames,
  slotStyles,
  uncheckedShape,
  ...props
}: ToolDropButtonProps) {
  return (
    <CommandButton
      {...props}
      className={cx("nu-toolbar__button", slotClassNames?.button, className)}
      dropdown
      menuItems={menuItems}
      onMenuItemSelect={onMenuItemSelect}
      slotClassNames={{
        caret: slotClassNames?.caret,
        icon: slotClassNames?.icon,
        label: slotClassNames?.label,
        root: slotClassNames?.button
      }}
      slotStyles={{
        caret: slotStyles?.caret,
        icon: slotStyles?.icon,
        label: slotStyles?.label,
        root: slotStyles?.button
      }}
      style={mergeSlotStyle(props.style, slotStyles?.button)}
      uncheckedShape={uncheckedShape}
    />
  );
}

export function ToolSeparator({ className, ...props }: ToolSeparatorProps) {
  return (
    <div
      {...props}
      aria-hidden="true"
      className={cx(
        "nu-toolbar__separator",
        props.slotClassNames?.separator,
        className
      )}
      style={mergeSlotStyle(props.style, props.slotStyles?.separator)}
    />
  );
}
