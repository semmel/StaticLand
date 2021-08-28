import {BinaryCurriedFn} from './common';

export function all<T>(promises: Array<Promise<T>>): Promise<Array<T>>;

/**
 * Produce a Promise from the factory function and the resolution value of the promise
 */
export function chain<T, U>(factory: (x?: T) => Promise<U>, p: Promise<T>) : Promise<U>;
export function chain<T, U>(factory: (x?: T) => Promise<U>): (p: Promise<T>) => Promise<U>;

// chainRej :: (e -> Promise g a) -> Promise e a -> Promise g b
export function chainRej<T>(onError: (e: any) => Promise<T>, p: Promise<T>) : Promise<T>;
export function chainRej<T>(onError: (e: any) => Promise<T>): (p: Promise<T>) => Promise<T>;

export function chainTap<T>(fn: (x?: T) => Promise<any>, p: Promise<T>): Promise<T>;
export function chainTap<T>(fn: (x?: T) => Promise<any>): (p: Promise<T>) => Promise<T>;

export function later<A>(dt: number, a: A): Promise<A>;
export function later<A>(dt: number): (a: A) => Promise<A>;

/**
 * Makes a binary curried function accept and return Promises Types instead of Types
 */
export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>): (ps: Promise<S>, pt: Promise<T>) => Promise<U>;
export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>): (ps: Promise<S>) => (pt: Promise<T>) => Promise<U>;

/**
 * Maps the success value of the Promise to the return value of the function.
 */
export function map<T, U>(fn: (x?: T) => U, p: Promise<T>): Promise<U>;
export function map<T, U>(fn: (x?: T) => U): (p: Promise<T>) => Promise<U>;

/**
 * calls the function with the success value, ignoring the return value.
 * Useful for side-effects.
 */
export function tap<T>(fn: (x?: T) => any, p: Promise<T>): Promise<T>;
export function tap<T>(fn: (x?: T) => any): (p: Promise<T>) => Promise<T>;
