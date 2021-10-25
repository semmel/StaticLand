/**
 * StaticLand: compose.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import {map as map_c} from '../constant.js';
import {map as map_i} from '../identity.js';

const
	compose = map => lenses => lenses.reduce((a2b, lens) => x => a2b(lens(map)(x)), x => x),
	// [f0, f1] -> x2 => (x => f0(map)(x))( f1(map)(x2) )
	composeFocus = compose(map_c),
	composeOptics = compose(map_i);

export {
	composeOptics,
	composeFocus
};
