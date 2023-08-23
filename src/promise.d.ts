import {BinaryCurriedFn} from './common';

export function all<T>(promises: Array<Promise<T>>): Promise<Array<T>>;

export function ap<A, B>(mfn: Promise<(a: A) => B>, mb: Promise<A>): Promise<B>;
export function ap<A, B>(mfn: Promise<(a: A) => B>): (mb: Promise<A>) => Promise<B>;

export function bi_tap<T>(onFailure: (e: any) => void, onSuccess: (t?: T) => any, p: Promise<T>): Promise<T>;
export function bi_tap<T>(onFailure: (e: any) => void, onSuccess: (t?: T) => any): (p: Promise<T>) => Promise<T>;

// coalesce :: (e -> b) -> (a -> b) -> Promise e a -> Promise e b
export function coalesce<A, B>(onFailure: (e: any) => B, onSuccess: (a?: A) => B, p: Promise<A>): Promise<B>;
export function coalesce<A, B>(onFailure: (e: any) => B, onSuccess: (a?: A) => B): (p: Promise<A>) => Promise<B>;

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

export function duplexRace<T>(a: Promise<T>, b: Promise<T>): Promise<T>;
export function duplexRace<T>(a: Promise<T>): (b: Promise<T>) => Promise<T>;

export function later<A>(dt: number, a: A): Promise<A>;
export function later<A>(dt: number): (a: A) => Promise<A>;

/**
 * Makes a binary curried function accept and return Promises Types instead of Types
 */
export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>, ps: Promise<S>, pt: Promise<T>): Promise<U>;
export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>): (ps: Promise<S>, pt: Promise<T>) => Promise<U>;
export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>): (ps: Promise<S>) => (pt: Promise<T>) => Promise<U>;

/**
 * Maps the success value of the Promise to the return value of the function.
 */
export function map<T, U>(fn: (x?: T) => U, p: Promise<T>): Promise<U>;
export function map<T, U>(fn: (x?: T) => U): (p: Promise<T>) => Promise<U>;

export function mapRej<T>(fn: (e: any) => any, p: Promise<T>): Promise<T>;
export function mapRej<T>(fn: (e: any) => any): (p: Promise<T>) => Promise<T>;

export function of<T>(x: T): Promise<T>;

/**
 * calls the function with the success value, ignoring the return value.
 * Useful for side-effects.
 */
export function tap<T>(fn: (x?: T) => any, p: Promise<T>): Promise<T>;
export function tap<T>(fn: (x?: T) => any): (p: Promise<T>) => Promise<T>;

export function tapRegardless<T>(fn: (x?: T) => any, p: Promise<T>): Promise<T>;
export function tapRegardless<T>(fn: (x?: T) => any): (p: Promise<T>) => Promise<T>;

export function reject(payload: any): Promise<any>;
