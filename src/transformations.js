/**
 * StaticLand: transformations.js
 *
 * Created by Matthias Seemann on 18.09.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { either, left, right } from './either.js';
import { coalesce, reject, of as of_p } from './promise.js';
import map_p from './promise/map.js';
import { maybe, nothing, of as of_mb, just } from './maybe.js';
import { __, always, assoc, compose, curry, nth, o, objOf, prop, thunkify, update } from 'semmel-ramda';
export {default as promiseToCancelable} from './transformations/promiseToCancelable.js';
export {default as cancelableToPromise} from './transformations/cancelableToPromise.js';
export {default as observableToCancelable} from './transformations/baconObservableToCancelable.js';
export {default as cancelableToEventStream} from './transformations/cancelableToBaconStream.js';
export {default as eitherToCancelable} from './transformations/eitherToCancelable.js';
export {default as maybeOfBaconObservableToBaconObservableOfMaybe} from './transformations/maybeOfBaconObservableToBaconObservableOfMaybe.js';
export {default as maybeOfCancelableToCancelableOfMaybe} from
		'./transformations/maybeOfCancelableToCancelableOfMaybe.js';

const
	// eitherToPromise :: Either e a -> Promise e a
	eitherToPromise = either(reject, of_p),
	
	// :: Promise e a -> Promise * Either e a
	promiseToPromiseOfEither = coalesce(left, right),
	
	// maybeToPromise :: e -> Maybe a -> Promise e a
	maybeToPromise = curry((e, ma) => maybe(thunkify(reject)(e), of_p, ma)),
	
	// maybeToObj :: key -> Maybe a -> ({}|{key: a})
	//    key = String
	maybeToObj = curry((keyName, ma) => maybe(always({}), objOf(keyName), ma)),
	
	/**
	 * @deprecated
	 * use lens/view(sequence(maybe/map, indexLens(n)))(obj)
	 */
	// kind of inverse of `maybeToObj`
	// key = String
	// keyMaybeToMaybeObj :: key -> {key: Maybe a, …} -> Maybe {key: a, …}
	keyMaybeToMaybeObj = curry((keyName, obj) =>
		maybe(nothing, o(just, assoc(keyName, __, obj)), obj[keyName])
		// TODO: Is that the same as
		// map_mb(assoc(key, __, obj), obj[key])
		// TODO: Is that the same as
		// propUnlens(map_mb)
	),
	
	/** @deprecated
	 * use maybe/sequence(of_p, map_p)
	 */
	// maybeOfPromiseToPromiseOfMaybe :: Maybe Promise e a -> Promise e Maybe a
	maybeOfPromiseToPromiseOfMaybe = maybe(compose(of_p, nothing), map_p(of_mb)),
	
	// keyPromiseToPromiseCollection :: String -> {ki: Promise e vi, k:v …} -> Promise e {ki:vi, k:v …}
	// keyPromiseToPromiseCollection :: Int -> [v,…, Promise e v, v,…] -> Promise e [v]
	keyPromiseToPromiseCollection = curry((key, obj) =>
		map_p(assoc(key, __, obj), obj[key])
	);

export {
	eitherToPromise,
	maybeToPromise,
	maybeToObj,
	maybeOfPromiseToPromiseOfMaybe,
	promiseToPromiseOfEither,
	keyPromiseToPromiseCollection,
	keyMaybeToMaybeObj
};
