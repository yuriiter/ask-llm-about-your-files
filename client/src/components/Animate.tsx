import { PolymorphicComponentProps } from "@/types/polymorphicProps";
import { PropsWithClassName, PropsWithSx } from "@/types/props";
import { cn } from "@/utils/utils";
import {
  ElementType,
  Ref,
  forwardRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { IntersectionOptions, useInView } from "react-intersection-observer";
import { Box } from "./Box";

type AnimateProps<C extends ElementType> = PolymorphicComponentProps<
  C,
  PropsWithClassName &
    PropsWithSx &
    IntersectionOptions & {
      hasBeenVisibleClassName?: string;
      hasntBeenVisibleClassName?: string;
      inViewClassName?: string;
      offViewClassName?: string;
      onViewChange?: (inView: boolean) => void;
    }
>;

const NotForwardedAnimate = <C extends ElementType = "div">(
  {
    hasBeenVisibleClassName,
    hasntBeenVisibleClassName,
    inViewClassName,
    offViewClassName,
    onViewChange,
    threshold = 0.3,
    root,
    rootMargin = "-100px",
    triggerOnce = true,
    ...rest
  }: AnimateProps<C>,
  ref: Ref<HTMLElement>,
) => {
  const { ref: inViewRef, inView } = useInView({
    threshold,
    root,
    rootMargin,
    triggerOnce,
  });
  const [hasBeenVisible, setHasBeenVisible] = useState(inView);

  useEffect(() => {
    onViewChange?.(inView);
    if (inView) {
      setHasBeenVisible(true);
    }
  }, [inView, onViewChange]);

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && "current" in ref) {
        (ref as any).current = node;
      }
      inViewRef(node);
    },
    [inViewRef, ref],
  );

  return (
    <Box
      ref={setRefs}
      {...rest}
      className={cn(
        rest.className,
        hasBeenVisible ? hasBeenVisibleClassName : hasntBeenVisibleClassName,
        inView ? inViewClassName : offViewClassName,
      )}
    />
  );
};

export const Animate = forwardRef(NotForwardedAnimate);

Animate.displayName = "Animate";
