import {Either} from './either';
import {Maybe} from "./maybe";
type Applicative<T> = Promise<T>|Either<T>|Maybe<T>;

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
