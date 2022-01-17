/**
 * StaticLand: find.js
 *
 * Created by Matthias Seemann on 14.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import {just, nothing} from "../maybe.js";
import {curryN} from 'ramda';

const
	find = curryN(2, (predicate, list) => {
		// shameless copy from Ramda
		let idx = 0;
		const len = list.length;
		while (idx < len) {
			if (predicate(list[idx])) {
				return just(list[idx]);
			}
			idx += 1;
		}
		return nothing();
	});

export default find;
