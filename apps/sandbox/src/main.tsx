import React from "react";
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SandboxThemeHost>
      <NuDragDropProvider>
        <NuIconProvider>
          <NuDesktop appBar={<SandboxAppBar />}>
            <NuIconGrid
              aria-hidden
              className="sandbox-desktop-drop-target"
              dropTarget
            />
            <DemoApp />
          </NuDesktop>
        </NuIconProvider>
      </NuDragDropProvider>
    </SandboxThemeHost>
  </React.StrictMode>
);
