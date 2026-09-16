import { ListBoxLabel } from "./types";

export function renderLabel(label: ListBoxLabel, className: string) {
  return (
    <span className={className}>
      {label.icon ? (
        <span aria-hidden="true" className={`${className}-icon`}>
          {label.icon}
        </span>
      ) : null}
      <span className={`${className}-text`}>{label.text}</span>
    </span>
  );
}
