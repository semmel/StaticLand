/**
 * StaticLand: sequence.js
 *
 * Created by Matthias Seemann on 29.03.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

import {compose, curry} from 'ramda';
import { either, left, right } from "../either.js";

// :: Applicative f => ((a → f a), ((a → b) → f a → f b) → Either c (f a) → f (Either c a)
const sequence = curry((of_f, map_f, mfa) =>
	either(
		compose(of_f, left),    // :: () -> f Left c
		map_f(right),           // :: f a -> f Right a
		mfa                     // :: Either c a
	)
);

export default sequence;
