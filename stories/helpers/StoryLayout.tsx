import React, { ReactNode } from "react";
import { Frame, NuDesktop, NuView, Panel, Stack } from "@deadragdoll/reactnu";

export function StoryStack({
  children,
  fill = false
}: {
  children: ReactNode;
  fill?: boolean;
}) {
  return (
    <Stack gap="md" style={fill ? { minHeight: "28rem" } : undefined}>
      {children}
    </Stack>
  );
}

export function StoryRow({ children }: { children: ReactNode }) {
  return (
    <Stack
      align="start"
      direction="row"
      gap="md"
      justify="start"
      style={{ flexWrap: "wrap" }}
    >
      {children}
    </Stack>
  );
}

export function StoryFrame({
  children,
  title
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <Frame
      contentStyle={{ padding: "0.75rem 1rem" }}
      title={title}
      titleProps={{
        background: "black",
        borderColor: "black",
        color: "yellow"
      }}
    >
      {children}
    </Frame>
  );
}

export function StoryPanel({
  children,
  compact = false,
  title
}: {
  children: ReactNode;
  compact?: boolean;
  title: string;
}) {
  return (
    <Panel
      inset
      style={
        compact ? { alignSelf: "flex-start", width: "fit-content" } : undefined
      }
      title={title}
    >
      <NuView padding="sm">{children}</NuView>
    </Panel>
  );
}

export function StoryDesktop({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "52rem",
        overflow: "hidden",
        isolation: "isolate",
        transform: "translateZ(0)"
      }}
    >
      <NuDesktop>{children}</NuDesktop>
    </div>
  );
}
