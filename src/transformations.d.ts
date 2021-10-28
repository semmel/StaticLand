import {EventStream, Observable } from "baconjs";
import {Maybe} from "./maybe";
import {Cancelable} from "./cancelable";
import {Either} from "./either";
import {PlainObject} from "./common";

export function cancelableToEventStream<A>(ca: Cancelable<A>): EventStream<A>;
export function cancelableToPromise<A>(ca: Cancelable<A>): Promise<A>;

export function eitherToCancelable<A>(ma: Either<A>): Cancelable<A>;

/**
 * @deprecated
 * use lens/view(sequence(maybe/map, indexLens(n)))(obj)
 */
export function keyMaybeToMaybeObj(key: string, moa: PlainObject): Maybe<PlainObject>;
/**
 * @deprecated
 * use lens/view(sequence(maybe/map, indexLens(n)))(obj)
 */
export function keyMaybeToMaybeObj(key: string): (moa: PlainObject) => Maybe<PlainObject>;
/**
 * @deprecated
 * use lens/view(sequence(maybe/map, indexLens(n)))(obj)
 */
export function keyMaybeToMaybeObj(index: number, maa: Array<any>): Maybe<Array<any>>;
/**
 * @deprecated
 * use lens/view(sequence(maybe/map, indexLens(n)))(obj)
 */
export function keyMaybeToMaybeObj(index: number): (maa: Array<any>) => Maybe<Array<any>>;

export function maybeOfBaconObservableToBaconObservableOfMaybe<A>(mma: Maybe<Observable<A>>): EventStream<Maybe<A>>;

export function maybeOfCancelableToCancelableOfMaybe<A>(mma: Maybe<Cancelable<A>>) : Cancelable<Maybe<A>>;

export function promiseToCancelable<A>(p: Promise<A>): Cancelable<A>;
