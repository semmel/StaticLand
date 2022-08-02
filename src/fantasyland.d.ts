import {Functor} from "./common";

// copied in part from the ts branch of ramda
export function chain<A, B, T = never>(fn: (n: A) => readonly B[], list: readonly A[]): B[];
export function chain<A, B, T = never>(fn: (n: A) => readonly B[]): (list: readonly A[]) => B[];
export function chain<A, B, R>(aToMb: (a: A, r: R) => B, Ma: (r: R) => A): (r: R) => B;
export function chain<A, B, R>(aToMb: (a: A, r: R) => B): (Ma: (r: R) => A) => (r: R) => B;

export function map<T, U>(fn: (x: T) => U, list: readonly T[]): U[];
export function map<T, U>(fn: (x: T) => U): (list: readonly T[]) => U[];
export function map<T, U>(fn: (x: T[keyof T & keyof U]) => U[keyof T & keyof U], list: T): U;
export function map<T, U>(fn: (x: T[keyof T & keyof U]) => U[keyof T & keyof U]): (list: T) => U;
export function map<T, U>(fn: (x: T) => U, obj: Functor<T>): Functor<U>;
export function map<T, U>(fn: (x: T) => U): (obj: Functor<T>) => Functor<U>;

export function map<T, U>(fn: (x: T) => U, obj: Promise<T>): Promise<U>;
export function map<T, U>(fn: (x: T) => U): (obj: Promise<T>) => Promise<U>;

export function pluck<K extends keyof T, T>(p: K, list: readonly T[]): Array<T[K]>;
export function pluck<T>(p: number, list: Array<{ [k: number]: T }>): T[];
export function pluck<P extends string>(p: P): <T>(list: Array<Record<P, T>>) => T[];
export function pluck(p: number): <T>(list: Array<{ [k: number]: T }>) => T[];
export function pluck<T>(propertyName: string, mKv: Functor<Record<string, T>>): Functor<T>;
export function pluck(propertyName: string): <T>(mKv: Functor<Record<string, T>>) => Functor<T>;
export function pluck<T>(index: number, mKv: Functor<[T]>): Functor<T>;
export function pluck(index: number): <T>(mKv: Functor<[T]>) => Functor<T>;
