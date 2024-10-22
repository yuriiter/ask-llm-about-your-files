import { Middleware, Observer } from "./types";

export class Observable<T extends Record<string, unknown>> {
  state: T;
  private subscribers: Map<Observer<T>, (keyof T)[] | undefined> = new Map();
  private middlewares: Middleware<T>[] = [];

  constructor(initialState: T) {
    this.state = initialState;
  }

  subscribe = (newObserver: Observer<T>) => {
    this.subscribers.set(newObserver, undefined);
    return () => this.unsubscribe(newObserver);
  };

  subscribeWithKeys = (keys?: (keyof T)[]) => {
    return (newObserver: Observer<T>) => {
      this.subscribers.set(newObserver, keys);
      return () => this.unsubscribe(newObserver);
    };
  };

  private unsubscribe(observer: Observer<T>) {
    this.subscribers.delete(observer);
  }

  use(middleware: Middleware<T>) {
    this.middlewares.push(middleware);
  }

  getSnapshot = () => this.state;

  set(partialState: Partial<T>) {
    let newState = { ...this.state, ...partialState };

    for (const middleware of this.middlewares) {
      newState = middleware(this.state, newState);
    }

    const keysUpdated = Object.keys(newState).filter((newStateKey) => {
      const value = newState[newStateKey];
      const oldValue = this.state[newStateKey];

      return value !== oldValue;
    }) as (keyof T)[];

    if (keysUpdated.length > 0) {
      for (const keyUpdated of keysUpdated) {
        this.state[keyUpdated] = newState[keyUpdated];
      }

      this.state = { ...this.state };

      const subscribersMapEntries = Array.from(this.subscribers.entries());

      for (const [subscriber, keys] of subscribersMapEntries) {
        if (
          keys === undefined ||
          keysUpdated.some((key) => keys.includes(key))
        ) {
          subscriber({ ...this.state });
        }
      }
    }
  }
}
