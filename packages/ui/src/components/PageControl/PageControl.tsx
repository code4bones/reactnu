import {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useId,
  useMemo,
  useRef,
  useState
} from "react";
import {
  SlotCustomizationProps,
  cx,
  mergeSlotStyle
} from "../_shared/slotProps";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type PageControlSlot = "root" | "tabs" | "tab" | "panel";

export type PageControlPage = {
  content: ReactNode;
  disabled?: boolean;
  id: string;
  label: string;
};

export type PageControlProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange"
> & {
  activePageId?: string;
  defaultActivePageId?: string;
  fill?: boolean;
  onActivePageChange?: (page: PageControlPage) => void;
  pages: PageControlPage[];
  slotClassNames?: SlotCustomizationProps<PageControlSlot>["slotClassNames"];
  slotStyles?: SlotCustomizationProps<PageControlSlot>["slotStyles"];
};

export function PageControl({
  activePageId: activePageIdProp,
  className,
  defaultActivePageId,
  fill = true,
  onActivePageChange,
  pages,
  slotClassNames,
  slotStyles,
  ...props
}: PageControlProps) {
  const generatedId = useId();
  const isControlled = activePageIdProp !== undefined;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [uncontrolledActivePageId, setUncontrolledActivePageId] = useState<
    string | undefined
  >(
    () =>
      defaultActivePageId ??
      pages.find((page) => !page.disabled)?.id ??
      pages[0]?.id
  );
  const activePageId = isControlled
    ? activePageIdProp
    : uncontrolledActivePageId;
  const resolvedActivePage = useMemo(() => {
    const byId = pages.find(
      (page) => page.id === activePageId && !page.disabled
    );

    if (byId) {
      return byId;
    }

    return pages.find((page) => !page.disabled) ?? pages[0] ?? null;
  }, [activePageId, pages]);

  function updateActivePage(nextPage: PageControlPage) {
    if (nextPage.disabled) {
      return;
    }

    if (!isControlled) {
      setUncontrolledActivePageId(nextPage.id);
    }

    onActivePageChange?.(nextPage);
  }

  function focusPage(pageId: string) {
    tabRefs.current[pageId]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const selectablePages = pages.filter((page) => !page.disabled);

    if (selectablePages.length === 0) {
      return;
    }

    const currentIndex = selectablePages.findIndex(
      (page) => page.id === resolvedActivePage?.id
    );

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const nextIndex =
          currentIndex <= 0 ? selectablePages.length - 1 : currentIndex - 1;
        const nextPage = selectablePages[nextIndex];
        updateActivePage(nextPage);
        focusPage(nextPage.id);
        break;
      }
      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex =
          currentIndex === -1 || currentIndex >= selectablePages.length - 1
            ? 0
            : currentIndex + 1;
        const nextPage = selectablePages[nextIndex];
        updateActivePage(nextPage);
        focusPage(nextPage.id);
        break;
      }
      case "Home": {
        event.preventDefault();
        const nextPage = selectablePages[0];
        updateActivePage(nextPage);
        focusPage(nextPage.id);
        break;
      }
      case "End": {
        event.preventDefault();
        const nextPage = selectablePages[selectablePages.length - 1];
        updateActivePage(nextPage);
        focusPage(nextPage.id);
        break;
      }
      default:
        break;
    }
  }

  return (
    <div
      {...props}
      className={cx("nu-page-control", slotClassNames?.root, className)}
      data-fill={fill || undefined}
      style={mergeSlotStyle(
        props.style as CSSProperties | undefined,
        slotStyles?.root
      )}
    >
      <div
        className={cx("nu-page-control__tabs", slotClassNames?.tabs)}
        onKeyDown={handleKeyDown}
        role="tablist"
        style={slotStyles?.tabs}
      >
        {pages.map((page) => {
          const isActive = page.id === resolvedActivePage?.id;
          const panelId = `${generatedId}-panel-${page.id}`;
          const tabId = `${generatedId}-tab-${page.id}`;

          return (
            <button
              key={page.id}
              aria-controls={panelId}
              aria-selected={isActive}
              className={cx("nu-page-control__tab", slotClassNames?.tab)}
              data-active={isActive || undefined}
              disabled={page.disabled}
              id={tabId}
              onClick={() => updateActivePage(page)}
              ref={(node) => {
                tabRefs.current[page.id] = node;
              }}
              role="tab"
              style={slotStyles?.tab}
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {renderMnemonicText(page.label)}
            </button>
          );
        })}
      </div>
      <div
        aria-labelledby={
          resolvedActivePage
            ? `${generatedId}-tab-${resolvedActivePage.id}`
            : undefined
        }
        className={cx("nu-page-control__panel", slotClassNames?.panel)}
        id={
          resolvedActivePage
            ? `${generatedId}-panel-${resolvedActivePage.id}`
            : undefined
        }
        role="tabpanel"
        style={slotStyles?.panel}
      >
        {resolvedActivePage?.content ?? null}
      </div>
    </div>
  );
}

export { PageControl as Tabs };
