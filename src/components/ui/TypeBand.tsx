import {
  useState,
  useRef,
  useEffect,
  useCallback,
  startTransition,
  type CSSProperties,
} from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TypeBandProps {
  text?: string;
  textColor?: string;
  borderColor?: string;
  handleColor?: string;
  handleBorderColor?: string;
  handleBarColor?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string | number;
  letterSpacing?: string;
  lineHeight?: string;
  padding?: string;
  style?: CSSProperties;
  className?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_RANGE = 50; // minimum gap between handles (px)
const ROTATION_DEG = -2.76; // base CSS rotation
const RAD = (ROTATION_DEG * Math.PI) / 180;
const COS_THETA = Math.cos(RAD);
const SIN_THETA = Math.sin(RAD);
const MAX_TILT_DELTA = 3; // max additional rotation from handle deviation

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse a CSS-style padding shorthand into [top, right, bottom, left]. */
function parsePadding(padding: string): [number, number, number, number] {
  const parts = padding
    .trim()
    .split(/\s+/)
    .map((v) => parseFloat(v) || 0);

  switch (parts.length) {
    case 1:
      return [parts[0], parts[0], parts[0], parts[0]];
    case 2:
      return [parts[0], parts[1], parts[0], parts[1]];
    case 3:
      return [parts[0], parts[1], parts[2], parts[1]];
    case 4:
    default:
      return [parts[0], parts[1], parts[2], parts[3]];
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TypeBand(props: TypeBandProps) {
  const {
    text = "Cloud Developer (AWS) & Full Stack Web Developer",
    textColor = "#f4f4f5",
    borderColor = "#c7f200",
    handleColor = "#1a1a2e",
    handleBorderColor = "#c7f200",
    handleBarColor = "#c7f200",
    fontSize = "28px",
    fontFamily = "Inter, system-ui, sans-serif",
    fontWeight = 700,
    letterSpacing = "-0.02em",
    lineHeight = "1em",
    padding = "16px",
    style,
    className,
  } = props;

  // -- Derived measurements --------------------------------------------------

  const [padTop, padRight, padBottom, padLeft] = parsePadding(padding);
  const fontSizeNum = parseFloat(fontSize) || 28;
  const sliderHeight = fontSizeNum + padTop + padBottom;

  // -- Refs ------------------------------------------------------------------

  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

  // -- State -----------------------------------------------------------------

  const [textWidth, setTextWidth] = useState(0);
  const sliderWidth = textWidth + padLeft + padRight + 35;

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(sliderWidth);
  const [dragging, setDragging] = useState<"left" | "right" | null>(null);

  // Keep a ref so pointer‑move can read the latest values without re‑binding.
  const stateRef = useRef({ left, right, sliderWidth });
  stateRef.current = { left, right, sliderWidth };

  // -- Text measurement via ResizeObserver -----------------------------------

  useEffect(() => {
    const span = hiddenSpanRef.current;
    if (!span) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        startTransition(() => setTextWidth(w));
      }
    });

    observer.observe(span);
    return () => observer.disconnect();
  }, []);

  // Keep the right handle at full width when slider resizes and user hasn't
  // dragged it yet (or keep it clamped).
  useEffect(() => {
    setRight((prev) => {
      // If the user has never dragged the right handle, track full width.
      if (prev === 0 || prev >= sliderWidth) return sliderWidth;
      return Math.min(prev, sliderWidth);
    });
  }, [sliderWidth]);

  // -- Dragging logic --------------------------------------------------------

  const startDrag = useCallback(
    (handle: "left" | "right", startX: number, startY: number) => {
      const startLeft = stateRef.current.left;
      const startRight = stateRef.current.right;

      setDragging(handle);

      const onMove = (e: PointerEvent) => {
        const dX = e.clientX - startX;
        const dY = e.clientY - startY;
        // Project movement onto the rotated axis
        const projected = dX * COS_THETA + dY * SIN_THETA;

        const { sliderWidth: sw } = stateRef.current;

        if (handle === "left") {
          const raw = startLeft + projected;
          const clamped = Math.max(
            0,
            Math.min(raw, stateRef.current.right - MIN_RANGE)
          );
          startTransition(() => setLeft(clamped));
        } else {
          const raw = startRight + projected;
          const clamped = Math.max(
            stateRef.current.left + MIN_RANGE,
            Math.min(raw, sw)
          );
          startTransition(() => setRight(clamped));
        }
      };

      const onUp = () => {
        setDragging(null);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    []
  );

  const onPointerDownLeft = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startDrag("left", e.clientX, e.clientY);
    },
    [startDrag]
  );

  const onPointerDownRight = useCallback(
    (e: React.PointerEvent) => {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      startDrag("right", e.clientX, e.clientY);
    },
    [startDrag]
  );

  // -- Arrow key nudge -------------------------------------------------------

  const nudge = useCallback(
    (handle: "left" | "right", delta: number) => {
      if (handle === "left") {
        setLeft((prev) =>
          Math.max(0, Math.min(prev + delta, stateRef.current.right - MIN_RANGE))
        );
      } else {
        setRight((prev) =>
          Math.max(
            stateRef.current.left + MIN_RANGE,
            Math.min(prev + delta, stateRef.current.sliderWidth)
          )
        );
      }
    },
    []
  );

  const onKeyDown = useCallback(
    (handle: "left" | "right") => (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        nudge(handle, -10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nudge(handle, 10);
      }
    },
    [nudge]
  );

  // -- Dynamic rotation based on handle midpoint deviation -------------------

  const sliderCenter = sliderWidth / 2;
  const handleMidpoint = (left + right) / 2;
  const deviationFactor =
    sliderCenter === 0 ? 0 : (handleMidpoint - sliderCenter) / sliderCenter;
  const dynamicRotation = ROTATION_DEG + deviationFactor * MAX_TILT_DELTA;

  // -- Shared font style for hidden span + visible text ----------------------

  const fontStyle: CSSProperties = {
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    lineHeight,
    whiteSpace: "nowrap",
  };

  // -- Handle shared style ---------------------------------------------------

  const handleStyle = (isActive: boolean): CSSProperties => ({
    position: "absolute",
    top: 0,
    width: 28,
    height: "100%",
    borderRadius: 14,
    background: handleColor,
    border: `1.5px solid ${handleBorderColor}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "ew-resize",
    touchAction: "none",
    transform: isActive ? "scale(1.25)" : "scale(1)",
    transition: "transform 0.15s ease",
    zIndex: 2,
    padding: 0,
    outline: "none",
  });

  // -- Render ----------------------------------------------------------------

  return (
    <>
      {/* Hidden span for measuring text width */}
      <span
        ref={hiddenSpanRef}
        aria-hidden
        style={{
          ...fontStyle,
          position: "absolute",
          left: -9999,
          top: -9999,
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {text}
      </span>

      {/* Main band container */}
      <div
        className={className}
        style={{
          ...style,
          position: "relative",
          width: sliderWidth,
          height: sliderHeight,
          transform: `rotate(${dynamicRotation}deg)`,
          transition: "transform 0.2s ease",
          userSelect: "none",
        }}
      >
        {/* Border overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: `1.5px solid ${borderColor}`,
            borderRadius: 16,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />

        {/* Clipped text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            padding: `${padTop}px ${padRight}px ${padBottom}px ${padLeft}px`,
            clipPath: `inset(0 ${sliderWidth - right}px 0 ${left}px round 16px)`,
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          <span
            style={{
              ...fontStyle,
              color: textColor,
            }}
          >
            {text}
          </span>
        </div>

        {/* Left handle */}
        <button
          aria-label="Left handle"
          onPointerDown={onPointerDownLeft}
          onKeyDown={onKeyDown("left")}
          style={{
            ...handleStyle(dragging === "left"),
            left: left,
          }}
        >
          <div
            style={{
              width: 4,
              height: 32,
              borderRadius: 2,
              background: handleBarColor,
            }}
          />
        </button>

        {/* Right handle */}
        <button
          aria-label="Right handle"
          onPointerDown={onPointerDownRight}
          onKeyDown={onKeyDown("right")}
          style={{
            ...handleStyle(dragging === "right"),
            left: right - 28,
          }}
        >
          <div
            style={{
              width: 4,
              height: 32,
              borderRadius: 2,
              background: handleBarColor,
            }}
          />
        </button>
      </div>
    </>
  );
}
