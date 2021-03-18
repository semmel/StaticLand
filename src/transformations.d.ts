import {EventStream, Observable } from "baconjs";
import {Maybe} from "./maybe";

export function maybeOfBaconObservableToBaconObservableOfMaybe<A>(mma: Maybe<Observable<A>>): EventStream<Maybe<A>>;
