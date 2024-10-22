import { StandardProps } from "@/types/props";
import { cn } from "@/utils/utils";
import Link from "next/link";
import { ComponentPropsWithoutRef, Ref, forwardRef } from "react";
import { Box } from "../Box";

export type ButtonBaseProps<C extends "button" | typeof Link> = StandardProps &
  ComponentPropsWithoutRef<C>;

const NotForwardedButtonBase = <C extends "button" | typeof Link>(
  props: ButtonBaseProps<C>,
  ref: Ref<HTMLElement>,
) => {
  return (
    <Box
      component={"to" in props || "href" in props ? Link : "button"}
      {...props}
      ref={ref}
      className={cn("ButtonBase", props.className)}
    />
  );
};

export const ButtonBase = forwardRef(NotForwardedButtonBase);

ButtonBase.displayName = "ButtonBase";
