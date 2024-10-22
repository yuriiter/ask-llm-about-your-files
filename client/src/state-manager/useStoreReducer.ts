import { Dispatch, Reducer, useCallback, useSyncExternalStore } from "react";
import { Observable } from "./Observable";

export function useStoreReducer<S extends Record<string, unknown>, A>(
  store: Observable<S>,
  reducer: Reducer<S, A>,
  keys?: (keyof S)[],
) {
  const state = useSyncExternalStore(
    store.subscribeWithKeys(keys),
    store.getSnapshot,
  );

  const dispatch: Dispatch<A> = useCallback(
    (action: A) => {
      const newState = reducer(store.state, action);
      store.set(newState);
    },
    [reducer, store],
  );

  return [state, dispatch] as const;
}
