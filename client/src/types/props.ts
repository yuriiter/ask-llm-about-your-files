import { CSSProperties, ElementType, PropsWithChildren } from "react";
import { PolymorphicComponentProps } from "./polymorphicProps";

export type PropsWithClassName = {
  className?: string;
};

export type StandardProps = PropsWithChildren &
  PropsWithClassName & { style?: CSSProperties };

export type BoxProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  PropsWithClassName
>;
