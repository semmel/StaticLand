/**
 * StaticLand: either.js
 *
 * Created by Matthias Seemann on 15.09.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { compose, curry, nth, o, tryCatch, unary, when } from 'semmel-ramda';

const
	missingEitherSide = Symbol('missingEitherSide'),
	
	// Creation //
	
	of = x => [missingEitherSide, x],
	
	left = x => [x, missingEitherSide],
	
	fromThrowable = f => tryCatch(o(of, f), left),
	
	// Inspection //
	
	isLeft = mx => Array.isArray(mx) && (mx.length === 2) && (mx[1] === missingEitherSide),
	
	isRight = mx => Array.isArray(mx) && (mx.length === 2) && (mx[0] === missingEitherSide),
	
	// Transformation //
	
	map = curry((f, mx) =>
		when(isRight, compose(of, unary(f), nth(1)))(mx)
	),
	
	chain = curry((f, mx) =>
		when(isRight, o(unary(f), nth(1)))(mx)
	),
	
	// Consumption //
	
	either = curry((leftFn, rightFn, ma) =>
		isLeft(ma) ? leftFn(ma[0]) : rightFn(ma[1])
	);
	
	
export {
	chain, either, fromThrowable, isLeft, isRight, left, map, of
};

export let right = of;