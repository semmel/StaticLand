/**
 * StaticLand: identity.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import {curry} from 'semmel-ramda';

const
	map = curry((x2y, x) => x2y(x)),
	ap = curry((x2y, x) => x2y(x)),
	of = x => x,
	liftA2 = curry((xy2z, mx, my) => ap(map(xy2z, mx), my));

export {
	ap, map, of, liftA2
};
