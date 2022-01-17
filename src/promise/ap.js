import {curry} from 'ramda';

/**
 * StaticLand: ap.js
 *
 * Created by Matthias Seemann on 1.03.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

const
	// sequential ap
	// This implementation prioritises the left promise in way that
	// if the left promise fails it's rejected value takes precedence over
	// the rejected value of the right promise regardless of the time sequence.
	// Caveat: if the right promise fails, is that an UnhandledPromiseRejection?
	// Note: ap(mf, ma) = chain(f => map(f, ma))
	//ap = curry((fnPromise, aPromise) => fnPromise.then(fn => aPromise.then(fn))),
	
	// parallel ap
	// Note: ap(mf, ma) = chain(f => map(f, ma))
	// ap :: Promise (a -> b) -> Promise a -> Promise b
	ap_p = curry((fnPromise, aPromise) =>
		Promise.all([
			fnPromise,
			aPromise
		])
		.then(([fn, a]) => fn(a))
	);

export default ap_p;
