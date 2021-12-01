export type Left = [any, any];
export type Right<T> = [any, T];
export type Either<T> = Left | Right<T>;

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

export function either<A, B, C>(onLeft: (c: C) => B, onRight: (a: A) => B, m: Either<A>): B;
export function either<A, B, C>(onLeft: (c: C) => B, onRight: (a: A) => B): (m: Either<A>) => B;
export function either<A, B, C>(onLeft: (c: C) => B): (onRight: (a: A) => B) => (m: Either<A>) => B;

export function isEither(me: Either<any>): boolean;
export function isRight(me: Either<any>): boolean;
export function isLeft(me: Either<any>): boolean;
