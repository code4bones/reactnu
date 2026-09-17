import {
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState
} from "react";
import { NuIconContext } from "./iconContext";
import {
  NuIconArrangeMode,
  NuIconDefinition,
  NuIconInfo,
  NuIconPosition
} from "./IconGrid.types";

const GRID_PADDING = 12;
const ICON_CELL_HEIGHT = 104;
const ICON_CELL_WIDTH = 104;

export type NuIconProviderProps = PropsWithChildren<{
  defaultIcons?: NuIconDefinition[];
}>;

type GridSize = {
  height: number;
  width: number;
};

function getDefaultPosition(index: number): NuIconPosition {
  return {
    x: GRID_PADDING + Math.floor(index / 6) * ICON_CELL_WIDTH,
    y: GRID_PADDING + (index % 6) * ICON_CELL_HEIGHT
  };
}

function getIconInfo(
  definition: NuIconDefinition,
  index: number,
  id: string
): NuIconInfo {
  return {
    ...definition,
    id,
    position: definition.position ?? getDefaultPosition(index)
  };
}

function getInitialIcons(definitions: NuIconDefinition[]) {
  const ids = new Set<string>();

  return definitions.map((definition, index) => {
    const baseId = definition.id ?? `nu-icon-${index + 1}`;
    let id = baseId;
    let duplicateIndex = 2;

    while (ids.has(id)) {
      id = `${baseId}-${duplicateIndex}`;
      duplicateIndex += 1;
    }

    ids.add(id);
    return getIconInfo(definition, index, id);
  });
}

function getArrangedPositions(
  icons: NuIconInfo[],
  mode: NuIconArrangeMode,
  gridSize: GridSize
) {
  const orderedIcons =
    mode === "name"
      ? [...icons].sort((left, right) =>
          left.label.localeCompare(right.label, undefined, {
            numeric: true,
            sensitivity: "base"
          })
        )
      : icons;
  const cellsPerLine = Math.max(
    1,
    Math.floor(
      ((mode === "rows" ? gridSize.width : gridSize.height) -
        GRID_PADDING * 2) /
        (mode === "rows" ? ICON_CELL_WIDTH : ICON_CELL_HEIGHT)
    )
  );

  return new Map(
    orderedIcons.map((icon, index) => {
      const lineIndex = index % cellsPerLine;
      const crossIndex = Math.floor(index / cellsPerLine);

      return [
        icon.id,
        mode === "rows"
          ? {
              x: GRID_PADDING + lineIndex * ICON_CELL_WIDTH,
              y: GRID_PADDING + crossIndex * ICON_CELL_HEIGHT
            }
          : {
              x: GRID_PADDING + crossIndex * ICON_CELL_WIDTH,
              y: GRID_PADDING + lineIndex * ICON_CELL_HEIGHT
            }
      ];
    })
  );
}

export function NuIconProvider({
  children,
  defaultIcons = []
}: NuIconProviderProps) {
  const idRef = useRef(defaultIcons.length);
  const gridSizeRef = useRef<GridSize>({ height: 0, width: 0 });
  const [icons, setIcons] = useState<NuIconInfo[]>(() =>
    getInitialIcons(defaultIcons)
  );
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  const addIcon = useCallback((definition: NuIconDefinition) => {
    const id = definition.id ?? `nu-icon-${++idRef.current}`;

    setIcons((currentIcons) => {
      if (currentIcons.some((icon) => icon.id === id)) {
        throw new Error(`An icon with id "${id}" already exists.`);
      }

      return [
        ...currentIcons,
        getIconInfo(definition, currentIcons.length, id)
      ];
    });

    return id;
  }, []);

  const moveIcon = useCallback((id: string, position: NuIconPosition) => {
    setIcons((currentIcons) =>
      currentIcons.map((icon) =>
        icon.id === id ? { ...icon, position } : icon
      )
    );
  }, []);

  const removeIcon = useCallback((id: string) => {
    setIcons((currentIcons) => currentIcons.filter((icon) => icon.id !== id));
    setSelectedIconId((currentId) => (currentId === id ? null : currentId));
  }, []);

  const updateIcon = useCallback(
    (id: string, patch: Partial<Omit<NuIconDefinition, "id">>) => {
      setIcons((currentIcons) =>
        currentIcons.map((icon) =>
          icon.id === id
            ? {
                ...icon,
                ...patch,
                position: patch.position ?? icon.position
              }
            : icon
        )
      );
    },
    []
  );

  const arrangeIcons = useCallback((mode: NuIconArrangeMode = "columns") => {
    setIcons((currentIcons) => {
      const positions = getArrangedPositions(
        currentIcons,
        mode,
        gridSizeRef.current
      );

      return currentIcons.map((icon) => ({
        ...icon,
        position: positions.get(icon.id) ?? icon.position
      }));
    });
  }, []);

  const setGridSize = useCallback((size: GridSize) => {
    gridSizeRef.current = size;
  }, []);

  const contextValue = useMemo(
    () => ({
      addIcon,
      arrangeIcons,
      icons,
      moveIcon,
      removeIcon,
      selectedIconId,
      selectIcon: setSelectedIconId,
      setGridSize,
      updateIcon
    }),
    [
      addIcon,
      arrangeIcons,
      icons,
      moveIcon,
      removeIcon,
      selectedIconId,
      setGridSize,
      updateIcon
    ]
  );

  return (
    <NuIconContext.Provider value={contextValue}>
      {children}
    </NuIconContext.Provider>
  );
}
