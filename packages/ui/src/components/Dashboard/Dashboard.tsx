import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export type DashboardItem = {
  alignSelf?: CSSProperties["alignSelf"];
  column?: string;
  columnSpan?: number;
  content: ReactNode;
  id: string | number;
  justifySelf?: CSSProperties["justifySelf"];
  lane?: number;
  maxWidth?: string;
  minHeight?: string;
  minWidth?: string;
  row?: string;
  rowSpan?: number;
  width?: string;
};

export type DashboardProps = HTMLAttributes<HTMLDivElement> & {
  columnCount?: number;
  fill?: boolean;
  gap?: number | string;
  items: DashboardItem[];
  layout?: "grid" | "lanes";
  laneCount?: number;
};

function resolveDashboardGap(gap: DashboardProps["gap"]) {
  if (typeof gap === "number") {
    return `${gap}px`;
  }

  return gap;
}

export function Dashboard({
  className,
  columnCount = 12,
  fill = true,
  gap = 12,
  items,
  layout = "grid",
  laneCount = 2,
  style,
  ...props
}: DashboardProps) {
  const resolvedGap = resolveDashboardGap(gap);

  if (layout === "lanes") {
    const lanes = Array.from({ length: laneCount }, (_, index) => index + 1);

    return (
      <div
        {...props}
        className={["nu-dashboard", className].filter(Boolean).join(" ")}
        data-fill={fill || undefined}
        data-layout="lanes"
        style={
          {
            ...style,
            "--nu-dashboard-gap": resolvedGap,
            "--nu-dashboard-lane-count": laneCount
          } as CSSProperties
        }
      >
        {lanes.map((lane) => (
          <div className="nu-dashboard__lane" key={lane}>
            {items
              .filter((item) => (item.lane ?? 1) === lane)
              .map((item) => (
                <div
                  className="nu-dashboard__cell"
                  key={item.id}
                  style={{
                    alignSelf:
                      item.alignSelf ?? (item.width ? "flex-start" : undefined),
                    justifySelf: item.justifySelf,
                    maxWidth: item.maxWidth,
                    minHeight: item.minHeight,
                    minWidth: item.minWidth,
                    width: item.width
                  }}
                >
                  <div className="nu-dashboard__content">{item.content}</div>
                </div>
              ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      {...props}
      className={["nu-dashboard", className].filter(Boolean).join(" ")}
      data-fill={fill || undefined}
      style={
        {
          ...style,
          "--nu-dashboard-column-count": columnCount,
          "--nu-dashboard-gap": resolvedGap
        } as CSSProperties
      }
    >
      {items.map((item) => (
        <div
          className="nu-dashboard__cell"
          key={item.id}
          style={{
            alignSelf: item.alignSelf,
            gridColumn:
              item.column ??
              (item.columnSpan ? `span ${item.columnSpan}` : undefined),
            gridRow:
              item.row ?? (item.rowSpan ? `span ${item.rowSpan}` : undefined),
            justifySelf: item.justifySelf,
            maxWidth: item.maxWidth,
            minHeight: item.minHeight,
            minWidth: item.minWidth,
            width: item.width
          }}
        >
          <div className="nu-dashboard__content">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
