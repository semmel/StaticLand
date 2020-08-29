/**
 * StaticLand: maybe.js
 *
 * Created by Matthias Seemann on 27.04.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

/**
 * @typedef {Array} Maybe
 */

import {
	any, apply, always, compose, curry, equals as equalsR, ifElse, isEmpty, isNil, lift as liftR, o,
	map as map_l, nAry, nth, unary, pathOr, reduce as reduce_l, unapply
} from 'ramda';

const
	singleNothing = [],
	
	// Creation //
	
	// :: a -> Maybe a
	of = x => [x],
	//nothing = () => singleNothing, // TODO: alt: []
	nothing = () => [],
	
	fromNilable = ifElse(isNil, nothing, of),
	
	// fromContentHolding :: a -> Maybe a
	fromContentHolding = ifElse(isEmpty, nothing, of),
	
	// Inspection //
	
	// isJust :: Maybe a -> Boolean
	isJust = mx => Array.isArray(mx) && (mx.length === 1), // alt: mx !== singleNothing
	isNothing = mx => Array.isArray(mx) && (mx.length === 0),
	
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
	
	//join = mx => isJust(mx) ? mx.flat() : singleNothing, // TODO: alt mx.flat()
	join = mx => mx.flat(),
	//map = curry((f, mx) => isJust(mx) ? mx.map(unary(f)) : singleNothing), // alt mx.map(unary(f))
	// map :: (a -> b) -> Maybe a -> Maybe b
	map = curry((f, mx) => mx.map(unary(f))),
	// chain :: (a -> Maybe b) -> Maybe a -> Maybe b
	//chain = curry((f, mx) => isJust(mx) ? mx.flatMap(f) : singleNothing), // alt mx.flatMap(unary(f))
	chain = curry((f, mx) => mx.flatMap(unary(f))),
	ap = curry((mf, mx) => chain(f => map(f, mx), mf)),
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
	
	// Consumption //
	
	/**
	 * Extract the value of a Just or return the provided default.
	 * @function
	 * @template T
	 * @param {T} defaultValue
	 * @param {Maybe<T>} maybe
	 * @return {T}
	 */
	// getOrElse :: a -> Maybe a -> a
	getOrElse = reduce((acc, x) => x), // alt: xs => xs[0]
	
	// maybe :: b -> (a -> b) -> Maybe a -> b
	//maybe = curry((defaultValue, justFn, ma) => getOrElse(defaultValue, map(justFn, ma))),
	
	/**
	 * Composition of `getOrElse` and `map`.
	 * Transforms the value if it exists with the provided function.
	 * Otherwise return the default value.
	 * @function
	 * @template T, U
	 * @param {U} defaultValue
	 * @param {function(T): U}
	 * @return {function(Maybe<T>): U}
	 */
	// maybe :: (() -> b) -> (a -> b) -> Maybe a -> b
	maybe = curry((nothingFn, justFn, ma) =>
		isJust(ma) ? getOrElse("THIS_VALUE_SHOWING_ANYWHERE_IS_AN_ERROR", map(justFn, ma))
			: nothingFn()
	),
	
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
	equals, fromNilable, fromContentHolding, of, nothing, isJust, isNothing, join, lift,
	map, maybe, chain, ap, reduce, tap, getOrElse,
	typeString
};