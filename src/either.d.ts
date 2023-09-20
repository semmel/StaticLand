import {BinaryCurriedFn, Opaque, PlainObjectOf, TernaryCurriedFn} from './common';
import {Maybe} from "./maybe";

export type Left = Opaque<"Left", void>;
export type Right<T> = Opaque<"Right", T>;
export type Either<T> = Left | Right<T>;

type Applicative<T> = Promise<T>|Maybe<T>|PlainObjectOf<T>;

export function right<A>(a: A): Right<A>;
export function of<A>(a: A): Right<A>;
export function left(e: any): Left;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean, makeLeftValue: (a:A) => B, a: A): Either<A>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean): (makeLeftValue: (a:A) => B, a: A) => Either<A>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean, makeLeftValue: (a:A) => B): (a: A) => Either<A>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean): (makeLeftValue: (a:A) => B) => (a: A) => Either<A>;

export function fromThrowable<A, B>(generate: (a: A) => B): (a: A) => Either<B>;
export function fromThrowable<A, B>(generate: (a: A) => B, a: A): Either<B>;
export function fromThrowable<A1, A2, B>(generate: (a1: A1, a2: A2) => B): (a1: A1, a2: A2) => Either<B>;
/** @deprecated Use FL compliant utility function e.g. R.map */
export function map<T, U>(fn: (x: T) => U, mx: Either<T>): Either<U>;
/** @deprecated Use FL compliant utility function e.g. R.map */
export function map<T, U>(fn: (x: T) => U) : (mx: Either<T>) => Either<U>;

export function bimap<T, U>(fnLeft: (e: any) => any, fn: (x: T) => U): (mx: Either<T>) => Either<U>;

/** @deprecated Use FL compliant utility function e.g. R.chain */
export function chain<T, U>(factory: (x: T) => Either<U>, p: Either<T>) : Either<U>;
/** @deprecated Use FL compliant utility function e.g. R.chain */
export function chain<T, U>(factory: (x: T) => Either<U>): (p: Either<T>) => Either<U>;

export function chainLeft<U>(factory: (e: any) => Either<U>, p: Either<any>) : Either<U>;
export function chainLeft<U>(factory: (e: any) => Either<U>): (p: Either<any>) => Either<U>;

export function either<A, B>(onLeft: (c?: any) => B, onRight: (a: A) => B, m: Either<A>): B;
export function either<A, B>(onLeft: () => B, onRight: (a: A) => B): (m: Either<A>) => B;
export function either<A, B>(onLeft: (c: any) => B, onRight: (a: A) => B): (m: Either<A>) => B;
export function either<B>(onLeft: (c: any) => B): <A>(onRight: (a: A) => B) => (m: Either<A>) => B;

export function isEither(me: any): boolean;
export function isRight(me: Either<any>): boolean;
export function isLeft(me: Either<any>): boolean;

export function join<A>(me: Either<Either<A>>): Either<A>;


export function sequence<A, B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>,
  mfa: Either<Applicative<A>>): Applicative<Either<A>>;
export function sequence<A,B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>):
  (mfa: Either<Applicative<A>>) => Applicative<Either<A>>;

export function traverse<A, B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>,
  effect: (a: A) => Applicative<B>,
  ma: Either<A>): Applicative<Either<B>>;
export function traverse<A, B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>,
  effect: (a: A) => Applicative<B>):
  (ma: Either<A>) => Applicative<Either<B>>;
export function traverse<A, B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>):
  (effect: (a: A) => Applicative<B>,
  ma: Either<A>) => Applicative<Either<B>>;
export function traverse<A, B>(
  ofF: (a: A) => Applicative<A>,
  mapF: (f: (a: A) => B, ma: Applicative<A>) => Applicative<B>):
  (effect: (a: A) => Applicative<B>) =>
    (ma: Either<A>) => Applicative<Either<B>>;
