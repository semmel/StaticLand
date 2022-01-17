/**
 * StaticLand: view.js
 *
 * Created by Matthias Seemann on 25.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import {of as of_i} from '../identity.js';
import {map as map_c} from '../constant.js';
import {curry} from 'ramda';
import {over} from "./over.js";

const
	view = curry((composableLens, s) => over(composableLens, of_i, s)),
	makeComposable = lens => lens(map_c);

export {
	view,
	makeComposable
};

