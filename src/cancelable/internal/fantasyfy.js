/**
 * StaticLand: fantasyfy.js
 *
 * Created by Matthias Seemann on 8.07.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

const
	fantasticCancelable = C => ca => {
		const
			// copy
			cac = (resolve, reject) => ca(resolve, reject);
		
		cac['fantasy-land/map'] = fn => C.map(fn, cac);
		cac['fantasy-land/ap'] = mfn => C.ap(mfn, cac);
		cac['fantasy-land/chain'] = fn => C.chain(fn, cac);
		cac['fantasy-land/of'] = a => C.of(a);
		cac['fantasy-land/zero'] = () => C.never();
		
		return cac;
	};

export default fantasticCancelable;
