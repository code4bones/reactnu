import path from "node:path";
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y"],
  framework: "@storybook/react-vite",
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      exclude: [".storybook/**"],
      tsconfigPath: path.resolve(currentDir, "../tsconfig.storybook.json")
    }
  },
  viteFinal: async (config) => {
    config.resolve ??= {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@deadragdoll/reactnu": path.resolve(
        currentDir,
        "../packages/ui/src/index.ts"
      )
    };

    return config;
  }
};

export default config;
