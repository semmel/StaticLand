export type BinaryCurriedFn<S, T, U> = (s: T) => (t: T) => U;
export type TernaryCurriedFn<S, T, U, V> = (s: T) => (t: T) => (u: U) => V;
export type QuaternaryCurriedFn<S, T, U, V, W> = (s: T) => (t: T) => (u: U) => (v: V) => W;

export type Function0<R> = () => R;
export type Function1<T1, R> = (t1: T1) => R;
export type Function2<T1, T2, R> = (t1: T1, t2: T2) => R;
export type Function3<T1, T2, T3, R> = (t1: T1, t2: T2, t3: T3) => R;
export type Function4<T1, T2, T3, T4, R> = (t1: T1, t2: T2, t3: T3, t4: T4) => R;
export type Function5<T1, T2, T3, T4, T5, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => R;
export type Function6<T1, T2, T3, T4, T5, T6, R> = (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => R;
