import { CSSProperties, ReactNode, useState } from "react";
import { Button } from "../components/Button";
import { Stack } from "../components/Stack";
import { TextField } from "../components/TextField";
import { NuView } from "../components/View";

export type NuMessageBoxKind = "normal" | "info" | "error";
export type NuMessageBoxPreset =
  | "ok"
  | "ok-cancel"
  | "yes-no"
  | "yes-no-cancel";
export type NuMessageBoxResult = "ok" | "yes" | "no" | "cancel";

export type NuMessageBoxOptions = {
  appModal?: boolean;
  cancel?: boolean;
  cancelLabel?: string;
  domain?: string;
  kind?: NuMessageBoxKind;
  message: ReactNode;
  no?: boolean;
  noLabel?: string;
  ok?: boolean;
  okLabel?: string;
  preset?: NuMessageBoxPreset;
  style?: CSSProperties;
  title?: string;
  yes?: boolean;
  yesLabel?: string;
};

export type NuInputBoxOptions = {
  appModal?: boolean;
  cancelLabel?: string;
  defaultValue?: string;
  domain?: string;
  hint?: string;
  label: string;
  okLabel?: string;
  placeholder?: string;
  style?: CSSProperties;
  title?: string;
};

type MessageBoxDialogContentProps = {
  cancel: boolean;
  cancelLabel: string;
  kind: NuMessageBoxKind;
  message: ReactNode;
  no: boolean;
  noLabel: string;
  ok: boolean;
  okLabel: string;
  onResolve: (result: NuMessageBoxResult) => void;
  yes: boolean;
  yesLabel: string;
};

type InputBoxDialogContentProps = {
  defaultValue?: string;
  hint?: string;
  label: string;
  okLabel: string;
  cancelLabel: string;
  onResolve: (value: string | null) => void;
  placeholder?: string;
};

function getPresetButtons(
  preset: NuMessageBoxPreset | undefined
): Record<NuMessageBoxResult, boolean> {
  switch (preset) {
    case "ok-cancel":
      return { cancel: true, no: false, ok: true, yes: false };
    case "yes-no":
      return { cancel: false, no: true, ok: false, yes: true };
    case "yes-no-cancel":
      return { cancel: true, no: true, ok: false, yes: true };
    case "ok":
    default:
      return { cancel: false, no: false, ok: true, yes: false };
  }
}

export function getResolvedMessageBoxButtons(options: NuMessageBoxOptions) {
  const presetButtons = getPresetButtons(options.preset);
  const yes = options.yes ?? presetButtons.yes;
  const no = options.no ?? presetButtons.no;
  const cancel = options.cancel ?? presetButtons.cancel;
  const ok = options.ok ?? (yes || no || cancel ? presetButtons.ok : true);

  return { cancel, no, ok, yes };
}

export function getResolvedMessageBoxLabels(options: NuMessageBoxOptions) {
  return {
    cancelLabel: options.cancelLabel ?? "&Cancel",
    noLabel: options.noLabel ?? "&No",
    okLabel: options.okLabel ?? "&OK",
    yesLabel: options.yesLabel ?? "&Yes"
  };
}

export function getMessageBoxDismissResult(
  buttons: ReturnType<typeof getResolvedMessageBoxButtons>
): NuMessageBoxResult {
  if (buttons.cancel) {
    return "cancel";
  }

  if (buttons.ok) {
    return "ok";
  }

  if (buttons.no) {
    return "no";
  }

  return "yes";
}

export function getMessageBoxTitle(options: NuMessageBoxOptions) {
  if (options.title) {
    return options.title;
  }

  switch (options.kind ?? "normal") {
    case "info":
      return "Information";
    case "error":
      return "Error";
    default:
      return "Message";
  }
}

export function getMessageBoxDomain(options: NuMessageBoxOptions) {
  return options.domain ?? "MessageBox";
}

export function getMessageBoxStyle(options: NuMessageBoxOptions) {
  return {
    width: "26rem",
    ...options.style
  } satisfies CSSProperties;
}

export function getInputBoxTitle(options: NuInputBoxOptions) {
  return options.title ?? "Input";
}

export function getInputBoxDomain(options: NuInputBoxOptions) {
  return options.domain ?? "InputBox";
}

export function getInputBoxStyle(options: NuInputBoxOptions) {
  return {
    width: "28rem",
    ...options.style
  } satisfies CSSProperties;
}

function getMessageBoxTone(kind: NuMessageBoxKind) {
  switch (kind) {
    case "info":
      return "var(--nu-text-accent)";
    case "error":
      return "var(--nu-text-accent)";
    default:
      return undefined;
  }
}

export function MessageBoxDialogContent({
  cancel,
  cancelLabel,
  kind,
  message,
  no,
  noLabel,
  ok,
  okLabel,
  onResolve,
  yes,
  yesLabel
}: MessageBoxDialogContentProps) {
  const tone = getMessageBoxTone(kind);
  const bodyStyle =
    kind === "error"
      ? ({
          background: "var(--nu-color-button-danger)"
        } satisfies CSSProperties)
      : undefined;

  return (
    <NuView padding="cell" style={bodyStyle}>
      <Stack gap="md">
        <div
          style={
            tone
              ? {
                  color: tone
                }
              : undefined
          }
        >
          {message}
        </div>
        <Stack direction="row" gap="sm" justify="center">
          {ok ? (
            <Button
              className="nu-dialog-helper__button"
              defaultFocused
              onClick={() => onResolve("ok")}
            >
              {okLabel}
            </Button>
          ) : null}
          {yes ? (
            <Button
              className="nu-dialog-helper__button"
              defaultFocused={!ok}
              onClick={() => onResolve("yes")}
            >
              {yesLabel}
            </Button>
          ) : null}
          {no ? (
            <Button
              className="nu-dialog-helper__button"
              defaultFocused={!ok && !yes}
              onClick={() => onResolve("no")}
            >
              {noLabel}
            </Button>
          ) : null}
          {cancel ? (
            <Button
              className="nu-dialog-helper__button"
              onClick={() => onResolve("cancel")}
              variant="secondary"
            >
              {cancelLabel}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </NuView>
  );
}

export function InputBoxDialogContent({
  cancelLabel,
  defaultValue,
  hint,
  label,
  okLabel,
  onResolve,
  placeholder
}: InputBoxDialogContentProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <NuView padding="cell">
      <Stack gap="md">
        <TextField
          autoFocus
          defaultValue={defaultValue}
          hint={hint}
          label={label}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
        <Stack direction="row" gap="sm" justify="center">
          <Button
            className="nu-dialog-helper__button"
            defaultFocused
            onClick={() => onResolve(value)}
          >
            {okLabel}
          </Button>
          <Button
            className="nu-dialog-helper__button"
            onClick={() => onResolve(null)}
            variant="secondary"
          >
            {cancelLabel}
          </Button>
        </Stack>
      </Stack>
    </NuView>
  );
}
