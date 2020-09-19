/**
 * StaticLand: transformations.js
 *
 * Created by Matthias Seemann on 18.09.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { either } from './either.js';
import { reject, of as of_p } from './promise.js';
import { maybe } from './maybe.js';
import { curry, thunkify } from 'semmel-ramda';

const
	// eitherToPromise :: Promise e Either c a -> Promise (c|e) a
	eitherToPromise = either(reject, of_p),
	
	// maybeToPromise :: e -> Maybe a -> Promise e a
	maybeToPromise = curry((e, ma) => maybe(thunkify(reject)(e), of_p, ma));

export {
	eitherToPromise,
	maybeToPromise
};