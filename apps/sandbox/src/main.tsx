/* eslint-disable react-refresh/only-export-components -- Vite entry point owns the non-exported Sandbox root. */
import React, { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "@deadragdoll/reactnu/styles.css";
import {
  NuDesktop,
  NuDragDropProvider,
  NuIconGrid,
  NuIconProvider
} from "@deadragdoll/reactnu";
import { DemoApp } from "./DemoApp";
import { SandboxAppBar } from "./SandboxAppBar";
import "./sandbox.css";
import { SandboxThemeHost } from "./themeDesigner";
import { WorkspaceSandboxMode } from "./WorkspaceSandbox";

type SandboxMode = "normal" | "workspace";

function getSandboxMode(): SandboxMode {
  return new URLSearchParams(window.location.search).get("mode") === "workspace"
    ? "workspace"
    : "normal";
}

function SandboxRoot() {
  const [mode, setMode] = useState(getSandboxMode);

  useEffect(() => {
    function syncModeFromLocation() {
      setMode(getSandboxMode());
    }

    window.addEventListener("popstate", syncModeFromLocation);

    return () => window.removeEventListener("popstate", syncModeFromLocation);
  }, []);

  const handleModeChange = useCallback((nextMode: SandboxMode) => {
    const nextUrl = new URL(window.location.href);

    if (nextMode === "workspace") {
      nextUrl.searchParams.set("mode", "workspace");
    } else {
      nextUrl.searchParams.delete("mode");
    }

    window.history.pushState({}, "", nextUrl);
    setMode(nextMode);
  }, []);

  return (
    <NuDesktop appBar={<SandboxAppBar />}>
      <NuIconGrid
        aria-hidden
        className="sandbox-desktop-drop-target"
        dropTarget
      />
      {mode === "workspace" ? (
        <WorkspaceSandboxMode
          onNormalModeChange={() => handleModeChange("normal")}
        />
      ) : (
        <DemoApp onWorkspaceModeChange={() => handleModeChange("workspace")} />
      )}
    </NuDesktop>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SandboxThemeHost>
      <NuDragDropProvider>
        <NuIconProvider>
          <SandboxRoot />
        </NuIconProvider>
      </NuDragDropProvider>
    </SandboxThemeHost>
  </React.StrictMode>
);
