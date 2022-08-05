import ap from "./ap.js";
import chain from './chain.js';
import map from "./map.js";
import never from "./never.js";
import of from "./of.js";

const
	addFantasyLandInterface = cac => {
		cac['fantasy-land/map'] = fn => map(fn, cac);
		cac['fantasy-land/ap'] = mfn => ap(mfn, cac);
		cac['fantasy-land/chain'] = fn => chain(fn, cac);
		
		/*
		Reassigning the .constructor property apparently does not do much harm.
		see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
		"There is nothing protecting the constructor property from being re-assigned or shadowed, so using it to detect the type of a variable should usually be avoided in favor of less fragile ways like instanceof and Symbol.toStringTag for objects, or typeof for primitives."
		 */
		cac.constructor = {
			"fantasy-land/of": of,
			"fantasy-land/zero": never
		};
	};

export default addFantasyLandInterface;
