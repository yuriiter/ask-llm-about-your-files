/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";

export const useEvent = (
  target: Window | Document | Element | undefined,
  event: string | string[],
  callback: (e: any) => void,
  once = false,
  dependencyArray?: Array<unknown>,
) => {
  useEffect(
    () => {
      if (target === undefined) return;
      const events = Array.isArray(event) ? event : [event];

      const localCallback = (e: any) => {
        callback(e);
        if (once) {
          events.forEach((ev) => {
            target.removeEventListener(ev, localCallback);
          });
        }
      };

      events.forEach((ev) => {
        target.addEventListener(ev, localCallback);
      });

      return () => {
        events.forEach((ev) => {
          target.removeEventListener(ev, localCallback);
        });
      };
    },
    dependencyArray ?? [target],
  );
};
