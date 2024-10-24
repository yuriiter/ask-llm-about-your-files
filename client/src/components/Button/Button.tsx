import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from "@chakra-ui/react";
import Link from "next/link";
import { forwardRef } from "react";

type ButtonProps = ChakraButtonProps & {
  href?: string;
  variant?: "solid" | "outline" | "ghost" | "link";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ href, children, ...props }, ref) => {
    if (href) {
      return (
        <ChakraButton as={Link} href={href} ref={ref} {...props}>
          {children}
        </ChakraButton>
      );
    }

    return (
      <ChakraButton ref={ref} {...props}>
        {children}
      </ChakraButton>
    );
  },
);

Button.displayName = "Button";
