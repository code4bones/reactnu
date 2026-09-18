import { ChangeEvent, ReactNode, useState } from "react";
import {
  Button,
  Dropdown,
  Memo,
  PageControl,
  RadioGroup,
  Stack,
  TextField,
  nuThemes
} from "@deadragdoll/reactnu";
import {
  THEME_TOKEN_GROUPS,
  ThemeTokenField,
  VISUAL_TOKEN_GROUPS,
  VisualTokenField,
  useSandboxThemeDesigner
} from "./themeDesigner";

type ThemeDesignerWindowProps = {
  onClose: () => void;
};

function getPickerColor(value: string) {
  return /^#[0-9a-f]{6}$/i.test(value) ? value : undefined;
}

function ThemeTokenInput({ field }: { field: ThemeTokenField }) {
  const { resolvedTheme, setThemeToken } = useSandboxThemeDesigner();
  const value = resolvedTheme.tokens[field.key];
  const pickerColor = getPickerColor(value);

  return (
    <div className="sandbox-theme-designer__field">
      <TextField
        label={`${field.label} (${field.cssVariable})`}
        onChange={(event) => setThemeToken(field.key, event.target.value)}
        value={value}
      />
      <input
        aria-label={`${field.label} color picker`}
        className="sandbox-theme-designer__color-picker"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setThemeToken(field.key, event.target.value)
        }
        title={`Pick ${field.label.toLowerCase()} color`}
        type="color"
        value={pickerColor ?? "#000000"}
      />
    </div>
  );
}

function VisualTokenInput({ field }: { field: VisualTokenField }) {
  const { setVisualToken, visualTokens } = useSandboxThemeDesigner();
  const value = visualTokens[field.cssVariable];

  if (field.control === "border-style") {
    return (
      <Dropdown
        data={[
          {
            category: null,
            items: [
              "solid",
              "dashed",
              "dotted",
              "double",
              "groove",
              "ridge",
              "inset",
              "outset",
              "none"
            ].map((style) => ({ id: style, name: { text: style } }))
          }
        ]}
        label={`${field.label} (${field.cssVariable})`}
        onValueChange={(nextValue) =>
          setVisualToken(field.cssVariable, nextValue)
        }
        value={value}
      />
    );
  }

  const textField = (
    <TextField
      label={`${field.label} (${field.cssVariable})`}
      max={field.control === "opacity" ? 1 : undefined}
      min={field.control === "opacity" ? 0 : undefined}
      onChange={(event) =>
        setVisualToken(field.cssVariable, event.target.value)
      }
      step={field.control === "opacity" ? 0.05 : undefined}
      type={field.control === "opacity" ? "number" : undefined}
      value={value}
    />
  );

  if (field.control !== "color") {
    return textField;
  }

  const pickerColor = getPickerColor(value);

  return (
    <div className="sandbox-theme-designer__field">
      {textField}
      <input
        aria-label={`${field.label} color picker`}
        className="sandbox-theme-designer__color-picker"
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setVisualToken(field.cssVariable, event.target.value)
        }
        title={`Pick ${field.label.toLowerCase()} color`}
        type="color"
        value={pickerColor ?? "#000000"}
      />
    </div>
  );
}

function TokenList({ children }: { children: ReactNode }) {
  return <div className="sandbox-theme-designer__token-list">{children}</div>;
}

function PalettePage() {
  return (
    <TokenList>
      {THEME_TOKEN_GROUPS.map((group) => (
        <section className="sandbox-theme-designer__group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="sandbox-theme-designer__field-grid">
            {group.fields.map((field) => (
              <ThemeTokenInput field={field} key={field.key} />
            ))}
          </div>
        </section>
      ))}
    </TokenList>
  );
}

function DesktopPage() {
  const {
    baseThemeName,
    desktopPatternMode,
    fontFamily,
    fontSize,
    selectBaseTheme,
    setDesktopPatternMode,
    setFontFamily,
    setFontSize
  } = useSandboxThemeDesigner();

  return (
    <TokenList>
      <section className="sandbox-theme-designer__group">
        <h3>Base palette</h3>
        <Stack
          direction="row"
          gap="sm"
          className="sandbox-theme-designer__presets"
        >
          {(Object.keys(nuThemes) as Array<keyof typeof nuThemes>).map(
            (themeName) => {
              const theme = nuThemes[themeName];

              return (
                <Button
                  key={theme.name}
                  onClick={() => selectBaseTheme(themeName)}
                  variant={
                    baseThemeName === themeName ? "primary" : "secondary"
                  }
                >
                  {theme.label}
                </Button>
              );
            }
          )}
        </Stack>
        <p className="sandbox-copy">
          Selecting a base palette intentionally clears local token and geometry
          edits.
        </p>
      </section>
      <section className="sandbox-theme-designer__group">
        <RadioGroup
          label="Desktop &pattern"
          onValueChange={(value) =>
            setDesktopPatternMode(value as typeof desktopPatternMode)
          }
          options={[
            { label: "&Dot grid", value: "dot-grid" },
            { label: "&Dense dots", value: "dense-dots" },
            { label: "&Coarse dots", value: "coarse-dots" },
            { label: "&Grid", value: "grid" },
            { label: "&Solid", value: "solid" }
          ]}
          value={desktopPatternMode}
        />
      </section>
      <section className="sandbox-theme-designer__group">
        <h3>Host typography</h3>
        <div className="sandbox-theme-designer__field-grid">
          <TextField
            label="Font family (--nu-font-body)"
            onChange={(event) => setFontFamily(event.target.value)}
            value={fontFamily}
          />
          <TextField
            label="Font size (px)"
            min={8}
            onChange={(event) => {
              const nextSize = Number(event.target.value);

              if (Number.isFinite(nextSize) && nextSize >= 8) {
                setFontSize(nextSize);
              }
            }}
            type="number"
            value={fontSize}
          />
        </div>
      </section>
    </TokenList>
  );
}

function GeometryPage() {
  return (
    <TokenList>
      {VISUAL_TOKEN_GROUPS.slice(0, 3).map((group) => (
        <section className="sandbox-theme-designer__group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="sandbox-theme-designer__field-grid">
            {group.fields.map((field) => (
              <VisualTokenInput field={field} key={field.cssVariable} />
            ))}
          </div>
        </section>
      ))}
    </TokenList>
  );
}

function EffectsPage() {
  return (
    <TokenList>
      {VISUAL_TOKEN_GROUPS.slice(3).map((group) => (
        <section className="sandbox-theme-designer__group" key={group.title}>
          <h3>{group.title}</h3>
          <div className="sandbox-theme-designer__field-grid">
            {group.fields.map((field) => (
              <VisualTokenInput field={field} key={field.cssVariable} />
            ))}
          </div>
        </section>
      ))}
    </TokenList>
  );
}

function ImportSection() {
  const { importThemeJson } = useSandboxThemeDesigner();
  const [importSource, setImportSource] = useState("");
  const [importStatus, setImportStatus] = useState(
    "Paste a JSON export from this designer."
  );

  function applyImport() {
    const result = importThemeJson(importSource);
    setImportStatus(result.message);
  }

  function handleImportSource(nextSource: string) {
    setImportSource(nextSource);

    if (!nextSource.trim()) {
      setImportStatus("Paste a JSON export from this designer.");
      return;
    }

    const result = importThemeJson(nextSource);

    setImportStatus(
      result.ok ? result.message : "JSON is ready to import when complete."
    );
  }

  return (
    <section className="sandbox-theme-designer__import">
      <h3>Continue editing from JSON</h3>
      <Memo
        aria-label="Theme Designer JSON import"
        onValueChange={handleImportSource}
        placeholder="Paste a Theme Designer JSON export here"
        value={importSource}
      />
      <Stack direction="row" gap="sm" justify="end">
        <span className="sandbox-theme-designer__import-status" role="status">
          {importStatus}
        </span>
        <Button disabled={!importSource.trim()} onClick={applyImport}>
          &Import JSON
        </Button>
      </Stack>
    </section>
  );
}

function ExportPage() {
  const { cssExport, jsonExport } = useSandboxThemeDesigner();

  return (
    <div className="sandbox-theme-designer__export">
      <section>
        <h3>CSS custom properties</h3>
        <Memo
          aria-label="Generated CSS custom properties"
          readOnly
          value={cssExport}
        />
      </section>
      <section>
        <h3>Theme definition for an agent</h3>
        <Memo
          aria-label="Generated theme definition"
          readOnly
          value={jsonExport}
        />
      </section>
      <ImportSection />
    </div>
  );
}

export function ThemeDesignerWindow({ onClose }: ThemeDesignerWindowProps) {
  const { cssExport, jsonExport, resetTheme } = useSandboxThemeDesigner();
  const [copyStatus, setCopyStatus] = useState("Changes apply immediately.");

  async function copyExport(value: string, label: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopyStatus(`${label} copied to the clipboard.`);
    } catch {
      setCopyStatus(
        `Clipboard access was unavailable. Select ${label} in Export.`
      );
    }
  }

  return (
    <div className="sandbox-theme-designer">
      <div className="sandbox-theme-designer__intro">
        <p className="sandbox-copy">
          Edit the same CSS tokens used by the sandbox. Valid values apply to
          the desktop, windows, menus, controls, and popup portals immediately.
        </p>
      </div>
      <PageControl
        fill
        pages={[
          { id: "palette", label: "&Palette", content: <PalettePage /> },
          { id: "desktop", label: "&Desktop", content: <DesktopPage /> },
          { id: "geometry", label: "&Geometry", content: <GeometryPage /> },
          { id: "effects", label: "E&ffects", content: <EffectsPage /> },
          { id: "export", label: "E&xport", content: <ExportPage /> }
        ]}
      />
      <div className="sandbox-theme-designer__footer">
        <span>{copyStatus}</span>
        <Stack direction="row" gap="sm" justify="end">
          <Button onClick={() => resetTheme()} variant="secondary">
            &Reset edits
          </Button>
          <Button onClick={() => void copyExport(cssExport, "CSS")}>
            Copy &CSS
          </Button>
          <Button onClick={() => void copyExport(jsonExport, "JSON")}>
            Copy &JSON
          </Button>
          <Button onClick={onClose} variant="secondary">
            &Close
          </Button>
        </Stack>
      </div>
    </div>
  );
}
