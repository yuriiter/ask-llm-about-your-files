import Link from "next/link";
import { Ref, forwardRef } from "react";
import { cn } from "../../utils/utils";
import styles from "./Button.module.scss";
import { ButtonBase, ButtonBaseProps } from "./ButtonBase";

type ButtonVariant = "blurry" | "gradient" | "solid" | "regular";

type ButtonProps<C extends "button" | typeof Link> = ButtonBaseProps<C> & {
  variant?: ButtonVariant;
};

const NotForwardedButton = <C extends "button" | typeof Link>(
  { variant = "solid", className, ...baseProps }: ButtonProps<C>,
  ref: Ref<HTMLElement>,
) => {
  return (
    <ButtonBase
      {...(baseProps as ButtonBaseProps<"button" | typeof Link>)}
      className={cn("Button", className, styles.root, styles[variant])}
      ref={ref}
    />
  );
};

export const Button = forwardRef(NotForwardedButton);

Button.displayName = "Button";
