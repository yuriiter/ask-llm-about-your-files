import { useSyncExternalStore } from "react";

type Colorscheme = "dark" | "light";

const getColorScheme = (): Colorscheme => {
  const colorscheme =
    typeof document !== "undefined"
      ? document.body.getAttribute("data-colorscheme")
      : "light";
  return colorscheme === "dark" ? "dark" : "light";
};

const subscribe = (callback: () => void) => {
  const observer = new MutationObserver(() => callback());

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-colorscheme"],
  });

  return () => observer.disconnect();
};

export const useColorscheme = () => {
  const colorScheme = useSyncExternalStore(
    subscribe,
    getColorScheme,
    getColorScheme,
  );

  const setColorScheme = (newScheme: Colorscheme) => {
    document.body.setAttribute("data-colorscheme", newScheme);
  };

  return [colorScheme, setColorScheme] as const;
};
