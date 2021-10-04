/**
 * StaticLand: tap.js
 *
 * Created by Matthias Seemann on 4.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */


import {curry} from "semmel-ramda";

const
	// In this implementation an exception in the side-effect rubs off to the Promise
	// tap :: (a -> *) -> Promise a -> Promise a
	tap = curry((fn, p) =>
		p.then(x => {
			fn(x);
			return x;
		})),
	
	bi_tap = curry((onFailure, onSuccess, p) =>
		p.then(
			x => {
				onSuccess(x);
				return x;
			},
			e => {
				onFailure(e);
				return Promise.reject(e);
			}
		)
	),
	
	/**
	 * Execute a synchronous side effect.
	 * In this implementation an exception in the side-effect is ignored.
	 * <pre>
	 * promise X ---------> X --->
	 *          \
	 *           - fn(X) -> Y
	 * </pre>
	 *
	 * @aka forEach
	 * @template A
	 * @param {function(A):*} sideEffect
	 * @return {function(Promise<A>): Promise<A>}
	 */
		// tapRegardless :: (a -> *) -> Promise a -> Promise a
	tapRegardless = curry((fn, p) => {
		p.then(fn).catch(x => x);
		
		return p;
	});

export {
	tap, bi_tap, tapRegardless
};
