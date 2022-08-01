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
		
		/*
		Reassigning the .constructor property apparently does not do much harm.
		see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
		"There is nothing protecting the constructor property from being re-assigned or shadowed, so using it to detect the type of a variable should usually be avoided in favor of less fragile ways like instanceof and Symbol.toStringTag for objects, or typeof for primitives."
		 */
		cac.constructor = {
			"fantasy-land/of": C.of,
			"fantasy-land/zero": C.never
		};
		
		return cac;
	};

export default fantasticCancelable;
