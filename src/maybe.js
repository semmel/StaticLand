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
	any, apply, always, curry, equals as equalsR, ifElse, isEmpty, isNil, lift as liftR,
	nAry, unary, pathOr, reduce as reduce_l, tap as tapR, unapply
} from 'ramda';

import maybe from './maybe/maybe.js';
import {isJust, isNothing} from './maybe/inspection.js';
import map from './maybe/map.js';
import {just, of, nothing} from './maybe/creation.js';
import chain from './maybe/chain.js';
import ap from './maybe/ap.js';

const
	singleNothing = [],
	
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
	 * Note that due to the implementation Maybes and empty or one-element arrays
	 * cannot be separated from each other. Therefore
	 * `equals(of(x), [x])` is `true` as well as `equals(nothing(), [])` is also `true`.
	 */
	// equals :: Maybe a -> Maybe b -> Boolean
	equals = curry((ma, mb) =>
		isJust(ma) ?
			isJust(mb) && equalsR(ma[0], mb[0]) :
			isNothing(mb)
	),
	
	// Transformation //
	
	//join = mx => isJust(mx) ? mx.flat() : singleNothing, // alternative: mx.flat()
	// :: Maybe a -> Maybe a
	// :: Maybe Maybe a -> Maybe a
	join = mx =>
		isJust(mx)
			? (isJust(mx[0])
				? mx[0]
				: isNothing(mx[0]) ? nothing() : mx    // this else case makes the implementation different from chain(identity) and supports non-nested maybes as join arguments - why on earth would I want that?
			)
			: nothing(),
	
	reduce = reduce_l,//curry((f, initial, mx) => mx.reduce(f, initial)),
	
	// Side effects //
	
	/**
	 * Note that probably `tap = tapR(maybe(() => undefined))`
	 */
	// tap :: (a -> *) -> Maybe a -> Maybe a
	tap = curry((fn, mx) => {
		mx.forEach(unary(fn));
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
	map, maybe, chain, ap, reduce, tap,
	typeString
};

export {default as getOrElse} from './maybe/getOrElse.js';
export {default as liftA2} from './maybe/liftA2.js';
export {default as pluck} from './maybe/pluck.js';
export {default as sequence} from './maybe/sequence.js';
export {default as traverse} from './maybe/traverse.js';
