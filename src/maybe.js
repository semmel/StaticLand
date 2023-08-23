/**
 * StaticLand: maybe.js
 *
 * Created by Matthias Seemann on 27.04.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

/**
 * @template T
 * @typedef {Array<T>} Maybe<T>
 */

import {
	any, apply, always, chain as chainR, curry, equals as equalsR, ifElse, isEmpty, isNil, lift as liftR,
	nAry, unary, pathOr, reduce as reduce_l, tap as tapR, unapply, identity
} from 'ramda';

import maybe from './maybe/maybe.js';
import {isJust, isNothing} from './maybe/inspection.js';
import {just, of, nothing} from './maybe/creation.js';

const
	noop = () => undefined,
	// Creation //

	// fromNilable :: (a|undefined|null) -> Maybe a
	fromNilable = ifElse(isNil, nothing, of),

	// fromContentHolding :: a -> Maybe a
	fromContentHolding = ifElse(isEmpty, nothing, of),

	// :: (a -> Boolean) -> a -> Maybe a
	fromPredicate = curry((predicate, x) =>
		predicate(x) ? of(x) : nothing()
	),

	// Inspection //

	/**
	 * @deprecated Use FL compliant utility function e.g. R.equals
	 */
	// equals :: Maybe a -> Maybe b -> Boolean
	equals = equalsR,

	// Transformation //

	//join = mx => isJust(mx) ? mx.flat() : singleNothing, // alternative: mx.flat()
	// :: Maybe a -> Maybe a
	// :: Maybe Maybe a -> Maybe a
	join = chainR(identity),

	/**
	 * @deprecated Use FL compliant utility function e.g. R.reduce
	 */
	reduce = reduce_l,

	// Side effects //

	/**
	 * Note that probably `tap = fn => mx => tapR(maybe(() => undefined, fn))`
	 */
	// tap :: (a -> *) -> Maybe a -> Maybe a
	tap = curry((fn, mx) => {
		maybe(noop, fn, mx);
		return mx;
	}),

	biTap = curry((onNothing, onJust, mb) => tapR(maybe(onNothing, onJust), mb)),

	// Adjuncts //

	/**
	 * @template N
	 * @param {function(...): N} fn
	 * @return {function(...Maybe): Maybe<N>}
	 * @example
	 *    liftNAry((a, b) => a + b)(of(2), of(3)); // Maybe 5
	 */
	// :: ((a, b, ..., m) -> n) -> (Maybe a, Maybe b, ..., Maybe m) -> Maybe n
	lift = fn =>
		nAry(
			fn.length,

			unapply(ifElse(
				any(isNothing),
				nothing,
				/* alternative implementations may differ in performance */
				//compose(of, apply(fn), mapR(nth(0))) // here the same as the line below
				apply(liftR(fn))  // here the same as the line above
			))
		),

	// Developer //

	typeString = maybe(
		always('Nothing'),
		value => `Just(${pathOr(typeof value, ['constructor', 'name'], value)})`
	);

export {
	biTap, equals, fromNilable, fromContentHolding, fromPredicate, just, of, nothing, isJust, isNothing, join, lift,
	maybe, reduce, tap,
	typeString
};


export {Maybe as Maybe, Nothing as Nothing, Just as Just} from './maybe/mostly-adequate.js';
export {default as ap} from './maybe/ap.js';
export {default as chain} from './maybe/chain.js';
export {default as getOrElse} from './maybe/getOrElse.js';
export {default as liftA2} from './maybe/liftA2.js';
export {default as pluck} from './maybe/pluck.js';
export {default as map} from './maybe/map.js';
export {default as sequence} from './maybe/sequence.js';
export {default as traverse} from './maybe/traverse.js';
