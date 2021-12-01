import {Either} from './either';
import {Maybe} from "./maybe";
import {Cancelable} from "./cancelable";
type Applicative<T> = Cancelable<T>|Promise<T>|Either<T>|Maybe<T>;

export function find<A>(predicate:(a: A) => boolean, list: Array<A>): Maybe<A>;
export function find<A>(predicate:(a: A) => boolean): (list: Array<A>) => Maybe<A>;

export function map<A, B>(a2b: (a: A) => B, ma: [A]): [B];
export function map<A, B>(a2b: (a: A) => B): (ma: [A]) => [B];

export function sequence<A, B, C>(
  ofF: (a: A) => Applicative<A>,
  liftA2: (f: (a: A) => (b: B) => C) => (ma: Applicative<A>, mb: Applicative<B>) => Applicative<C>,
  mfa: Array<Applicative<A>>): Applicative<Array<A>>;

export function sequence<A,B,C>(
  ofF: (a: A) => Applicative<A>,
  liftA2: (f: (a: A) => (b: B) => C) => (ma: Applicative<A>, mb: Applicative<B>) => Applicative<C>):
  (mfa: Array<Applicative<A>>) => Applicative<Array<A>>;


//((a → f a), ((a → b → c) → f a → f b → f c) → (a → f b) → [a] → f [b]
export function traverse<A, B, C>(
  ofF: (a: A) => Applicative<A>,
  liftA2: (f: (a: A) => (b: B) => C) => (ma: Applicative<A>, mb: Applicative<B>) => Applicative<C>,
  effect: (a: A) => Applicative<B>,
  ma: Array<A>)
  : Applicative<Array<A>>;

export function traverse<A, B, C>(
  ofF: (a: A) => Applicative<A>,
  liftA2: (f: (a: A) => (b: B) => C) => (ma: Applicative<A>, mb: Applicative<B>) => Applicative<C>,
  effect: (a: A) => Applicative<B>)
  : (ma: Array<A>) => Applicative<Array<A>>;

export function traverse<A, B, C>(
  ofF: (a: A) => Applicative<A>,
  liftA2: (f: (a: A) => (b: B) => C) => (ma: Applicative<A>, mb: Applicative<B>) => Applicative<C>):
  (effect: (a: A) => Applicative<B>) =>
  (ma: Array<A>) => Applicative<Array<A>>;
