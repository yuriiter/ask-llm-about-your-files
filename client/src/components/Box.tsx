"use client";
import { ElementType, Ref, forwardRef } from "react";
import styled from "styled-components";
import { BoxProps, PropsWithSx } from "../types/props";

const NotStyledBox = <C extends ElementType = "div">(
  props: BoxProps<C>,
  ref: Ref<HTMLElement>,
) => {
  const { component, sx, ...rest } = props;

  const Component = component ?? "div";

  return <Component ref={ref} {...rest} />;
};

const ForwardedNotStyledBox = forwardRef(NotStyledBox);

ForwardedNotStyledBox.displayName = "Box";

export const Box = styled(ForwardedNotStyledBox).withConfig({
  shouldForwardProp: (prop) => prop !== "sx",
})<PropsWithSx>(({ sx }) => sx);
