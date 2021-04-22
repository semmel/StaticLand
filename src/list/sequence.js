/**
 * StaticLand: sequence.js
 *
 * Created by Matthias Seemann on 15.04.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 * see http://www.tomharding.me/2017/05/08/fantas-eel-and-specification-12/
 */

import {append, curry, reduce} from 'semmel-ramda';

// :: Applicative f => ((a → f a), ((a → b → c) → f a → f b → f c) → [f a] → f [a]
const sequence = curry((of_f, liftA2_f, lfa) =>
	reduce(
		(acc, x) => liftA2_f(append, x, acc),
      of_f([]),
		lfa
	)
);

export default sequence;
