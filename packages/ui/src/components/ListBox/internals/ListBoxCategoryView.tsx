import { renderLabel } from "./renderLabel";
import { ListBoxCategory } from "./types";

type ListBoxCategoryViewProps = {
  category: ListBoxCategory;
};

export function ListBoxCategoryView({ category }: ListBoxCategoryViewProps) {
  return (
    <div
      className={["nu-listbox__category", category.className]
        .filter(Boolean)
        .join(" ")}
    >
      {renderLabel(category, "nu-listbox__category-label")}
    </div>
  );
}
