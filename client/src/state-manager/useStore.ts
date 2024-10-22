import { useCallback, useSyncExternalStore } from "react";
import { Observable } from "./Observable";

type SetStateAction<S> = S | Partial<S> | ((prevState: S) => Partial<S>);

export function useStore<S extends Record<string, unknown>>(
  store: Observable<S>,
  keys?: (keyof S)[],
) {
  const state = useSyncExternalStore(
    store.subscribeWithKeys(keys),
    store.getSnapshot,
  );

  const updateState = useCallback(
    (action: SetStateAction<S>) => {
      const newState =
        typeof action === "function" ? action(store.getSnapshot()) : action;
      store.set(newState);
    },
    [store],
  );

  return [state, updateState] as const;
}
