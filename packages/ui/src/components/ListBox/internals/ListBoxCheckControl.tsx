import { NuGlyph } from "../../Glyph";

type ListBoxCheckControlProps = {
  isChecked: boolean;
  onActivate: () => void;
  onToggleCheck: () => void;
  uncheckedShape: "box" | "none";
};

export function ListBoxCheckControl({
  isChecked,
  onActivate,
  onToggleCheck,
  uncheckedShape
}: ListBoxCheckControlProps) {
  return (
    <button
      aria-label={isChecked ? "Uncheck item" : "Check item"}
      aria-pressed={isChecked}
      className="nu-listbox__check"
      onClick={(event) => {
        event.stopPropagation();
        onActivate();
        onToggleCheck();
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        className="nu-listbox__check-box"
        data-unchecked-shape={uncheckedShape}
      >
        {isChecked ? (
          <NuGlyph className="nu-listbox__check-indicator" name="check-mark" />
        ) : null}
      </span>
    </button>
  );
}
