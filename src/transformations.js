/**
 * StaticLand: transformations.js
 *
 * Created by Matthias Seemann on 18.09.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { either, left, right } from './either.js';
import { coalesce, map as map_p, reject, of as of_p } from './promise.js';
import { maybe, nothing, of as of_mb } from './maybe.js';
import { __, always, assoc, compose, curry, objOf, thunkify } from 'semmel-ramda';

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
	keyPromiseToPromiseCollection
};