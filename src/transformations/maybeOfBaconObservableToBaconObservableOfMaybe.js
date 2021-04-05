import {maybe, of as of_mb, nothing} from "../maybe.js";
import * as Bacon from "baconjs";
import {compose} from "semmel-ramda";

// A specialisation of the Maybe sequence:
// sequence(of_o, map_o)
// :: Maybe Observable e a -> EventStream e Maybe a
const maybeOfBaconObservableToBaconObservableOfMaybe =
	maybe(compose(Bacon.once, nothing), observable => observable.toEventStream().map(of_mb));

export default maybeOfBaconObservableToBaconObservableOfMaybe;
