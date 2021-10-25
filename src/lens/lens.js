/**
 * StaticLand: lens.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

const
	lens = (getter, setter) => map_f => x2Fy => s =>
		map_f(y => setter(y, s), x2Fy(getter(s)));

export default lens;
