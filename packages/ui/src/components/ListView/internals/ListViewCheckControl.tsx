import { NuGlyph } from "../../Glyph";

type ListViewCheckControlProps = {
  isChecked: boolean;
  onActivate: () => void;
  onToggleCheck: () => void;
  uncheckedShape: "box" | "none";
};

export function ListViewCheckControl({
  isChecked,
  onActivate,
  onToggleCheck,
  uncheckedShape
}: ListViewCheckControlProps) {
  return (
    <button
      aria-label={isChecked ? "Uncheck row" : "Check row"}
      aria-pressed={isChecked}
      className="nu-list-view__check"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onActivate();
        onToggleCheck();
      }}
      type="button"
    >
      <span
        aria-hidden="true"
        className="nu-list-view__check-box"
        data-unchecked-shape={uncheckedShape}
      >
        {isChecked ? (
          <NuGlyph
            className="nu-list-view__check-indicator"
            name="check-mark"
          />
        ) : null}
      </span>
    </button>
  );
}
