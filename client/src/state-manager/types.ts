export type Observer<T extends Record<string, unknown>> = (newValue: T) => void;

export type Middleware<T extends Record<string, unknown>> = (
  state: T,
  newValue: T,
) => T;
