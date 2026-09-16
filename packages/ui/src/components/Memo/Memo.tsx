import {
  ChangeEvent,
  CSSProperties,
  TextareaHTMLAttributes,
  useState
} from "react";

type MemoScroll = "auto" | "x" | "y" | "both" | "hidden";

export type MemoProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> & {
  background?: CSSProperties["background"];
  content?: string;
  fill?: boolean;
  focusBackground?: CSSProperties["background"];
  focusTextColor?: CSSProperties["color"];
  onValueChange?: (value: string) => void;
  scroll?: MemoScroll;
  textColor?: CSSProperties["color"];
};

export function Memo({
  background,
  className,
  content,
  defaultValue,
  fill = true,
  focusBackground,
  focusTextColor,
  onChange,
  onValueChange,
  scroll = "auto",
  style,
  textColor,
  value,
  ...props
}: MemoProps) {
  const isControlled = value !== undefined;
  const resolvedInitialValue =
    defaultValue == null ? (content ?? "") : String(defaultValue);
  const resolvedValue =
    value == null
      ? ""
      : Array.isArray(value)
        ? value.join("\n")
        : String(value);
  const [uncontrolledValue, setUncontrolledValue] = useState(
    () => resolvedInitialValue
  );

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    if (!isControlled) {
      setUncontrolledValue(event.target.value);
    }

    onValueChange?.(event.target.value);
    onChange?.(event);
  }

  return (
    <div
      className={["nu-memo", className].filter(Boolean).join(" ")}
      data-fill={fill || undefined}
      data-scroll={scroll}
      style={
        {
          ...style,
          "--nu-memo-bg": background,
          "--nu-memo-focus-bg": focusBackground,
          "--nu-memo-focus-text": focusTextColor,
          "--nu-memo-text": textColor
        } as CSSProperties
      }
    >
      <div className="nu-memo__viewport">
        <textarea
          {...props}
          className="nu-memo__input"
          onChange={handleChange}
          value={isControlled ? resolvedValue : uncontrolledValue}
        />
      </div>
    </div>
  );
}
