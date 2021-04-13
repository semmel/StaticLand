/**
 * StaticLand: sequence.js
 *
 * Created by Matthias Seemann on 5.04.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */
import {compose, curry} from "semmel-ramda";
import maybe from './maybe.js';
import {just, nothing} from './creation.js';

// :: Applicative f => ((a → f a), ((a → b) → f a → f b) → Maybe (f a) → f (Maybe a)
const sequence = curry((of_f, map_f, mfa) =>
	maybe(                        // :: (() -> b) -> (a -> b) -> Maybe a -> b
		compose(of_f, nothing),    // :: () -> f Nothing
		map_f(just),               // :: f a -> f Just a
		mfa                        // :: Maybe f a
	)
);

export default sequence;
