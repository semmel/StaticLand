import {BinaryCurriedFn, Opaque, PlainObjectOf, TernaryCurriedFn} from './common';
import {Maybe} from "./maybe";

export type Left<T> = Opaque<"Either", T>;
export type Right<T> = Opaque<"Either", T>;
export type Either<T> = Opaque<"Either", T>;

type Applicative<T> = Promise<T>|Maybe<T>|PlainObjectOf<T>;

export function right<A>(a: A): Either<A>;
export function of<A>(a: A): Either<A>;
export function left(e: any): Either<any>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean, makeLeftValue: (a:A) => B, a: A): Either<A>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean): (makeLeftValue: (a:A) => B, a: A) => Either<A>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean, makeLeftValue: (a:A) => B): (a: A) => Either<A>;
export function fromAssertedValue<A, B>(predicate: (a:A) => boolean): (makeLeftValue: (a:A) => B) => (a: A) => Either<A>;

export function map<T, U>(fn: (x: T) => U, mx: Either<T>): Either<U>;
export function map<T, U>(fn: (x: T) => U) : (mx: Either<T>) => Either<U>;

export function chain<T, U>(factory: (x: T) => Either<U>, p: Either<T>) : Either<U>;
export function chain<T, U>(factory: (x: T) => Either<U>): (p: Either<T>) => Either<U>;

export function either<A, B>(onLeft: (c?: any) => B, onRight: (a: A) => B, m: Either<A>): B;
export function either<A, B>(onLeft: () => B, onRight: (a: A) => B): (m: Either<A>) => B;
export function either<A, B>(onLeft: (c: any) => B, onRight: (a: A) => B): (m: Either<A>) => B;
export function either<B>(onLeft: (c: any) => B): <A>(onRight: (a: A) => B) => (m: Either<A>) => B;

export function isEither(me: Either<any>): boolean;
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
