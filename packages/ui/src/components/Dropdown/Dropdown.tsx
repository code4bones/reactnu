import {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { ControlOpener } from "../_shared/ControlOpener";
import { getThemePortalStyle } from "../_shared/themePortal";
import { usePopupPosition } from "../_shared/usePopupPosition";
import { NuGlyph } from "../Glyph";
import { ListBox } from "../ListBox";
import { ListBoxGroup, ListBoxItem } from "../ListBox/internals/types";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type DropdownSlot =
  | "root"
  | "label"
  | "trigger"
  | "slot"
  | "field"
  | "bracket"
  | "valueShell"
  | "value"
  | "arrowShell"
  | "arrow"
  | "hint"
  | "popup"
  | "popupShell"
  | "listbox";

type DropdownChangeHandler = (
  value: string,
  item: ListBoxItem,
  group: ListBoxGroup
) => void;

export type DropdownProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  data: ListBoxGroup[];
  defaultValue?: string;
  disabled?: boolean;
  hint?: string;
  label: string;
  onValueChange?: DropdownChangeHandler;
  placeholder?: string;
  slotClassNames?: SlotCustomizationProps<DropdownSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<DropdownSlot>["slotStyles"];
  value?: string;
};

type DropdownOption = {
  group: ListBoxGroup;
  item: ListBoxItem;
  value: string;
};

function flattenDropdownOptions(data: ListBoxGroup[]) {
  const options: DropdownOption[] = [];

  data.forEach((group) => {
    group.items.forEach((item, itemIndex) => {
      options.push({
        group,
        item,
        value: item.id ?? `${group.category?.text ?? "group"}-${itemIndex}`
      });
    });
  });

  return options;
}

function getInitialValue(options: DropdownOption[], defaultValue?: string) {
  if (
    defaultValue &&
    options.some(
      (option) => option.value === defaultValue && !option.item.disabled
    )
  ) {
    return defaultValue;
  }

  const selectedOption = options.find(
    (option) => option.item.selected && !option.item.disabled
  );

  if (selectedOption) {
    return selectedOption.value;
  }

  return options.find((option) => !option.item.disabled)?.value;
}

function findSelectedOption(options: DropdownOption[], value?: string | null) {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value) ?? null;
}

export function Dropdown({
  className,
  data,
  defaultValue,
  disabled = false,
  hint,
  label,
  onValueChange,
  placeholder = "Select",
  slotClassNames,
  slotStyles,
  value,
  style,
  ...props
}: DropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const fieldRef = useRef<HTMLSpanElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupListRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [themePortalStyle, setThemePortalStyle] = useState<
    ReturnType<typeof getThemePortalStyle>
  >(() => undefined);
  const options = useMemo(() => flattenDropdownOptions(data), [data]);
  const generatedId = useId();
  const fieldId = `${generatedId}-dropdown`;
  const labelId = `${fieldId}-label`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(() => getInitialValue(options, defaultValue));
  const resolvedValue = isControlled ? value : uncontrolledValue;
  const selectedOption = useMemo(
    () => findSelectedOption(options, resolvedValue),
    [options, resolvedValue]
  );
  const selectableOptions = useMemo(
    () => options.filter((option) => !option.item.disabled),
    [options]
  );
  const displayText = selectedOption?.item.name.text ?? placeholder;

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (
        rootRef.current?.contains(target) ||
        popupRef.current?.contains(target)
      ) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  usePopupPosition({
    anchorRef: fieldRef,
    open,
    popupRef
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    popupListRef.current?.querySelector<HTMLElement>(".nu-listbox")?.focus();
  }, [open]);

  function commitValue(
    nextValue: string,
    item: ListBoxItem,
    group: ListBoxGroup
  ) {
    if (!isControlled) {
      setUncontrolledValue(nextValue);
    }

    onValueChange?.(nextValue, item, group);
    setOpen(false);
  }

  function moveSelection(direction: 1 | -1) {
    if (selectableOptions.length === 0) {
      return;
    }

    const currentIndex = selectableOptions.findIndex(
      (option) => option.value === resolvedValue
    );
    const fallbackIndex = direction > 0 ? 0 : selectableOptions.length - 1;
    const baseIndex = currentIndex === -1 ? fallbackIndex : currentIndex;
    const nextIndex =
      (baseIndex + direction + selectableOptions.length) %
      selectableOptions.length;
    const nextOption = selectableOptions[nextIndex];

    if (!nextOption) {
      return;
    }

    commitValue(nextOption.value, nextOption.item, nextOption.group);
  }

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    if (!open) {
      setThemePortalStyle(getThemePortalStyle(rootRef.current));
    }

    setOpen((currentOpen) => !currentOpen);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (open) {
          setOpen(true);
          break;
        }

        moveSelection(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (open) {
          setOpen(true);
          break;
        }

        moveSelection(-1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        setThemePortalStyle(getThemePortalStyle(rootRef.current));
        setOpen(true);
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...props}
      className={cx("nu-dropdown", slotClassNames?.root, className)}
      ref={rootRef}
      style={mergeSlotStyle(style, slotStyles?.root)}
    >
      <span
        className={cx("nu-dropdown__label", slotClassNames?.label)}
        id={labelId}
        style={slotStyles?.label}
      >
        {renderMnemonicText(label)}
      </span>
      <button
        aria-describedby={hintId}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-labelledby={labelId}
        className={cx("nu-dropdown__trigger", slotClassNames?.trigger)}
        data-open={open || undefined}
        disabled={disabled}
        id={fieldId}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        ref={(node) => {
          triggerRef.current = node;
        }}
        style={slotStyles?.trigger}
        type="button"
      >
        <span
          className={cx("nu-dropdown__slot", slotClassNames?.slot)}
          style={slotStyles?.slot}
        >
          <span
            className={cx("nu-dropdown__field", slotClassNames?.field)}
            ref={fieldRef}
            style={slotStyles?.field}
          >
            <span
              aria-hidden="true"
              className={cx("nu-dropdown__bracket", slotClassNames?.bracket)}
              style={slotStyles?.bracket}
            >
              [
            </span>
            <span
              className={cx(
                "nu-dropdown__value-shell",
                slotClassNames?.valueShell
              )}
              style={slotStyles?.valueShell}
            >
              <span
                className={cx("nu-dropdown__value", slotClassNames?.value)}
                style={slotStyles?.value}
              >
                {displayText}
              </span>
            </span>
            <span
              aria-hidden="true"
              className={cx("nu-dropdown__bracket", slotClassNames?.bracket)}
              style={slotStyles?.bracket}
            >
              ]
            </span>
          </span>
          <ControlOpener
            ariaHidden
            as="span"
            className={cx(
              "nu-control-opener",
              "nu-dropdown__arrow-shell",
              slotClassNames?.arrowShell
            )}
            style={slotStyles?.arrowShell}
          >
            <NuGlyph
              className={cx(
                "nu-control-opener__glyph",
                "nu-dropdown__arrow",
                slotClassNames?.arrow
              )}
              name="dropdown-arrow"
              style={slotStyles?.arrow}
            />
          </ControlOpener>
        </span>
      </button>
      {hint ? (
        <span
          className={cx("nu-dropdown__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className={cx("nu-dropdown__popup", slotClassNames?.popup)}
              ref={popupRef}
              style={mergeSlotStyle(
                {
                  ...themePortalStyle,
                  left: 0,
                  top: 0,
                  visibility: "hidden",
                  width: 0
                },
                slotStyles?.popup
              )}
            >
              <div
                className={cx(
                  "nu-dropdown__popup-shell",
                  slotClassNames?.popupShell
                )}
                ref={popupListRef}
                style={slotStyles?.popupShell}
              >
                <ListBox
                  className={cx(
                    "nu-dropdown__listbox",
                    slotClassNames?.listbox
                  )}
                  data={data}
                  onItemSelect={(item, group) => {
                    const option = options.find(
                      (currentOption) =>
                        currentOption.group === group &&
                        currentOption.item === item
                    );

                    if (!option) {
                      return;
                    }

                    commitValue(option.value, item, group);
                  }}
                  selectedId={resolvedValue}
                  style={slotStyles?.listbox}
                />
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
