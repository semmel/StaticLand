/**
 * WebRTCPeer: later.js
 *
 * Created by Matthias Seemann on 6.02.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import {curry} from 'ramda';

const
	// later :: Number -> t -> Promise e t
	later = curry((dt, value) => new Promise(resolve =>
		setTimeout(resolve, dt, value)
	));

export default later;
