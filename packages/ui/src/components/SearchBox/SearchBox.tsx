import {
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import { createPortal } from "react-dom";
import { getThemePortalStyle } from "../_shared/themePortal";
import { usePopupPosition } from "../_shared/usePopupPosition";
import { ListBox } from "../ListBox";
import { ListBoxGroup, ListBoxItem } from "../ListBox/internals/types";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

type SearchBoxStatus = "idle" | "loading" | "success" | "error";

export type SearchBoxProps<T> = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> & {
  dataProvider: (query: string) => Promise<T[]>;
  debounceMs?: number;
  defaultQuery?: string;
  disabled?: boolean;
  emptyText?: string;
  errorText?: string;
  getItemDetails?: (item: T) => ReactNode;
  getItemDisabled?: (item: T) => boolean;
  getItemId: (item: T, index: number) => string;
  getItemText: (item: T) => string;
  hint?: string;
  idleText?: string;
  label: string;
  loadingText?: string;
  minQueryLength?: number;
  onItemSelect?: (item: T) => void;
  onQueryChange?: (query: string) => void;
  placeholder?: string;
  query?: string;
};

type SearchBoxResultOption<T> = {
  item: T;
  listBoxItem: ListBoxItem;
  value: string;
};

function resolveSearchBoxPortalRoot() {
  return document.body;
}

export function SearchBox<T>({
  className,
  dataProvider,
  debounceMs = 250,
  defaultQuery = "",
  disabled = false,
  emptyText = "No matches",
  errorText = "Search failed",
  getItemDetails,
  getItemDisabled,
  getItemId,
  getItemText,
  hint,
  idleText = "Type to search",
  label,
  loadingText = "Searching...",
  minQueryLength = 1,
  onItemSelect,
  onQueryChange,
  placeholder = "Search",
  query: queryProp,
  style,
  ...props
}: SearchBoxProps<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const fieldRef = useRef<HTMLSpanElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const generatedId = useId();
  const fieldId = `${generatedId}-search-box`;
  const labelId = `${fieldId}-label`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const isQueryControlled = queryProp !== undefined;
  const [uncontrolledQuery, setUncontrolledQuery] = useState(defaultQuery);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<SearchBoxStatus>("idle");
  const [results, setResults] = useState<T[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const normalizedQuery =
    (isQueryControlled ? queryProp : uncontrolledQuery) ?? "";
  const trimmedQuery = normalizedQuery.trim();
  const resultOptions = useMemo<SearchBoxResultOption<T>[]>(() => {
    return results.map((item, index) => ({
      item,
      listBoxItem: {
        details: getItemDetails?.(item),
        disabled: getItemDisabled?.(item),
        id: getItemId(item, index),
        name: {
          text: getItemText(item)
        }
      },
      value: getItemId(item, index)
    }));
  }, [getItemDetails, getItemDisabled, getItemId, getItemText, results]);
  const listBoxData = useMemo<ListBoxGroup[]>(
    () => [
      {
        category: null,
        items: resultOptions.map((option) => option.listBoxItem)
      }
    ],
    [resultOptions]
  );
  const popupRoot =
    typeof document === "undefined" ? null : resolveSearchBoxPortalRoot();
  const [themePortalStyle, setThemePortalStyle] = useState<
    ReturnType<typeof getThemePortalStyle>
  >(() => undefined);

  useEffect(() => {
    if (disabled) {
      return;
    }

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
  }, [disabled, open]);

  usePopupPosition({
    anchorRef: fieldRef,
    open,
    popupRef,
    portalRoot: popupRoot
  });

  useEffect(() => {
    if (disabled || !open) {
      return;
    }

    if (trimmedQuery.length < minQueryLength) {
      return;
    }

    const nextRequestId = requestIdRef.current + 1;
    requestIdRef.current = nextRequestId;

    const timeoutId = window.setTimeout(() => {
      setStatus("loading");

      dataProvider(trimmedQuery)
        .then((nextResults) => {
          if (requestIdRef.current !== nextRequestId) {
            return;
          }

          setResults(nextResults);
          setStatus("success");
        })
        .catch(() => {
          if (requestIdRef.current !== nextRequestId) {
            return;
          }

          setResults([]);
          setStatus("error");
        });
    }, debounceMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [dataProvider, debounceMs, disabled, minQueryLength, open, trimmedQuery]);

  function setResolvedQuery(nextQuery: string) {
    if (!isQueryControlled) {
      setUncontrolledQuery(nextQuery);
    }

    onQueryChange?.(nextQuery);
  }

  function openPopup() {
    setThemePortalStyle(getThemePortalStyle(rootRef.current));
    setOpen(true);
  }

  function handleSelectItem(option: SearchBoxResultOption<T>) {
    setResolvedQuery(getItemText(option.item));
    setSelectedValue(option.value);
    setOpen(false);
    onItemSelect?.(option.item);
    inputRef.current?.focus();
  }

  function renderPopupContent() {
    if (status === "loading") {
      return <div className="nu-search-box__status">{loadingText}</div>;
    }

    if (status === "error") {
      return <div className="nu-search-box__status">{errorText}</div>;
    }

    if (trimmedQuery.length < minQueryLength) {
      return <div className="nu-search-box__status">{idleText}</div>;
    }

    return (
      <div className="nu-search-box__listbox">
        <ListBox
          data={listBoxData}
          emptyText={emptyText}
          onItemSelect={(item) => {
            const nextOption = resultOptions.find(
              (option) => option.listBoxItem === item
            );

            if (!nextOption) {
              return;
            }

            handleSelectItem(nextOption);
          }}
          selectedId={selectedValue ?? undefined}
        />
      </div>
    );
  }

  function handleInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        openPopup();
        break;
      case "Enter":
        if (open && status === "success" && resultOptions[0]) {
          event.preventDefault();
          handleSelectItem(resultOptions[0]);
        }
        break;
      default:
        break;
    }
  }

  return (
    <div
      {...props}
      className={["nu-search-box", className].filter(Boolean).join(" ")}
      ref={rootRef}
      style={style}
    >
      <label className="nu-search-box__label" htmlFor={fieldId} id={labelId}>
        {renderMnemonicText(label)}
      </label>
      <span className="nu-search-box__slot" ref={fieldRef}>
        <span aria-hidden="true" className="nu-search-box__bracket">
          [
        </span>
        <span className="nu-search-box__input-shell">
          <input
            aria-autocomplete="list"
            aria-controls={open ? `${fieldId}-popup` : undefined}
            aria-describedby={hintId}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-labelledby={labelId}
            className="nu-search-box__input"
            disabled={disabled}
            id={fieldId}
            onChange={(event) => {
              setResolvedQuery(event.target.value);
              openPopup();
              setSelectedValue(null);
            }}
            onFocus={openPopup}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
            ref={inputRef}
            type="text"
            value={normalizedQuery}
          />
        </span>
        <span aria-hidden="true" className="nu-search-box__bracket">
          ]
        </span>
      </span>
      {hint ? (
        <span className="nu-search-box__hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {open && popupRoot
        ? createPortal(
            <div
              className="nu-search-box__popup"
              id={`${fieldId}-popup`}
              ref={popupRef}
              style={themePortalStyle}
            >
              {renderPopupContent()}
            </div>,
            popupRoot
          )
        : null}
    </div>
  );
}
