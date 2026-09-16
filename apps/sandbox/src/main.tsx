import React from "react";
import ReactDOM from "react-dom/client";
import "@deadragdoll/reactnu/styles.css";
import { NuDesktop, NuThemeProvider } from "@deadragdoll/reactnu";
import { DemoApp } from "./DemoApp";
import { SandboxAppBar } from "./SandboxAppBar";
import "./sandbox.css";

// Demo-only: the library default scopes glitches to controls inside an open
// .nu-window, but most of this sandbox's own UI (theme panel, workspace
// tools launcher) lives directly on the host page, not in a window. Widen
// the pool here so the effect is visible across the whole demo.
const DEMO_TARGET_SELECTOR = [
  ".nu-button",
  ".nu-command-button",
  ".nu-check-box",
  ".nu-glyph",
  ".nu-tree-view__icon",
  ".nu-tree-view__check-box",
  ".nu-list-view__row",
  ".nu-listbox__item"
].join(", ");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NuThemeProvider
      crtGlitch={{ targetSelector: DEMO_TARGET_SELECTOR }}
      defaultFontFamily={'"Comic Sans MS", "Comic Sans", cursive'}
      defaultFontSize={16}
    >
      <NuDesktop appBar={<SandboxAppBar />}>
        <DemoApp />
      </NuDesktop>
    </NuThemeProvider>
  </React.StrictMode>
);
