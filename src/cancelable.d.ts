export type Cancelable<A> = (res: (a: A) => void, rej: (e: any) => void) => (() => void);

export function of<A>(a: A): Cancelable<A>;
export function reject(e: any): Cancelable<any>;

export function later<A>(dt: number, a: A): Cancelable<A>;
export function later<A>(dt: number): (a: A) => Cancelable<A>;

export function laterReject(dt: number, error: any): Cancelable<any>;
export function laterReject(dt: number): (error: any) => Cancelable<any>;

/** @deprecated */
export function fetchResponse({url, spec}: {url: URL|string, spec: RequestInit|{[key: string]: any}}): Cancelable<Response>;

export function fetchResponseIsoModule(spec: WindowOrWorkerGlobalScope): (params: {url: URL|string, init: RequestInit|{[key: string]: any}}) => Cancelable<Response>;

export function cancelify<A>(f: (...args: any[]) => Promise<A>): (...args: any[]) => Cancelable<A>;

// Transformations

export function map<A, B>(fn: (a: A) => B, ma: Cancelable<A>): Cancelable<B>;
export function map<A, B>(fn: (a: A) => B): (ma: Cancelable<A>) => Cancelable<B>;

export function chain<A, B>(fn: (x: A) => Cancelable<B>, ma: Cancelable<A>): Cancelable<B>;
export function chain<A, B>(fn: (x: A) => Cancelable<B>): (ma: Cancelable<A>) => Cancelable<B>;

// Combinations

export function ap<A, B>(mfn: Cancelable<(a: A) => B>, mb: Cancelable<A>): Cancelable<B>;
export function ap<A, B>(mfn: Cancelable<(a: A) => B>): (mb: Cancelable<A>) => Cancelable<B>;

export function liftA2<A, B, C>(f: (a: A) => (b: B) => C, ma: Cancelable<A>, mb: Cancelable<B>): Cancelable<C>;
export function liftA2<A, B, C>(f: (a: A) => (b: B) => C): (ma: Cancelable<A>, mb: Cancelable<B>) => Cancelable<C>;
export function liftA2<A, B, C>(f: (a: A) => (b: B) => C): (ma: Cancelable<A>) => (mb: Cancelable<B>) => Cancelable<C>;

export function race<A>(ma1: Cancelable<A>, ma2: Cancelable<A>): Cancelable<A>;
export function race<A>(ma1: Cancelable<A>): (ma2: Cancelable<A>) => Cancelable<A>;
