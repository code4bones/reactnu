/* eslint-disable react-refresh/only-export-components -- This module intentionally exports the provider, hook, and workspace types together. */
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { useNuWindowManager } from "./windowContext";
import { useNuWindowWorkspace } from "./windowWorkspaceContext";
import {
  NuManagedWindowDefinition,
  NuWorkspaceLoadResult,
  NuWorkspaceSnapshot,
  NuWorkspaceWindowFactories,
  NuWorkspaceWindowFactory,
  NuWorkspaceWindowLoadContext,
  NuWorkspaceWindowSnapshot
} from "./windowing.types";

export type NuWorkspaceProviderProps = PropsWithChildren<{
  /** Factories available immediately when a workspace is restored. */
  factories?: NuWorkspaceWindowFactories;
}>;

export type NuWorkspaceContextValue = {
  /** Recreates the saved windows for factories currently registered with this provider. */
  loadWorkspace: (snapshot: NuWorkspaceSnapshot) => NuWorkspaceLoadResult;
  /** Registers a factory dynamically and returns an unregister callback. */
  registerWorkspaceFactory: (
    factoryKey: string,
    factory: NuWorkspaceWindowFactory
  ) => () => void;
  /** Captures opt-in managed windows without deciding where the result is stored. */
  saveWorkspace: () => NuWorkspaceSnapshot;
};

type PendingWorkspaceLoad = {
  id: string;
  meta: unknown;
  onLoadWorkspace: NonNullable<NuManagedWindowDefinition["onLoadWorkspace"]>;
  savedWindow: NuWorkspaceWindowSnapshot;
};

const NuWorkspaceContext = createContext<NuWorkspaceContextValue | null>(null);

function resolveFactory(
  factoryKey: string,
  factories: NuWorkspaceWindowFactories | undefined,
  registeredFactories: Map<string, NuWorkspaceWindowFactory>
) {
  return registeredFactories.get(factoryKey) ?? factories?.[factoryKey];
}

/**
 * Optional workspace lifecycle for managed windows. It depends on, but does
 * not modify, the normal NuWindowProvider behavior.
 */
export function NuWorkspaceProvider({
  children,
  factories
}: NuWorkspaceProviderProps) {
  const { openDialog, openWindow } = useNuWindowManager();
  const { createWorkspaceSnapshot } = useNuWindowWorkspace();
  const registeredFactoriesRef = useRef<Map<string, NuWorkspaceWindowFactory>>(
    new Map()
  );
  const pendingWorkspaceLoadsRef = useRef<PendingWorkspaceLoad[]>([]);
  const [workspaceLoadVersion, setWorkspaceLoadVersion] = useState(0);

  const registerWorkspaceFactory = useCallback(
    (factoryKey: string, factory: NuWorkspaceWindowFactory) => {
      const normalizedFactoryKey = factoryKey.trim();

      if (!normalizedFactoryKey) {
        throw new Error("A workspace factory key must not be empty.");
      }

      const registeredFactories = registeredFactoriesRef.current;
      registeredFactories.set(normalizedFactoryKey, factory);

      return () => {
        if (registeredFactories.get(normalizedFactoryKey) === factory) {
          registeredFactories.delete(normalizedFactoryKey);
        }
      };
    },
    []
  );

  const loadWorkspace = useCallback(
    (snapshot: NuWorkspaceSnapshot): NuWorkspaceLoadResult => {
      const restoredIds: string[] = [];
      const skipped: NuWorkspaceWindowSnapshot[] = [];
      const nextPendingLoads: PendingWorkspaceLoad[] = [];

      for (const savedWindow of snapshot.windows) {
        const factory = resolveFactory(
          savedWindow.factoryKey,
          factories,
          registeredFactoriesRef.current
        );

        if (!factory) {
          skipped.push(savedWindow);
          continue;
        }

        const definition = factory(savedWindow);

        if (!definition) {
          skipped.push(savedWindow);
          continue;
        }

        const existingOnOpen = definition.onOpen;
        const restoredDefinition: NuManagedWindowDefinition = {
          ...definition,
          activationGroup:
            definition.activationGroup ?? savedWindow.activationGroup,
          domain: definition.domain ?? savedWindow.domain,
          onOpen: () => {
            existingOnOpen?.();
            return savedWindow.window;
          },
          workspaceFactoryKey: savedWindow.factoryKey
        };
        const id =
          savedWindow.mode === "dialog"
            ? openDialog(restoredDefinition)
            : openWindow(restoredDefinition);

        restoredIds.push(id);

        if (definition.onLoadWorkspace) {
          nextPendingLoads.push({
            id,
            meta: savedWindow.meta,
            onLoadWorkspace: definition.onLoadWorkspace,
            savedWindow
          });
        }
      }

      if (nextPendingLoads.length > 0) {
        pendingWorkspaceLoadsRef.current.push(...nextPendingLoads);
        setWorkspaceLoadVersion((version) => version + 1);
      }

      return { restoredIds, skipped };
    },
    [factories, openDialog, openWindow]
  );

  useLayoutEffect(() => {
    const pendingWorkspaceLoads = pendingWorkspaceLoadsRef.current;

    if (pendingWorkspaceLoads.length === 0) {
      return;
    }

    pendingWorkspaceLoadsRef.current = [];

    for (const pendingLoad of pendingWorkspaceLoads) {
      const context: NuWorkspaceWindowLoadContext = {
        id: pendingLoad.id,
        savedWindow: pendingLoad.savedWindow,
        window: pendingLoad.savedWindow.window
      };

      pendingLoad.onLoadWorkspace(pendingLoad.meta, context);
    }
  }, [workspaceLoadVersion]);

  const value = useMemo<NuWorkspaceContextValue>(
    () => ({
      loadWorkspace,
      registerWorkspaceFactory,
      saveWorkspace: createWorkspaceSnapshot
    }),
    [createWorkspaceSnapshot, loadWorkspace, registerWorkspaceFactory]
  );

  return (
    <NuWorkspaceContext.Provider value={value}>
      {children}
    </NuWorkspaceContext.Provider>
  );
}

export function useNuWorkspace() {
  const context = useContext(NuWorkspaceContext);

  if (!context) {
    throw new Error(
      "useNuWorkspace must be used within a NuWorkspaceProvider."
    );
  }

  return context;
}

export type {
  NuWorkspaceLoadResult,
  NuWorkspaceSnapshot,
  NuWorkspaceWindowFactories,
  NuWorkspaceWindowFactory,
  NuWorkspaceWindowLoadContext,
  NuWorkspaceWindowSaveContext,
  NuWorkspaceWindowSnapshot
} from "./windowing.types";
