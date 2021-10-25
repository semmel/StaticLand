/**
 * StaticLand: indexLens.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import lens from './lens.js';

const
	indexLens = n => lens(
		xs => xs[n],
		(x, xs) => [...xs.slice(0, n), x, ...xs.slice(n + 1)]
	);

export default indexLens;
