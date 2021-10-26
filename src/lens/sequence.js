/**
 * StaticLand: sequence.js
 *
 * Created by Matthias Seemann on 26.10.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */
import {view} from './view.js';
import {curry} from "semmel-ramda";

const
	sequence = view,
	makeComposable = curry((lens, map) => lens(map));

export {
	sequence,
	makeComposable
};
