import {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  useEffect,
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
import { CommandButton } from "../CommandButton";
import { type NuGlyphName } from "../Glyph";
import { renderMnemonicText } from "../../utils/renderMnemonicText";

export type PageControlSlot =
  | "root"
  | "tabs"
  | "tab"
  | "overflowButton"
  | "panel";

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
  overflowButtonIcon?: NuGlyphName | ReactNode;
  overflowButtonLabel?: ReactNode;
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
  overflowButtonIcon,
  overflowButtonLabel,
  pages,
  slotClassNames,
  slotStyles,
  ...props
}: PageControlProps) {
  const generatedId = useId();
  const isControlled = activePageIdProp !== undefined;
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const tabScrollerRef = useRef<HTMLDivElement | null>(null);
  const [overflowPageIds, setOverflowPageIds] = useState<string[]>([]);
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

  useEffect(() => {
    const tabScroller = tabScrollerRef.current;

    if (!tabScroller) {
      return;
    }

    const tabScrollerElement = tabScroller;

    function updateOverflowPages() {
      const visibleWidth = tabScrollerElement.clientWidth;
      const nextOverflowPageIds = pages
        .filter((page) => {
          const tab = tabRefs.current[page.id];

          return tab
            ? tab.offsetLeft - tabScrollerElement.offsetLeft + tab.offsetWidth >
                visibleWidth + 1
            : false;
        })
        .map((page) => page.id);

      setOverflowPageIds((currentPageIds) =>
        currentPageIds.length === nextOverflowPageIds.length &&
        currentPageIds.every(
          (pageId, index) => pageId === nextOverflowPageIds[index]
        )
          ? currentPageIds
          : nextOverflowPageIds
      );
    }

    updateOverflowPages();
    const resizeObserver = new ResizeObserver(updateOverflowPages);
    resizeObserver.observe(tabScrollerElement);
    pages.forEach((page) => {
      const tab = tabRefs.current[page.id];

      if (tab) {
        resizeObserver.observe(tab);
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [pages]);

  const overflowPages = useMemo(
    () => pages.filter((page) => overflowPageIds.includes(page.id)),
    [overflowPageIds, pages]
  );
  const resolvedOverflowButtonIcon = overflowButtonIcon ?? "dropdown-arrow";
  const hasOverflowButtonLabel =
    overflowButtonLabel !== undefined && overflowButtonLabel !== null;

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
        style={slotStyles?.tabs}
      >
        <div
          className="nu-page-control__tab-scroller"
          onKeyDown={handleKeyDown}
          ref={tabScrollerRef}
          role="tablist"
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
        {overflowPages.length > 0 ? (
          <CommandButton
            className={cx(
              "nu-page-control__overflow-button",
              slotClassNames?.overflowButton
            )}
            icon={resolvedOverflowButtonIcon}
            menuItems={overflowPages.map((page) => ({
              checked: page.id === resolvedActivePage?.id,
              checkable: true,
              disabled: page.disabled,
              id: page.id,
              text: page.label
            }))}
            onMenuItemSelect={(item) => {
              const page = pages.find((candidate) => candidate.id === item.id);

              if (page) {
                updateActivePage(page);
              }
            }}
            style={slotStyles?.overflowButton}
          >
            {hasOverflowButtonLabel ? overflowButtonLabel : null}
          </CommandButton>
        ) : null}
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
