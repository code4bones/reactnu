import {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  createElement
} from "react";
import { renderMnemonicNode } from "../utils/renderMnemonicText";

type AppBarItemBaseProps = {
  active?: boolean;
  alignment?: "start" | "end";
  children?: ReactNode;
  className?: string;
  grow?: boolean;
};

type AppBarItemButtonProps = AppBarItemBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    interactive: true;
  };

type AppBarItemStaticProps = AppBarItemBaseProps &
  Omit<HTMLAttributes<HTMLDivElement>, "className" | "children"> & {
    interactive?: false;
  };

export type AppBarItemProps = AppBarItemButtonProps | AppBarItemStaticProps;

export function AppBarItem(props: AppBarItemProps) {
  const {
    active = false,
    alignment = "start",
    children,
    className,
    grow = false,
    interactive = false
  } = props;
  const resolvedClassName = [
    "nu-app-bar-item",
    active ? "nu-app-bar-item--active" : null,
    alignment === "end" ? "nu-app-bar-item--align-end" : null,
    grow ? "nu-app-bar-item--grow" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");

  if (interactive) {
    const {
      active: _active,
      alignment: _alignment,
      children: _children,
      className: _className,
      grow: _grow,
      interactive: _interactive,
      ...buttonProps
    } = props as AppBarItemButtonProps;
    void _active;
    void _alignment;
    void _children;
    void _className;
    void _grow;
    void _interactive;

    return createElement(
      "button",
      {
        ...buttonProps,
        className: resolvedClassName,
        type: buttonProps.type ?? "button"
      },
      renderMnemonicNode(children)
    );
  }

  const {
    active: _active,
    alignment: _alignment,
    children: _children,
    className: _className,
    grow: _grow,
    interactive: _interactive,
    ...staticProps
  } = props as AppBarItemStaticProps;
  void _active;
  void _alignment;
  void _children;
  void _className;
  void _grow;
  void _interactive;

  return createElement(
    "div",
    {
      ...staticProps,
      className: resolvedClassName
    },
    renderMnemonicNode(children)
  );
}
