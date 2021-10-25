/**
 * StaticLand: propertyLens.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import lens from './lens.js';

const
	propertyLens = key => lens(
		xs => xs[key],
		(x, xs) => ({...xs, [key]: x})
	);

export default propertyLens;
