import type { Preview } from "@storybook/react-vite";
import React from "react";
import { NuThemeProvider } from "@deadragdoll/reactnu";
import "../packages/ui/src/globals.less";

const FONT_OPTIONS = {
  comic: '"Comic Sans MS", "Comic Sans", cursive',
  ibm: '"IBM Plex Mono", "Cascadia Mono", "Consolas", monospace',
  cascadia: '"Cascadia Mono", "IBM Plex Mono", "Consolas", monospace',
  fixedsys: '"Fixedsys Excelsior 3.01", "Fixedsys", "Lucida Console", monospace'
} as const;

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const theme = String(context.globals.theme ?? "classic") as
        | "classic"
        | "amber"
        | "phosphor";
      const fontKey = String(
        context.globals.font ?? "comic"
      ) as keyof typeof FONT_OPTIONS;
      const fontSize = Number(context.globals.fontSize ?? 16);
      const desktopPatternMode = String(
        context.globals.desktopPatternMode ?? "dot-grid"
      ) as "dot-grid" | "dense-dots" | "coarse-dots" | "grid" | "solid";

      return (
        <NuThemeProvider
          defaultDesktopPatternMode={desktopPatternMode}
          defaultFontFamily={FONT_OPTIONS[fontKey] ?? FONT_OPTIONS.comic}
          defaultFontSize={fontSize}
          defaultTheme={theme}
          desktopPatternMode={desktopPatternMode}
          fontFamily={FONT_OPTIONS[fontKey] ?? FONT_OPTIONS.comic}
          fontSize={fontSize}
          theme={theme}
        >
          <div
            style={{
              padding: "1rem",
              background: "var(--nu-color-app-bg)",
              color: "var(--nu-text-primary)"
            }}
          >
            <Story />
          </div>
        </NuThemeProvider>
      );
    }
  ],
  globalTypes: {
    theme: {
      description: "ReactNU theme",
      toolbar: {
        dynamicTitle: true,
        items: [
          { title: "Classic", value: "classic" },
          { title: "Amber", value: "amber" },
          { title: "Phosphor", value: "phosphor" }
        ],
        title: "Theme"
      }
    },
    font: {
      description: "Host font family",
      toolbar: {
        dynamicTitle: true,
        items: [
          { title: "Comic Sans", value: "comic" },
          { title: "IBM Plex Mono", value: "ibm" },
          { title: "Cascadia Mono", value: "cascadia" },
          { title: "Fixedsys", value: "fixedsys" }
        ],
        title: "Font"
      }
    },
    fontSize: {
      description: "Host font size",
      toolbar: {
        dynamicTitle: true,
        items: [
          { title: "13px", value: 13 },
          { title: "14px", value: 14 },
          { title: "16px", value: 16 },
          { title: "18px", value: 18 }
        ],
        title: "Size"
      }
    },
    desktopPatternMode: {
      description: "Desktop pattern mode",
      toolbar: {
        dynamicTitle: true,
        items: [
          { title: "Dot Grid", value: "dot-grid" },
          { title: "Dense Dots", value: "dense-dots" },
          { title: "Coarse Dots", value: "coarse-dots" },
          { title: "Grid", value: "grid" },
          { title: "Solid", value: "solid" }
        ],
        title: "Pattern"
      }
    }
  },
  parameters: {
    a11y: {
      test: "todo"
    },
    controls: {
      expanded: true
    },
    layout: "padded"
  }
};

export default preview;
