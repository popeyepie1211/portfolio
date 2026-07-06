import React, { useState } from "react";
import { motion } from "framer-motion";

interface HoverHighlighterProps {
  text: string;
  textColor?: string;
  penColor?: string;
  penOpacity?: number; // 0-100
  penLeft?: number; // extra px on left
  penRight?: number; // extra px on right
  penHeight?: number; // % of text height
  penOffset?: number; // px from bottom
  penRadius?: number; // border-radius
  href?: string; // optional link
  transition?: object; // framer-motion transition
  font?: {
    fontFamily?: string;
    fontWeight?: number | string;
    fontSize?: string;
    lineHeight?: string;
    letterSpacing?: string;
    textAlign?: "left" | "center" | "right";
  };
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode; // alternative to text prop
}

const defaultFont = {
  fontFamily: "inherit",
  fontWeight: "inherit" as string | number,
  fontSize: "inherit",
  lineHeight: "inherit",
  letterSpacing: "inherit",
  textAlign: "left" as const,
};

const defaultTransition = {
  type: "tween",
  duration: 0.5,
  ease: [0.25, 1, 0.5, 1],
};

// ── Alignment helper ──────────────────────────────────────────────────
function alignItemsFor(textAlign: "left" | "center" | "right"): string {
  switch (textAlign) {
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "flex-start";
  }
}

// ── Pen stroke (animated highlight bar) ───────────────────────────────
interface PenStrokeProps {
  isHovered: boolean;
  penColor: string;
  penOpacity: number;
  penLeft: number;
  penRight: number;
  penHeight: number;
  penOffset: number;
  penRadius: number;
  transition: object;
}

function PenStroke({
  isHovered,
  penColor,
  penOpacity,
  penLeft,
  penRight,
  penHeight,
  penOffset,
  penRadius,
  transition,
}: PenStrokeProps) {
  const colorLight = `color-mix(in srgb, ${penColor} ${penOpacity}%, transparent)`;
  const colorDark = penColor;
  const background = `linear-gradient(to right, ${colorLight} 0%, ${colorLight} calc(100% - 8px), ${colorDark} calc(100% - 8px), ${colorDark} 100%)`;
  const targetWidth = `calc(100% + ${penLeft + penRight}px)`;

  return (
    <motion.div
      initial={false}
      animate={{ width: isHovered ? targetWidth : "0%" }}
      transition={transition}
      style={{
        position: "absolute",
        bottom: penOffset,
        left: `-${penLeft}px`,
        height: `${penHeight}%`,
        zIndex: 0,
        borderRadius: penRadius,
        background,
        pointerEvents: "none",
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────
export function HoverHighlighter(props: HoverHighlighterProps) {
  const {
    text = "",
    textColor = "#f4f4f5",
    penColor = "#8b5cf6",
    penOpacity = 40,
    penLeft = 4,
    penRight = 4,
    penHeight = 45,
    penOffset = 2,
    penRadius = 2,
    href,
    transition = defaultTransition,
    font: fontProp,
    style,
    className,
    children,
  } = props;

  const [isHovered, setIsHovered] = useState(false);
  const font = { ...defaultFont, ...fontProp };

  // Shared pen-stroke props
  const strokeProps: PenStrokeProps = {
    isHovered,
    penColor,
    penOpacity,
    penLeft,
    penRight,
    penHeight,
    penOffset,
    penRadius,
    transition,
  };

  // ── Render content ────────────────────────────────────────────────
  let content: React.ReactNode;

  if (children) {
    // Simple single-wrapper mode for arbitrary children
    content = (
      <span
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
        <PenStroke {...strokeProps} />
      </span>
    );
  } else {
    // Multiline text mode – split on \n
    const lines = text.split("\n");

    content = lines.map((line, i) => (
      <span
        key={i}
        style={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-block",
            whiteSpace: "pre",
          }}
        >
          {line}
        </span>
        <PenStroke {...strokeProps} />
      </span>
    ));
  }

  // ── Container styles ──────────────────────────────────────────────
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: alignItemsFor(font.textAlign),
    cursor: "pointer",
    overflow: "visible",
    textDecoration: "none",
    color: textColor,
    fontFamily: font.fontFamily,
    fontWeight: font.fontWeight,
    fontSize: font.fontSize,
    lineHeight: font.lineHeight,
    letterSpacing: font.letterSpacing,
    ...style,
  };

  const sharedProps = {
    className,
    style: containerStyle,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  if (href) {
    return (
      <a href={href} {...sharedProps}>
        {content}
      </a>
    );
  }

  return <div {...sharedProps}>{content}</div>;
}
