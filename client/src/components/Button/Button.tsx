import { Button as AntButton } from "antd";
import { ButtonProps as AntButtonProps } from "antd/lib/button";
import Link from "next/link";

type ButtonProps = AntButtonProps & {
  href?: string;
};

export const Button = ({ href, children, ...props }: ButtonProps) => {
  if (href) {
    return (
      <Link href={href} passHref>
        <AntButton {...props}>{children}</AntButton>
      </Link>
    );
  }

  return <AntButton {...props}>{children}</AntButton>;
};
