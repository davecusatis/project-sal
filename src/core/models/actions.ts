export interface Action<T> {
  type: T;
}

// export type AsyncAction<T = void> = ThunkAction<T, GlobalState>;
