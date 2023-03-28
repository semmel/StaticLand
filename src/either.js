/**
 * StaticLand: either.js
 *
 * Created by Matthias Seemann on 15.09.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { always, curry, either as thisOrThat, o, tryCatch } from 'ramda';
import { Either, Left } from "./either/mostly-adequate.js";

const
	// Creation //
	
	of = Either.of,
	
	left = x => new Left(x),
	right = of,
	
	// :: (…b -> a) -> …b -> Either c a
	fromThrowable = f => tryCatch(o(of, f), left),
	
	// :: (a -> Boolean) -> (a -> b) -> a -> Either b a
	fromAssertedValue = curry((predicate, createLeftValue, a) =>
		predicate(a) ? of (a) : left(createLeftValue(a))
	),
	
	// Inspection //
	
	isLeft = mx => mx instanceof Either && mx.isLeft,
	
	isRight = mx => mx instanceof Either && mx.isRight,
	
	isEither = thisOrThat(isLeft, isRight),
	
	// Transformation //
	
	map = curry((fn, mx) => mx.map(fn)),
	
	chain = curry((fn, mx) => mx.chain(fn)),
	
	chainLeft = curry(
		(fn, mx) => isLeft(mx)
			? fn(mx.$value)
			: mx
	),
	
	// :: Either c (Either c a) -> Either c a
	join = mx => mx.join(),
	
	// Consumption //
	
	// ::  (c -> b) -> (a -> b) -> Either c a -> b
	either = curry((leftFn, rightFn, ma) =>
		isLeft(ma) ? leftFn(ma.$value) : rightFn(ma.$value)
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
	alt, chain, chainLeft, either, fromAssertedValue, fromThrowable, isEither, isLeft, isRight, join, left, map, of, right
};


export {default as sequence} from './either/sequence.js';
export {default as traverse} from './either/traverse.js';
