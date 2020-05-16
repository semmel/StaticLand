/**
 * StaticLand: maybe.js
 *
 * Created by Matthias Seemann on 27.04.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import { curry} from 'ramda';

const
	singleNothing = [],
	
	of = x => [x],
	//nothing = () => singleNothing, // TODO: alt: []
	nothing = () => [],
	isJust = mx => Array.isArray(mx) && (mx !== singleNothing), // TODO: alt mx.length > 0
	//join = mx => isJust(mx) ? mx.flat() : singleNothing, // TODO: alt mx.flat()
	join = mx => mx.flat(),
	//map = curry((f, mx) => isJust(mx) ? mx.map(f) : singleNothing), // TODO: alt mx.map(f)
	map = curry((f, mx) => mx.map(f)),
	//chain = curry((f, mx) => isJust(mx) ? mx.flatMap(f) : singleNothing), // TODO: alt mx.flatMap(f)
	chain = curry((f, mx) => mx.flatMap(f)),
	ap = curry((mf, mx) => chain(f => map(f, mx), mf)),
	reduce = curry((f, initial, mx) => mx.reduce(f, initial)),
	getOrElse = reduce((acc, x) => x);

export {
	of, nothing, join, map, chain, ap, reduce, getOrElse
};