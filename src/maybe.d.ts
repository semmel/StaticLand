import {BinaryCurriedFn, PlainObjectOf, TernaryCurriedFn} from './common';
import {Either} from './either';

export type Just<T> = [T];
export type Nothing = [];
//export type Maybe<T> = Just<T> | Nothing;
export interface Maybe<T> extends Array<T>{}
type Applicative<T> = Promise<T>|Either<T>|PlainObjectOf<T>;

/**
 * creates a Just of the value
 */
export function just<T>(x: T): Just<T>;

/**
 * alias for just
 */
export function of<T>(x: T): Just<T>;

/**
 * Creates a Nothing
 */
export function nothing(): Nothing;

/**
 * returns `true` if the Maybe is a Just
 */
export function isJust<T>(mx: Maybe<T>): boolean;
export function isNothing<T>(mx: Maybe<T>): boolean;
export function join<T>(mx: Maybe<Maybe<T>>): Maybe<T>;
export function equals<T, S>(ma: Maybe<T>, mb: Maybe<S>): boolean;
export function equals<T, S>(ma: Maybe<T>) : (mb: Maybe<S>) => boolean;
export function fromNilable<T>(x: (T|undefined|null)): Maybe<T>;
export function fromPredicate<T>(pred: (x: T) => boolean, x: T): Maybe<T>;
export function fromPredicate<T>(pred: (x: T) => boolean): (x: T) => Maybe<T>;
export function fromContentHolding<T extends {length: Number}>(x: T): Maybe<T>;
export function getOrElse<T>(acc: T, ma: Maybe<T>) : T;
export function getOrElse<T>(acc: T) : (ma: Maybe<T>) => T;
export function map<T, U>(fn: (x: T) => U, mx: Maybe<T>): Maybe<U>;
export function map<T, U>(fn: (x: T) => U) : (mx: Maybe<T>) => Maybe<U>;

export function chain<T, U>(factory: (x: T) => Maybe<U>, p: Maybe<T>) : Maybe<U>;
export function chain<T, U>(factory: (x: T) => Maybe<U>): (p: Maybe<T>) => Maybe<U>;

export function sequence<A, B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>,
  mfa: Maybe<Applicative<A>>): Applicative<Maybe<A>>;
export function sequence<A,B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>):
  (mfa: Maybe<Applicative<A>>) => Applicative<Maybe<A>>;

export function tap<T>(fn: (x: T) => any, p: Maybe<T>): Maybe<T>;
export function tap<T>(fn: (x: T) => any): (p: Maybe<T>) => Maybe<T>;

export function biTap<T>(onNothing: () => any, onJust: (x: T) => any, p: Maybe<T>): Maybe<T>;
export function biTap<T>(onNothing: () => any, onJust: (x: T) => any): (p: Maybe<T>) => Maybe<T>;

export function maybe<S, T, U>(onNothing: () => S, onJust: (x: T) => U, mx: Maybe<T>): S|U;
export function maybe<S, T, U>(onNothing: () => S): (onJust: (x: T) => U, mx: Maybe<T>) => S|U;
export function maybe<S, T, U>(onNothing: () => S, onJust: (x: T) => U): (mx: Maybe<T>) => S|U;
export function maybe<S, T, U>(onNothing: () => S): (onJust: (x: T) => U) => (mx: Maybe<T>) => S|U;

export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>): (ps: Maybe<S>, pt: Maybe<T>) => Maybe<U>;
export function liftA2<S, T, U>(fn: BinaryCurriedFn<S, T, U>): (ps: Maybe<S>) => (pt: Maybe<T>) => Maybe<U>;

export function liftA3<S, T, U, V>(fn: TernaryCurriedFn<S, T, U, V>): (ps: Maybe<S>, pt: Maybe<T>, pu: Maybe<U>) => Maybe<V>;
export function liftA3<S, T, U, V>(fn: TernaryCurriedFn<S, T, U, V>): (ps: Maybe<S>) => (pt: Maybe<T>) => (pu: Maybe<U>) => Maybe<V>;

export function lift<T>(fn: (...args: any[]) => T): (...mxs: Maybe<any>) => Maybe<T>;

export function typeString(mx: Maybe<any>): string;
