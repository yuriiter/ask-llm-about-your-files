import { Observable } from "./Observable";

export const createStore = <S extends Record<string, unknown>>(
  initialValue: S,
) => {
  const newStore = new Observable<S>(initialValue);

  return newStore;
};
