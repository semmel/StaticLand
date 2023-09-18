/**
 * StaticLand: sequence.js
 *
 * Created by Matthias Seemann on 29.03.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

import {compose, curry} from 'ramda';
import { Either, Left } from "./mostly-adequate.js";

const
	right = Either.of,
	left = x => new Left(x),
	isLeft = mx => mx instanceof Either && mx.isLeft,

	either = curry((leftFn, rightFn, ma) =>
		isLeft(ma) ? leftFn(ma.$value) : rightFn(ma.$value)
	),

	// :: Applicative f => ((a → f a), ((a → b) → f a → f b) → Either c (f a) → f (Either c a)
	/** @deprecated */
	sequence = curry((of_f, map_f, mfa) =>
		either(
			compose(of_f, left),    // :: () -> f Left c
			map_f(right),           // :: f a -> f Right a
			mfa                     // :: Either c a
		)
	);

export default sequence;
