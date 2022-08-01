/**
 * StaticLand: fantasyfy.js
 *
 * Created by Matthias Seemann on 8.07.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */
import { identity } from "ramda";

const
	fantasyfy = M => ma => {
		const
			// copy
			mac = M.map(identity, ma);
		
		mac['fantasy-land/map'] = fn => M.map(fn, mac);
		mac['fantasy-land/ap'] = mfn => M.ap(mfn, mac);
		mac['fantasy-land/chain'] = fn => M.chain(fn, mac);
		mac['fantasy-land/of'] = a => M.of(a);
		
		return mac;
	};

export default fantasyfy;
