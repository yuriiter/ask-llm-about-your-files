import { Dispatch, Middleware, UnknownAction } from "redux";

const SAVE_DELAY = 10_000;

export const saveToLocalStorage: Middleware<
  object,
  unknown,
  Dispatch<UnknownAction>
> = (store) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (next) => (action) => {
    const result = next(action);

    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(
      () =>
        window.localStorage.setItem(
          "appState",
          JSON.stringify(store.getState()),
        ),
      SAVE_DELAY,
    );
    return result;
  };
};
