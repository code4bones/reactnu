import { CSSProperties, MouseEvent, ReactNode, memo } from "react";
import { NuGlyph } from "../../Glyph";
import {
  TreeListCellContext,
  TreeListColumn,
  TreeListGetCellContent,
  TreeListItemBase
} from "./types";
import { getTreeListCellAlign, renderTreeListCellValue } from "./helpers";

type TreeListViewRowProps<T extends TreeListItemBase<T>> = {
  activeItemId: string | null;
  checkedIds?: string[];
  columns: TreeListColumn<T>[];
  depth: number;
  expandedIdSet: Set<string>;
  getCellContent?: TreeListGetCellContent<T>;
  guideMask: boolean[];
  guideOffsets: number[];
  hasNextSibling: boolean;
  item: T;
  onActivateItem: (item: T, itemId: string) => void;
  onDoubleClickItem?: (item: T) => void;
  onToggleItemCheck?: (item: T, checked: boolean) => void;
  onToggleItemExpanded: (item: T, expanded: boolean) => void;
  originOffset: number;
  registerItemRef: (itemId: string, node: HTMLDivElement | null) => void;
  rowIndexMap: Map<string, number>;
  selectedItemId: string | null;
  templateColumns: string;
  treeColumnId: string | null;
  treeId: string;
  uncheckedShape: "box" | "none";
};

function renderTreeTitleContent<T extends TreeListItemBase<T>>(item: T) {
  return (
    <>
      <span className="nu-tree-list-view__title">{item.title}</span>
      {item.hint ? (
        <span className="nu-tree-list-view__hint">{item.hint}</span>
      ) : null}
    </>
  );
}

function renderReportCellContent<T extends TreeListItemBase<T>>(
  item: T,
  column: TreeListColumn<T>,
  depth: number,
  rowIndex: number,
  getCellContent?: TreeListGetCellContent<T>
) {
  if (getCellContent) {
    const context: TreeListCellContext<T> = {
      depth,
      isLeaf: !item.children?.length,
      item,
      rowIndex
    };
    const resolvedContent = getCellContent(item.id, column.id, context);

    if (resolvedContent !== undefined) {
      return resolvedContent;
    }
  }

  return renderTreeListCellValue(item, column);
}

function areTreeListGuideArraysEqual(
  previousArray: number[] | boolean[],
  nextArray: number[] | boolean[]
) {
  if (previousArray.length !== nextArray.length) {
    return false;
  }

  return previousArray.every((value, index) => value === nextArray[index]);
}

function treeListItemContainsId<T extends TreeListItemBase<T>>(
  item: T,
  targetId: string | null
): boolean {
  if (!targetId) {
    return false;
  }

  if (item.id === targetId) {
    return true;
  }

  return (
    item.children?.some((child) => treeListItemContainsId(child, targetId)) ===
    true
  );
}

function TreeListViewRowInner<T extends TreeListItemBase<T>>({
  activeItemId,
  checkedIds,
  columns,
  depth,
  expandedIdSet,
  getCellContent,
  guideMask,
  guideOffsets,
  hasNextSibling,
  item,
  onActivateItem,
  onDoubleClickItem,
  onToggleItemCheck,
  onToggleItemExpanded,
  originOffset,
  registerItemRef,
  rowIndexMap,
  selectedItemId,
  templateColumns,
  treeColumnId,
  treeId,
  uncheckedShape
}: TreeListViewRowProps<T>) {
  const itemId = item.id;
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedIdSet.has(itemId);
  const isActive = itemId === activeItemId;
  const isCheckable = item.checked !== undefined || checkedIds !== undefined;
  const isChecked = checkedIds
    ? checkedIds.includes(itemId)
    : item.checked === true;
  const isSelected = itemId === selectedItemId;
  const rowIndex = rowIndexMap.get(itemId) ?? 0;
  const leadOffset = depth > 0 && hasChildren ? 1 : 0;

  function handleActivate() {
    if (item.disabled) {
      return;
    }

    onActivateItem(item, itemId);
  }

  function handleDoubleClick(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (item.disabled) {
      return;
    }

    handleActivate();

    if (hasChildren) {
      onToggleItemExpanded(item, !isExpanded);
    }

    onDoubleClickItem?.(item);
  }

  function handleToggleExpanded(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (item.disabled || !hasChildren) {
      return;
    }

    handleActivate();
    onToggleItemExpanded(item, !isExpanded);
  }

  function handleToggleChecked(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();

    if (item.disabled || !isCheckable) {
      return;
    }

    handleActivate();
    onToggleItemCheck?.(item, !isChecked);
  }

  return (
    <>
      <div
        aria-disabled={item.disabled || undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={depth + 1}
        aria-selected={isSelected || undefined}
        className={[
          "nu-tree-list-view__row",
          isActive ? "nu-tree-list-view__row--active" : null,
          isSelected ? "nu-tree-list-view__row--selected" : null,
          item.disabled ? "nu-tree-list-view__row--disabled" : null,
          item.className
        ]
          .filter(Boolean)
          .join(" ")}
        id={`${treeId}-${itemId}`}
        onClick={handleActivate}
        onDoubleClick={handleDoubleClick}
        ref={(node) => registerItemRef(itemId, node)}
        role="row"
        style={
          {
            "--nu-tree-list-view-columns": templateColumns
          } as CSSProperties
        }
      >
        {columns.map((column, columnIndex) =>
          column.id === treeColumnId ? (
            <span
              className={[
                "nu-tree-list-view__cell",
                "nu-tree-list-view__cell--tree",
                `nu-tree-list-view__cell--${getTreeListCellAlign(column, columnIndex)}`,
                column.className
              ]
                .filter(Boolean)
                .join(" ")}
              data-column-id={column.id}
              key={column.id}
              role="gridcell"
            >
              <span aria-hidden="true" className="nu-tree-list-view__prefix">
                {guideMask.map((hasGuide, guideIndex) => (
                  <span
                    className="nu-tree-list-view__guide"
                    data-visible={hasGuide || undefined}
                    key={`${itemId}-guide-${guideIndex}`}
                    style={
                      {
                        "--nu-tree-list-view-guide-offset":
                          guideOffsets[guideIndex] ?? 0
                      } as CSSProperties
                    }
                  />
                ))}
                <span
                  className="nu-tree-list-view__lead"
                  style={
                    {
                      "--nu-tree-list-view-origin-offset": originOffset
                    } as CSSProperties
                  }
                >
                  {depth > 0 ? (
                    <span
                      className="nu-tree-list-view__branch"
                      data-branch={hasNextSibling ? "tee" : "elbow"}
                    />
                  ) : null}
                  {hasChildren ? (
                    <span
                      className="nu-tree-list-view__expander"
                      data-connector={depth > 0 ? "lead" : undefined}
                    >
                      <button
                        aria-label={
                          isExpanded ? "Collapse item" : "Expand item"
                        }
                        className="nu-tree-list-view__expander-button"
                        onClick={handleToggleExpanded}
                        tabIndex={-1}
                        type="button"
                      >
                        <NuGlyph
                          name={
                            isExpanded ? "tree-caret-down" : "tree-caret-right"
                          }
                        />
                      </button>
                    </span>
                  ) : depth > 0 ? (
                    <span
                      className="nu-tree-list-view__expander-placeholder"
                      data-connector="lead"
                    />
                  ) : null}
                </span>
              </span>
              <span className="nu-tree-list-view__tree-content">
                {isCheckable ? (
                  <span className="nu-tree-list-view__check-slot">
                    <button
                      aria-label={isChecked ? "Uncheck item" : "Check item"}
                      className="nu-tree-list-view__check"
                      onClick={handleToggleChecked}
                      tabIndex={-1}
                      type="button"
                    >
                      <span
                        className="nu-tree-list-view__check-box"
                        data-unchecked-shape={uncheckedShape}
                      >
                        {isChecked ? (
                          <NuGlyph
                            className="nu-tree-list-view__check-mark"
                            name="check-mark"
                          />
                        ) : null}
                      </span>
                    </button>
                  </span>
                ) : null}
                {item.icon ? (
                  <span className="nu-tree-list-view__icon">{item.icon}</span>
                ) : null}
                {renderTreeTitleContent(item)}
              </span>
            </span>
          ) : (
            <span
              className={[
                "nu-tree-list-view__cell",
                `nu-tree-list-view__cell--${getTreeListCellAlign(column, columnIndex)}`,
                column.className
              ]
                .filter(Boolean)
                .join(" ")}
              data-column-id={column.id}
              key={column.id}
              role="gridcell"
            >
              {renderReportCellContent(
                item,
                column,
                depth,
                rowIndex,
                getCellContent
              )}
            </span>
          )
        )}
      </div>
      {hasChildren && isExpanded ? (
        <div role="rowgroup">
          {(item.children ?? []).map((child, index) => (
            <TreeListViewRow
              activeItemId={activeItemId}
              checkedIds={checkedIds}
              columns={columns}
              depth={depth + 1}
              expandedIdSet={expandedIdSet}
              getCellContent={getCellContent}
              guideMask={[...guideMask, hasNextSibling]}
              guideOffsets={[...guideOffsets, originOffset]}
              hasNextSibling={index < (item.children?.length ?? 0) - 1}
              item={child}
              key={child.id}
              onActivateItem={onActivateItem}
              onDoubleClickItem={onDoubleClickItem}
              onToggleItemCheck={onToggleItemCheck}
              onToggleItemExpanded={onToggleItemExpanded}
              originOffset={originOffset + leadOffset}
              registerItemRef={registerItemRef}
              rowIndexMap={rowIndexMap}
              selectedItemId={selectedItemId}
              templateColumns={templateColumns}
              treeColumnId={treeColumnId}
              treeId={treeId}
              uncheckedShape={uncheckedShape}
            />
          ))}
        </div>
      ) : null}
    </>
  );
}

function areTreeListViewRowPropsEqual<T extends TreeListItemBase<T>>(
  previousProps: TreeListViewRowProps<T>,
  nextProps: TreeListViewRowProps<T>
) {
  const didActivePathChange =
    previousProps.activeItemId !== nextProps.activeItemId &&
    (treeListItemContainsId(previousProps.item, previousProps.activeItemId) ||
      treeListItemContainsId(nextProps.item, nextProps.activeItemId));
  const didSelectedPathChange =
    previousProps.selectedItemId !== nextProps.selectedItemId &&
    (treeListItemContainsId(previousProps.item, previousProps.selectedItemId) ||
      treeListItemContainsId(nextProps.item, nextProps.selectedItemId));

  return (
    !didActivePathChange &&
    !didSelectedPathChange &&
    previousProps.checkedIds === nextProps.checkedIds &&
    previousProps.columns === nextProps.columns &&
    previousProps.depth === nextProps.depth &&
    previousProps.expandedIdSet === nextProps.expandedIdSet &&
    previousProps.getCellContent === nextProps.getCellContent &&
    areTreeListGuideArraysEqual(previousProps.guideMask, nextProps.guideMask) &&
    areTreeListGuideArraysEqual(
      previousProps.guideOffsets,
      nextProps.guideOffsets
    ) &&
    previousProps.hasNextSibling === nextProps.hasNextSibling &&
    previousProps.item === nextProps.item &&
    previousProps.onActivateItem === nextProps.onActivateItem &&
    previousProps.onDoubleClickItem === nextProps.onDoubleClickItem &&
    previousProps.onToggleItemCheck === nextProps.onToggleItemCheck &&
    previousProps.onToggleItemExpanded === nextProps.onToggleItemExpanded &&
    previousProps.originOffset === nextProps.originOffset &&
    previousProps.registerItemRef === nextProps.registerItemRef &&
    previousProps.rowIndexMap === nextProps.rowIndexMap &&
    previousProps.templateColumns === nextProps.templateColumns &&
    previousProps.treeColumnId === nextProps.treeColumnId &&
    previousProps.treeId === nextProps.treeId &&
    previousProps.uncheckedShape === nextProps.uncheckedShape
  );
}

export const TreeListViewRow = memo(
  TreeListViewRowInner,
  areTreeListViewRowPropsEqual
) as typeof TreeListViewRowInner;
