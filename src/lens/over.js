/**
 * StaticLand: over.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import {curry} from 'ramda';
import {map as map_i} from '../identity.js';

const
	over = curry((composableLens, x2x, s) => composableLens(x2x)(s)),
	set = curry((composableLens, x, s) => over(composableLens, _ => x, s)),
	makeComposable = lens => lens(map_i);

export {
	over,
	makeComposable,
	set
};
