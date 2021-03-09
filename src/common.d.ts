export type BinaryCurriedFn<S, T, U> = (s: T) => (t: T) => U;
export type TernaryCurriedFn<S, T, U, V> = (s: T) => (t: T) => (u: U) => V;
export type QuaternaryCurriedFn<S, T, U, V, W> = (s: T) => (t: T) => (u: U) => (v: V) => W;
