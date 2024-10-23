import React from "react";

type BoxIconType = "regular" | "solid" | "logo";
type BoxIconRotation = "90" | "180" | "270";
type BoxIconFlip = "horizontal" | "vertical";
type BoxIconBorder = "square" | "circle";
type BoxIconAnimation =
  | "spin"
  | "tada"
  | "flashing"
  | "burst"
  | "fade-left"
  | "fade-right"
  | "fade-up"
  | "fade-down"
  | "spin-hover"
  | "tada-hover"
  | "flashing-hover"
  | "burst-hover"
  | "fade-left-hover"
  | "fade-right-hover"
  | "fade-up-hover"
  | "fade-down-hover";
type BoxIconPull = "left" | "right";
type BoxIconSize = "xs" | "sm" | "md" | "lg" | number;

interface BoxIconProps {
  type?: BoxIconType;
  name: string;
  color?: string;
  size?: BoxIconSize;
  rotate?: BoxIconRotation;
  flip?: BoxIconFlip;
  border?: BoxIconBorder;
  animation?: BoxIconAnimation;
  pull?: BoxIconPull;
  className?: string;
  style?: React.CSSProperties;
}

export const BoxIcon: React.FC<BoxIconProps> = ({
  type = "regular",
  name,
  color,
  size,
  rotate,
  flip,
  border,
  animation,
  pull,
  className = "",
  style = {},
}) => {
  const getTypePrefix = (type: BoxIconType): string => {
    switch (type) {
      case "solid":
        return "bxs";
      case "logo":
        return "bxl";
      default:
        return "bx";
    }
  };

  const getSizeClass = (size: BoxIconSize | undefined): string => {
    if (!size) return "";
    return typeof size === "number" ? "" : `bx-${size}`;
  };

  const classes = [
    "bx",
    `${getTypePrefix(type)}-${name}`,
    getSizeClass(size),
    rotate && `bx-rotate-${rotate}`,
    flip && `bx-flip-${flip}`,
    border && `bx-border${border === "circle" ? "-circle" : ""}`,
    animation && `bx-${animation}`,
    pull && `bx-pull-${pull}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(color && { color }),
    ...(typeof size === "number" && { fontSize: `${size}px` }),
  };

  return <i className={classes} style={combinedStyle} />;
};

export default BoxIcon;

export type {
  BoxIconType,
  BoxIconRotation,
  BoxIconFlip,
  BoxIconBorder,
  BoxIconAnimation,
  BoxIconPull,
  BoxIconSize,
  BoxIconProps,
};
