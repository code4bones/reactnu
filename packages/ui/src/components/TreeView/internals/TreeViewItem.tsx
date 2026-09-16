import { CSSProperties, MouseEvent, memo } from "react";
import { NuGlyph } from "../../Glyph";
import { TreeItem } from "./types";

type TreeViewItemProps = {
  depth: number;
  expandedIdSet: Set<string>;
  guideMask: boolean[];
  guideOffsets: number[];
  hasNextSibling: boolean;
  originOffset: number;
  onActivateItem: (item: TreeItem, itemId: string) => void;
  onDoubleClickItem?: (item: TreeItem) => void;
  onToggleItemCheck?: (item: TreeItem, checked: boolean) => void;
  onToggleItemExpanded: (item: TreeItem, expanded: boolean) => void;
  registerItemRef: (itemId: string, node: HTMLDivElement | null) => void;
  resolvedSelectedId: string | null;
  treeId: string;
  item: TreeItem;
  uncheckedShape: "box" | "none";
};

function areTreeViewGuideArraysEqual(
  previousArray: number[] | boolean[],
  nextArray: number[] | boolean[]
) {
  if (previousArray.length !== nextArray.length) {
    return false;
  }

  return previousArray.every((value, index) => value === nextArray[index]);
}

function treeViewItemContainsId(
  item: TreeItem,
  targetId: string | null
): boolean {
  if (!targetId) {
    return false;
  }

  if (item.id === targetId) {
    return true;
  }

  return (
    item.children?.some((child) => treeViewItemContainsId(child, targetId)) ===
    true
  );
}

function TreeViewItemInner({
  depth,
  expandedIdSet,
  guideMask,
  guideOffsets,
  hasNextSibling,
  item,
  originOffset,
  onActivateItem,
  onDoubleClickItem,
  onToggleItemCheck,
  onToggleItemExpanded,
  registerItemRef,
  resolvedSelectedId,
  treeId,
  uncheckedShape
}: TreeViewItemProps) {
  const itemId = item.id;
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedIdSet.has(itemId);
  const isCheckable = item.checked !== undefined;
  const isChecked = item.checked === true;
  const isSelected = itemId === resolvedSelectedId;
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
    <div className="nu-tree-view__row" role="none">
      <div
        aria-checked={isCheckable ? isChecked : undefined}
        aria-disabled={item.disabled || undefined}
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-level={depth + 1}
        aria-selected={isSelected}
        className={[
          "nu-tree-view__item",
          isSelected ? "nu-tree-view__item--selected" : null,
          item.disabled ? "nu-tree-view__item--disabled" : null
        ]
          .filter(Boolean)
          .join(" ")}
        id={`${treeId}-${itemId}`}
        onClick={handleActivate}
        onDoubleClick={handleDoubleClick}
        ref={(node) => registerItemRef(itemId, node)}
        role="treeitem"
      >
        <span aria-hidden="true" className="nu-tree-view__prefix">
          {guideMask.map((hasGuide, guideIndex) => (
            <span
              className="nu-tree-view__guide"
              data-visible={hasGuide || undefined}
              key={`${itemId}-guide-${guideIndex}`}
              style={
                {
                  "--nu-tree-view-guide-offset": guideOffsets[guideIndex] ?? 0
                } as CSSProperties
              }
            />
          ))}
          <span
            className="nu-tree-view__lead"
            style={
              {
                "--nu-tree-view-origin-offset": originOffset
              } as CSSProperties
            }
          >
            {depth > 0 ? (
              <span
                className="nu-tree-view__branch"
                data-branch={hasNextSibling ? "tee" : "elbow"}
              />
            ) : null}
            {hasChildren ? (
              <span
                className="nu-tree-view__expander"
                data-connector={depth > 0 ? "lead" : undefined}
              >
                <button
                  aria-label={isExpanded ? "Collapse item" : "Expand item"}
                  className="nu-tree-view__expander-button"
                  onClick={handleToggleExpanded}
                  tabIndex={-1}
                  type="button"
                >
                  <NuGlyph
                    name={isExpanded ? "tree-caret-down" : "tree-caret-right"}
                  />
                </button>
              </span>
            ) : depth > 0 ? (
              <span
                className="nu-tree-view__expander-placeholder"
                data-connector="lead"
              />
            ) : null}
          </span>
        </span>
        <span className="nu-tree-view__content">
          {isCheckable ? (
            <span className="nu-tree-view__check-slot">
              <button
                aria-label={isChecked ? "Uncheck item" : "Check item"}
                className="nu-tree-view__check"
                onClick={handleToggleChecked}
                tabIndex={-1}
                type="button"
              >
                <span
                  className="nu-tree-view__check-box"
                  data-unchecked-shape={uncheckedShape}
                >
                  {isChecked ? (
                    <NuGlyph
                      className="nu-tree-view__check-mark"
                      name="check-mark"
                    />
                  ) : null}
                </span>
              </button>
            </span>
          ) : null}
          {item.icon ? (
            <span className="nu-tree-view__icon">{item.icon}</span>
          ) : null}
          <span className="nu-tree-view__title">{item.title}</span>
          {item.hint ? (
            <span className="nu-tree-view__hint">{item.hint}</span>
          ) : null}
        </span>
      </div>
      {hasChildren && isExpanded ? (
        <div role="group">
          {(item.children ?? []).map((child, index) => (
            <TreeViewItem
              depth={depth + 1}
              expandedIdSet={expandedIdSet}
              guideMask={[...guideMask, hasNextSibling]}
              guideOffsets={[...guideOffsets, originOffset]}
              hasNextSibling={index < (item.children?.length ?? 0) - 1}
              item={child}
              key={child.id}
              originOffset={originOffset + leadOffset}
              onActivateItem={onActivateItem}
              onDoubleClickItem={onDoubleClickItem}
              onToggleItemCheck={onToggleItemCheck}
              onToggleItemExpanded={onToggleItemExpanded}
              registerItemRef={registerItemRef}
              resolvedSelectedId={resolvedSelectedId}
              treeId={treeId}
              uncheckedShape={uncheckedShape}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function areTreeViewItemPropsEqual(
  previousProps: TreeViewItemProps,
  nextProps: TreeViewItemProps
) {
  const didSelectedPathChange =
    previousProps.resolvedSelectedId !== nextProps.resolvedSelectedId &&
    (treeViewItemContainsId(
      previousProps.item,
      previousProps.resolvedSelectedId
    ) ||
      treeViewItemContainsId(nextProps.item, nextProps.resolvedSelectedId));

  return (
    !didSelectedPathChange &&
    previousProps.depth === nextProps.depth &&
    previousProps.expandedIdSet === nextProps.expandedIdSet &&
    areTreeViewGuideArraysEqual(previousProps.guideMask, nextProps.guideMask) &&
    areTreeViewGuideArraysEqual(
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
    previousProps.treeId === nextProps.treeId &&
    previousProps.uncheckedShape === nextProps.uncheckedShape
  );
}

export const TreeViewItem = memo(TreeViewItemInner, areTreeViewItemPropsEqual);
