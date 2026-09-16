import { CSSProperties } from "react";

export type SlotClassNames<T extends string> = Partial<Record<T, string>>;
export type SlotStyles<T extends string> = Partial<Record<T, CSSProperties>>;

export type SlotCustomizationProps<T extends string> = {
  slotClassNames?: SlotClassNames<T>;
  slotStyles?: SlotStyles<T>;
};

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function mergeSlotStyle(
  baseStyle?: CSSProperties,
  slotStyle?: CSSProperties
) {
  if (!baseStyle && !slotStyle) {
    return undefined;
  }

  return {
    ...baseStyle,
    ...slotStyle
  } satisfies CSSProperties;
}
