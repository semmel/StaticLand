import {EventStream, Observable } from "baconjs";
import {Maybe} from "./maybe";
import {Cancelable} from "./cancelable";
import {Either} from "./either";

export function cancelableToEventStream<A>(ca: Cancelable<A>): EventStream<A>;
export function cancelableToPromise<A>(ca: Cancelable<A>): Promise<A>;

export function eitherToCancelable<A>(ma: Either<A>): Cancelable<A>;

export function maybeOfBaconObservableToBaconObservableOfMaybe<A>(mma: Maybe<Observable<A>>): EventStream<Maybe<A>>;

export function maybeOfCancelableToCancelableOfMaybe<A>(mma: Maybe<Cancelable<A>>) : Cancelable<Maybe<A>>;

export function promiseToCancelable<A>(p: Promise<A>): Cancelable<A>;
