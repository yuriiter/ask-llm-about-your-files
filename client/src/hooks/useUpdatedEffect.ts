import { useEffect, useRef } from "react";

export const useUpdatedEffect: typeof useEffect = (cb, depArray) => {
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    return cb();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, depArray);
};
