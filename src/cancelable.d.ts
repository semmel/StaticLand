export type Cancelable<A> = (res: (a: A) => void, rej: (e: any) => void) => (() => void);

export function addFantasyLandInterface<A>(ca: Cancelable<A>): Cancelable<A>;
export function of<A>(a: A): Cancelable<A>;
export function reject(e: any): Cancelable<any>;
export function never(): Cancelable<any>;

export function later<A>(dt: number, a: A): Cancelable<A>;
export function later<A>(dt: number): (a: A) => Cancelable<A>;

export function laterReject(dt: number, error: any): Cancelable<any>;
export function laterReject(dt: number): (error: any) => Cancelable<any>;

/** @deprecated */
export function fetchResponse({url, spec}: {url: URL|string, spec: RequestInit|{[key: string]: any}}): Cancelable<Response>;

export function fetchResponseIsoModule(spec: WindowOrWorkerGlobalScope): (params: {url: URL|string, init: RequestInit|{[key: string]: any}}) => Cancelable<Response>;

export function cancelify<A>(f: (...args: any[]) => Promise<A>): (...args: any[]) => Cancelable<A>;

// Transformations

export function coalesce<A, B>(onFailure: (e: any) => B, onSuccess: (a?: A) => B, cc: Cancelable<A>): Cancelable<B>;
export function coalesce<A, B>(onFailure: (e: any) => B, onSuccess: (a?: A) => B): (cc: Cancelable<A>) => Cancelable<B>;

export function map<A, B>(fn: (a: A) => B, ma: Cancelable<A>): Cancelable<B>;
export function map<A, B>(fn: (a: A) => B): (ma: Cancelable<A>) => Cancelable<B>;

export function pluck<T>(propertyName: string, mKv: Cancelable<Record<string, T>>): Cancelable<T>;
export function pluck(propertyName: string): <T>(mKv: Cancelable<Record<string, T>>) => Cancelable<T>;
export function pluck<T>(index: number, mKv: Cancelable<[T]>): Cancelable<T>;
export function pluck(index: number): <T>(mKv: Cancelable<[T]>) => Cancelable<T>;

export function biChain<A, B>(fnLeft: (e:any) => Cancelable<B>, fnRight: (x: A) => Cancelable<B>, ma: Cancelable<A>): Cancelable<B>;
export function biChain<A, B>(fnLeft: (e:any) => Cancelable<B>, fnRight: (x: A) => Cancelable<B>): (ma: Cancelable<A>) => Cancelable<B>;
export function biChain<A, B>(fnLeft: (e:any) => Cancelable<B>): (fnRight: (x: A) => Cancelable<B>) => (ma: Cancelable<A>) => Cancelable<B>;

export function chain<A, B>(fn: (x: A) => Cancelable<B>, ma: Cancelable<A>): Cancelable<B>;
export function chain<A, B>(fn: (x: A) => Cancelable<B>): (ma: Cancelable<A>) => Cancelable<B>;

// Side-Effects
export function bi_tap<A>(onFailure: (e: any) => any, onSuccess: (a: A) => any, ma: Cancelable<A>): Cancelable<A>;
export function bi_tap<A>(onFailure: (e: any) => any, onSuccess: (a: A) => any): (ma: Cancelable<A>) => Cancelable<A>;
export function bi_tap<A>(onFailure: (e: any) => any): (onSuccess: (a: A) => any, ma: Cancelable<A>) => Cancelable<A>;
export function bi_tap<A>(onFailure: (e: any) => any): (onSuccess: (a: A) => any) => (ma: Cancelable<A>) => Cancelable<A>;

// Combinations

export function ap<A, B>(mfn: Cancelable<(a: A) => B>, mb: Cancelable<A>): Cancelable<B>;
export function ap<A, B>(mfn: Cancelable<(a: A) => B>): (mb: Cancelable<A>) => Cancelable<B>;

export function liftA2<A, B, C>(f: (a: A) => (b: B) => C, ma: Cancelable<A>, mb: Cancelable<B>): Cancelable<C>;
export function liftA2<A, B, C>(f: (a: A) => (b: B) => C): (ma: Cancelable<A>, mb: Cancelable<B>) => Cancelable<C>;
export function liftA2<A, B, C>(f: (a: A) => (b: B) => C): (ma: Cancelable<A>) => (mb: Cancelable<B>) => Cancelable<C>;

export function liftA3<A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D, ma: Cancelable<A>, mb: Cancelable<B>, mc: Cancelable<C>): Cancelable<D>;
export function liftA3<A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D): (ma: Cancelable<A>, mb: Cancelable<B>, mc: Cancelable<C>) => Cancelable<D>;
export function liftA3<A, B, C, D>(f: (a: A) => (b: B) => (c: C) => D): (ma: Cancelable<A>, mb: Cancelable<B>) => (mc: Cancelable<C>) => Cancelable<D>;

export function liftA4<A, B, C, D, E>(f: (a: A) => (b: B) => (c: C) => (d: D) => E, ma: Cancelable<A>, mb: Cancelable<B>, mc: Cancelable<C>, md: Cancelable<D>): Cancelable<E>;
export function liftA4<A, B, C, D, E>(f: (a: A) => (b: B) => (c: C) => (d: D) => E): (ma: Cancelable<A>, mb: Cancelable<B>, mc: Cancelable<C>, md: Cancelable<D>) => Cancelable<E>;
export function liftA4<A, B, C, D, E>(f: (a: A) => (b: B) => (c: C) => (d: D) => E): (ma: Cancelable<A>, mb: Cancelable<B>, mc: Cancelable<C>) => (md: Cancelable<D>) => Cancelable<E>;

export function race<A>(ma1: Cancelable<A>, ma2: Cancelable<A>): Cancelable<A>;
export function race<A>(ma1: Cancelable<A>): (ma2: Cancelable<A>) => Cancelable<A>;

export function share<A>(ma: Cancelable<A>): Cancelable<A>;
