/**
 * @typedef {function(function(*): void, function(*): void): function(): void} CancelableComputation
 */

import { curry, prop } from 'ramda';
import map from './cancelable/map.js';
import ap from './cancelable/ap.js';
import chain from './cancelable/chain.js';
import of from './cancelable/of.js';
import never from './cancelable/never.js';
import _laterSucceed from "./cancelable/internal/laterSucceed.js";
import _laterReject from './cancelable/internal/laterFail.js';
import fantasticCancelable from "./cancelable/internal/fantasyfy.js";

export {default as addFantasyLandInterface} from './cancelable/addFantasyLandInterface.js';
export {default as reject} from './cancelable/reject.js';
export {default as race} from './cancelable/race.js';
export {default as ap} from './cancelable/ap.js';
export {default as liftA2} from './cancelable/liftA2.js';
export {default as liftA3} from './cancelable/liftA3.js';
export {default as liftA4} from './cancelable/liftA4.js';
export {default as fetchResponse} from './cancelable/fetchResponse.js';
export {default as fetchResponseIsoModule} from './cancelable/fetchResponseIsoModule.js';
export {default as cancelify} from './cancelable/cancelify.js';
export {default as bi_tap} from './cancelable/biTap.js';
export {default as share} from './cancelable/share.js';
export {default as coalesce} from './cancelable/coalesce.js';

const
	// :: Cancelable c => k -> c {k: v} -> c v
	pluck = curry((key, mc) => map(prop(key), mc)),

	later = curry((dt, value) =>
		fantasticCancelable({ap, chain, map, never, of})(_laterSucceed(dt, value))
	),

	laterReject = curry((dt, value) =>
		fantasticCancelable({ap, chain, map, never, of})(_laterReject(dt, value))
	),

	TypeRepresentative = {
		'fantasy-land/of': of,
		"fantasy-land/zero": never
	};

export {
	chain,
	later,
	laterReject,
	map,
	never,
	of,
	pluck,
	TypeRepresentative
};
