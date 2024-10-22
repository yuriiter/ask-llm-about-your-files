import { CSSProperties, ElementType, PropsWithChildren } from "react";
import { StyledObject } from "styled-components";
import { PolymorphicComponentProps } from "./polymorphicProps";

export type PropsWithClassName = {
  className?: string;
};

export type PropsWithSx = {
  sx?: StyledObject;
};

export type StandardProps = PropsWithChildren &
  PropsWithClassName &
  PropsWithSx & { style?: CSSProperties };

export type BoxProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  PropsWithClassName & PropsWithSx
>;
