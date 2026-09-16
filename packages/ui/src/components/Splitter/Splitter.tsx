import {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState
} from "react";

type SplitterOrientation = "vertical" | "horizontal";

export type SplitterProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  defaultValue?: number;
  first: ReactNode;
  max?: number;
  min?: number;
  onValueChange?: (value: number) => void;
  orientation?: SplitterOrientation;
  saveId?: string;
  second: ReactNode;
  value?: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function Splitter({
  className,
  defaultValue = 0.5,
  first,
  max = 0.85,
  min = 0.15,
  onValueChange,
  orientation = "vertical",
  saveId,
  second,
  style,
  value,
  ...props
}: SplitterProps) {
  const isControlled = value !== undefined;
  const storageKey = saveId ? `reactnu:splitter:${saveId}` : null;
  const getSavedValue = () => {
    if (!storageKey || typeof window === "undefined") {
      return null;
    }

    const rawValue = window.localStorage.getItem(storageKey);

    if (!rawValue) {
      return null;
    }

    const parsedValue = Number(rawValue);

    return Number.isFinite(parsedValue) ? parsedValue : null;
  };
  const [uncontrolledValue, setUncontrolledValue] = useState(
    clamp(getSavedValue() ?? defaultValue, min, max)
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragFrameRef = useRef<number | null>(null);
  const dragValueRef = useRef<number | null>(null);
  const activeValue = clamp(
    (isControlled ? value : uncontrolledValue) ?? defaultValue,
    min,
    max
  );
  const firstPaneId = useId();
  const secondPaneId = useId();

  useEffect(() => {
    if (!storageKey || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, String(activeValue));
  }, [activeValue, storageKey]);

  useEffect(() => {
    return () => {
      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        dragFrameRef.current = null;
      }
    };
  }, []);

  function commitValue(nextValue: number) {
    const clampedValue = clamp(nextValue, min, max);

    if (!isControlled) {
      setUncontrolledValue(clampedValue);
    }

    onValueChange?.(clampedValue);
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    if (!rootRef.current) {
      return;
    }

    const pointerId = event.pointerId;
    const handleElement = event.currentTarget;
    const rootElement = rootRef.current;

    handleElement.setPointerCapture(pointerId);

    function computeValue(clientX: number, clientY: number) {
      const bounds = rootElement.getBoundingClientRect();
      const nextValue =
        orientation === "vertical"
          ? (clientX - bounds.left) / bounds.width
          : (clientY - bounds.top) / bounds.height;

      return clamp(nextValue, min, max);
    }

    // During an active drag we bypass React state entirely and write the
    // splitter position straight to the DOM (CSS custom property + the
    // handle's aria-valuenow), batched to at most once per animation frame.
    // This mirrors the Window.tsx drag/resize pattern and avoids re-running
    // React state updates (and re-rendering the, potentially expensive,
    // `first`/`second` panes) on every native pointermove event.
    function flushDragValue() {
      dragFrameRef.current = null;

      if (dragValueRef.current === null) {
        return;
      }

      rootElement.style.setProperty(
        "--nu-splitter-value",
        `${dragValueRef.current * 100}%`
      );
      handleElement.setAttribute(
        "aria-valuenow",
        String(Math.round(dragValueRef.current * 100))
      );
    }

    function scheduleDragValue(nextValue: number) {
      dragValueRef.current = nextValue;

      if (dragFrameRef.current !== null) {
        return;
      }

      dragFrameRef.current = window.requestAnimationFrame(flushDragValue);
    }

    function handlePointerMove(moveEvent: globalThis.PointerEvent) {
      scheduleDragValue(computeValue(moveEvent.clientX, moveEvent.clientY));
    }

    function finishDrag() {
      handleElement.releasePointerCapture(pointerId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", finishDrag);
      window.removeEventListener("pointercancel", finishDrag);

      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current);
        flushDragValue();
      }

      if (dragValueRef.current !== null) {
        commitValue(dragValueRef.current);
      }

      dragValueRef.current = null;
    }

    scheduleDragValue(computeValue(event.clientX, event.clientY));

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", finishDrag);
    window.addEventListener("pointercancel", finishDrag);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? 0.1 : 0.05;

    if (orientation === "vertical") {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        commitValue(activeValue - step);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        commitValue(activeValue + step);
      }
    }

    if (orientation === "horizontal") {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        commitValue(activeValue - step);
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        commitValue(activeValue + step);
      }
    }

    if (event.key === "Home") {
      event.preventDefault();
      commitValue(min);
    }

    if (event.key === "End") {
      event.preventDefault();
      commitValue(max);
    }
  }

  return (
    <div
      {...props}
      className={["nu-splitter", className].filter(Boolean).join(" ")}
      data-orientation={orientation}
      ref={rootRef}
      style={
        {
          ...style,
          "--nu-splitter-value": `${activeValue * 100}%`
        } as CSSProperties
      }
    >
      <div className="nu-splitter__pane" id={firstPaneId}>
        {first}
      </div>
      <div
        aria-controls={`${firstPaneId} ${secondPaneId}`}
        aria-orientation={
          orientation === "vertical" ? "vertical" : "horizontal"
        }
        aria-valuemax={Math.round(max * 100)}
        aria-valuemin={Math.round(min * 100)}
        aria-valuenow={Math.round(activeValue * 100)}
        className="nu-splitter__handle"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        role="separator"
        tabIndex={0}
      >
        <span
          aria-hidden="true"
          className="nu-splitter__grip"
          data-orientation={orientation}
        />
      </div>
      <div className="nu-splitter__pane" id={secondPaneId}>
        {second}
      </div>
    </div>
  );
}
