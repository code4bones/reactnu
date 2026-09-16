import { PropsWithChildren } from "react";

type AppBarHostProps = PropsWithChildren<{
  inline?: boolean;
}>;

export function AppBarHost({ children, inline = false }: AppBarHostProps) {
  return (
    <aside
      className={[
        "nu-app-bar-host",
        inline ? "nu-app-bar-host--inline" : null,
        !children ? "nu-app-bar-host--empty" : null
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Application bar"
      role="toolbar"
    >
      {children}
    </aside>
  );
}
