export type Left = [any, any];
export type Right<T> = [any, T];
export type Either<T> = Left | Right<T>;

export function map<T, U>(fn: (x: T) => U, mx: Either<T>): Either<U>;
export function map<T, U>(fn: (x: T) => U) : (mx: Either<T>) => Either<U>;

export function chain<T, U>(factory: (x: T) => Either<U>, p: Either<T>) : Either<U>;
export function chain<T, U>(factory: (x: T) => Either<U>): (p: Either<T>) => Either<U>;
