/**
 * StaticLand: either.js
 *
 * Created by Matthias Seemann on 15.09.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { always, compose, curry, either as eitherThisOr, nth, o, tryCatch, unary, when } from 'semmel-ramda';

const
	// Don't attempt to use a Symbol here.
	// That would make Eithers created by right(of) and left unusable
	// with any differently (other path, other version) loaded staticland library
	missingEitherSide = '__de/@visisoft/staticland/either/missingEitherSide__',
	
	// Creation //
	
	of = x => [missingEitherSide, x],
	
	left = x => [x, missingEitherSide],
	
	// :: (…b -> a) -> …b -> Either c a
	fromThrowable = f => tryCatch(o(of, f), left),
	
	// :: (a -> Boolean) -> (a -> b) -> a -> Either b a
	fromAssertedValue = curry((predicate, createLeftValue, a) =>
		predicate(a) ? of (a) : left(createLeftValue(a))
	),
	
	// Inspection //
	
	isLeft = mx => Array.isArray(mx) && (mx.length === 2) && (mx[1] === missingEitherSide),
	
	isRight = mx => Array.isArray(mx) && (mx.length === 2) && (mx[0] === missingEitherSide),
	
	isEither = eitherThisOr(isLeft, isRight),
	
	// Transformation //
	
	map = curry((f, mx) =>
		when(isRight, compose(of, unary(f), nth(1)))(mx)
	),
	
	chain = curry((f, mx) =>
		when(isRight, o(unary(f), nth(1)))(mx)
	),
	
	join = mx =>
		isRight(mx) && isEither(mx[1]) ? mx[1] : mx,
	
	// Consumption //
	
	// ::  (c -> b) -> (a -> b) -> Either c a -> b
	either = curry((leftFn, rightFn, ma) =>
		isLeft(ma) ? leftFn(ma[0]) : rightFn(ma[1])
	),
	
	// Combination //
	
	/**
	 * From crocks.dev: Providing a means for a fallback or alternative value.
	 * Combines two Either instances and will return the first Right it encounters or the last Left if it does not encounter a Right.
	 */
	// :: Either b a -> Either b a -> Either b a
	alt = curry((ma, mb) =>
		either(always(mb), of, ma)
	);
	
	
export {
	alt, chain, either, fromAssertedValue, fromThrowable, isEither, isLeft, isRight, join, left, map, of
};

export let right = of;
