import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const packageDir = resolve(scriptDir, "..");
const sourceDocsDir = resolve(packageDir, "../../docs");
const packageDocsDir = resolve(packageDir, "docs");

if (process.argv.includes("--clean")) {
  rmSync(packageDocsDir, { force: true, recursive: true });
} else {
  if (!existsSync(sourceDocsDir)) {
    throw new Error(`Documentation directory not found: ${sourceDocsDir}`);
  }

  rmSync(packageDocsDir, { force: true, recursive: true });
  cpSync(sourceDocsDir, packageDocsDir, { recursive: true });
}
