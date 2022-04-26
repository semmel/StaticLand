type ES5Collection<T> = Array<T> | { [key: string]: T };

export type Map<A, B, FA, FB> = (a2b: (a: A) => B) => (fx: FA) => FB;
export type Lens<X, S, FX, FS> = (map_f: Map<X, S, FX, FS>) => (x2Fy: (x: X) => FX) => (target: S) => FS;
export type ComposableLens<X, S, FX, FS> = (x2Fy: (x:X) => FX) => (target: S) => FS;

export function lens<A, S>(getter: (sa: S) => A, setter: (a: A, sa: S) => S): Lens<A, S, any, any>;
export function propertyLens(key: string): Lens<any, any, ES5Collection<any>, ES5Collection<any>>;
export function indexLens(index: number): Lens<any, any, ES5Collection<any>, ES5Collection<any>>;

export function makeComposableOverLens<X, S, FX, FS>(lens: Lens<X, S, FX, FS>): ComposableLens<X, S, FX, FS>;
export function makeComposableViewLens<X, S, FX, FS>(lens: Lens<X, S, FX, FS>): ComposableLens<X, S, FX, FS>;
export function makeComposableSequenceLens<X, S, FX, FS>(lens: Lens<X, S, FX, FS>, map_f: Map<X, S, FX, FS>): ComposableLens<X, S, FX, FS>;
export function makeComposableSequenceLens<X, S, FX, FS>(lens: Lens<X, S, FX, FS>): (map_f: Map<X, S, FX, FS>) => ComposableLens<X, S, FX, FS>;

export function over<A, S>(cL: ComposableLens<A, S, any, any>, x2x: (a:A) => A, target: S): S;
export function over<A, S>(cL: ComposableLens<A, S, any, any>): (x2x: (a:A) => A, target: S) => S;
export function over<A, S>(cL: ComposableLens<A, S, any, any>, x2x: (a:A) => A): (target: S) => S;
export function over<A, S>(cL: ComposableLens<A, S, any, any>): (x2x: (a:A) => A) => (target: S) => S;

export function set<A, S>(cL: ComposableLens<A, S, any, any>, a: A, target: S): S;
export function view<A, S>(cL: ComposableLens<A, S, any, any>, target: S): A;
export function view<A, S>(cL: ComposableLens<A, S, any, any>):  (target: S) => A;
export function sequence<A, S>(lens: ComposableLens<A, S, A, any>, target: S): A;
export function sequence<A, S>(lens: ComposableLens<A, S, A, any>): (target: S) => A;

export function composeFocus<X, S, FX, FS>(lenses: Array<Lens<X, S, FX, FS>>): ComposableLens<X, S, FX, FS>;
export function composeOptics<X, S, FX, FS>(lenses: Array<Lens<X, S, FX, FS>>): ComposableLens<X, S, FX, FS>;
