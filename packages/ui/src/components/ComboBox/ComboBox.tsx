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
import { ListBox } from "../ListBox";
import { ListBoxGroup, ListBoxItem } from "../ListBox/internals/types";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type ComboBoxSlot =
  | "root"
  | "label"
  | "slot"
  | "field"
  | "bracket"
  | "inputShell"
  | "input"
  | "toggle"
  | "popup"
  | "listbox"
  | "hint";

type ComboBoxChangeHandler = (
  value: string,
  item: ListBoxItem,
  group: ListBoxGroup
) => void;

type ComboBoxInputChangeHandler = (value: string) => void;

type ComboBoxOption = {
  group: ListBoxGroup;
  item: ListBoxItem;
  value: string;
};

export type ComboBoxProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> & {
  data: ListBoxGroup[];
  defaultInputValue?: string;
  defaultValue?: string;
  disabled?: boolean;
  hint?: string;
  inputValue?: string;
  label: string;
  onInputValueChange?: ComboBoxInputChangeHandler;
  onValueChange?: ComboBoxChangeHandler;
  placeholder?: string;
  slotClassNames?: SlotCustomizationProps<ComboBoxSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<ComboBoxSlot>["slotStyles"];
  value?: string;
};

function flattenComboBoxOptions(data: ListBoxGroup[]) {
  const options: ComboBoxOption[] = [];

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

function findComboBoxOption(options: ComboBoxOption[], value?: string | null) {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value) ?? null;
}

function resolveComboBoxPortalRoot() {
  return document.body;
}

export function ComboBox({
  className,
  data,
  defaultInputValue,
  defaultValue,
  disabled = false,
  hint,
  inputValue: inputValueProp,
  label,
  onInputValueChange,
  onValueChange,
  placeholder = "Type or select",
  slotClassNames,
  slotStyles,
  style,
  value,
  ...props
}: ComboBoxProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fieldRef = useRef<HTMLSpanElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const generatedId = useId();
  const fieldId = `${generatedId}-combo-box`;
  const labelId = `${fieldId}-label`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const [open, setOpen] = useState(false);
  const options = useMemo(() => flattenComboBoxOptions(data), [data]);
  const isValueControlled = value !== undefined;
  const isInputControlled = inputValueProp !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(() => defaultValue);
  const initialSelectedOption = findComboBoxOption(options, defaultValue);
  const [uncontrolledInputValue, setUncontrolledInputValue] = useState(
    () => defaultInputValue ?? initialSelectedOption?.item.name.text ?? ""
  );
  const resolvedValue = isValueControlled ? value : uncontrolledValue;
  const selectedOption = useMemo(
    () => findComboBoxOption(options, resolvedValue),
    [options, resolvedValue]
  );
  const resolvedInputValue = isInputControlled
    ? (inputValueProp ?? "")
    : uncontrolledInputValue;
  const normalizedFilter = resolvedInputValue.trim().toLowerCase();
  const filteredData = useMemo(() => {
    if (!normalizedFilter) {
      return data;
    }

    return data
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.name.text.toLowerCase().includes(normalizedFilter)
        )
      }))
      .filter((group) => group.items.length > 0);
  }, [data, normalizedFilter]);
  const filteredOptions = useMemo(
    () =>
      flattenComboBoxOptions(filteredData).filter(
        (option) => !option.item.disabled
      ),
    [filteredData]
  );
  const popupRoot =
    typeof document === "undefined" ? null : resolveComboBoxPortalRoot();
  const [themePortalStyle, setThemePortalStyle] = useState<
    ReturnType<typeof getThemePortalStyle>
  >(() => undefined);

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
    popupRef,
    portalRoot: popupRoot
  });

  function setResolvedInputValue(nextInputValue: string) {
    if (!isInputControlled) {
      setUncontrolledInputValue(nextInputValue);
    }

    onInputValueChange?.(nextInputValue);
  }

  function commitValue(
    nextValue: string,
    item: ListBoxItem,
    group: ListBoxGroup
  ) {
    if (!isValueControlled) {
      setUncontrolledValue(nextValue);
    }

    setResolvedInputValue(item.name.text);
    onValueChange?.(nextValue, item, group);
    setOpen(false);
    inputRef.current?.focus();
  }

  function handleToggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    if (!open) {
      setThemePortalStyle(getThemePortalStyle(rootRef.current));
    }

    setOpen(!open);
    inputRef.current?.focus();
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setThemePortalStyle(getThemePortalStyle(rootRef.current));
        setOpen(true);
        break;
      case "Enter":
        if (open && filteredOptions[0]) {
          event.preventDefault();
          const nextOption = filteredOptions[0];
          commitValue(nextOption.value, nextOption.item, nextOption.group);
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...props}
      className={cx("nu-combo-box", slotClassNames?.root, className)}
      ref={rootRef}
      style={mergeSlotStyle(style, slotStyles?.root)}
    >
      <label
        className={cx("nu-combo-box__label", slotClassNames?.label)}
        htmlFor={fieldId}
        id={labelId}
        style={slotStyles?.label}
      >
        {renderMnemonicText(label)}
      </label>
      <span
        className={cx("nu-combo-box__slot", slotClassNames?.slot)}
        style={slotStyles?.slot}
      >
        <span
          className={cx("nu-combo-box__field", slotClassNames?.field)}
          ref={fieldRef}
          style={slotStyles?.field}
        >
          <span
            aria-hidden="true"
            className={cx("nu-combo-box__bracket", slotClassNames?.bracket)}
            style={slotStyles?.bracket}
          >
            [
          </span>
          <span
            className={cx(
              "nu-combo-box__input-shell",
              slotClassNames?.inputShell
            )}
            style={slotStyles?.inputShell}
          >
            <input
              aria-autocomplete="list"
              aria-controls={open ? `${fieldId}-popup` : undefined}
              aria-describedby={hintId}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-labelledby={labelId}
              className={cx("nu-combo-box__input", slotClassNames?.input)}
              disabled={disabled}
              id={fieldId}
              onChange={(event) => {
                setResolvedInputValue(event.target.value);
                setThemePortalStyle(getThemePortalStyle(rootRef.current));
                setOpen(true);
              }}
              onKeyDown={handleInputKeyDown}
              placeholder={placeholder}
              ref={inputRef}
              style={slotStyles?.input}
              type="text"
              value={resolvedInputValue}
            />
          </span>
          <span
            aria-hidden="true"
            className={cx("nu-combo-box__bracket", slotClassNames?.bracket)}
            style={slotStyles?.bracket}
          >
            ]
          </span>
        </span>
        <ControlOpener
          aria-label={open ? "Collapse list" : "Expand list"}
          as="button"
          className={cx(
            "nu-control-opener",
            "nu-combo-box__toggle",
            slotClassNames?.toggle
          )}
          disabled={disabled}
          onClick={handleToggle}
          style={slotStyles?.toggle}
        />
      </span>
      {hint ? (
        <span
          className={cx("nu-combo-box__hint", slotClassNames?.hint)}
          id={hintId}
          style={slotStyles?.hint}
        >
          {hint}
        </span>
      ) : null}
      {open && popupRoot
        ? createPortal(
            <div
              className={cx("nu-combo-box__popup", slotClassNames?.popup)}
              id={`${fieldId}-popup`}
              ref={popupRef}
              style={mergeSlotStyle(
                themePortalStyle,
                slotStyles?.popup
              )}
            >
              <div
                className={cx("nu-combo-box__listbox", slotClassNames?.listbox)}
                style={slotStyles?.listbox}
              >
                <ListBox
                  data={filteredData}
                  emptyText="No matches"
                  onItemSelect={(item, group) => {
                    const nextOption = filteredOptions.find(
                      (option) => option.item === item && option.group === group
                    );

                    if (!nextOption) {
                      return;
                    }

                    commitValue(nextOption.value, item, group);
                  }}
                  selectedId={selectedOption?.value}
                  style={slotStyles?.listbox}
                />
              </div>
            </div>,
            popupRoot
          )
        : null}
    </div>
  );
}
