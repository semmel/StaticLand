
export type Maybe<T> = [T];
export function just<T>(x: T): Maybe<T>;
export function of<T>(x: T): Maybe<T>;
export function nothing<T>(): Maybe<T>;
export function isJust<T>(mx: Maybe<T>): boolean;
export function isNothing<T>(mx: Maybe<T>): boolean;
export function join<T>(mx: Maybe<Maybe<T>>): Maybe<T>;
export declare function equals<T, S>(ma: Maybe<T>, mb: Maybe<S>): boolean;
export declare function equals<T, S>(ma: Maybe<T>) : (mb: Maybe<S>) => boolean;
export function fromNilable<T>(x: (T|undefined|null)): Maybe<T>;
export function fromContentHolding<T extends {length: Number}>(x: T): Maybe<T>;
export declare function getOrElse<T>(acc: T, ma: Maybe<T>) : T;
export declare function getOrElse<T>(acc: T) : (ma: Maybe<T>) => T;
