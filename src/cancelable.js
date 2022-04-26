/**
 * @typedef {function(function(*): void, function(*): void): function(): void} CancelableComputation
 */

import { curry, prop } from 'ramda';
import map from './cancelable/map.js';

export {default as of} from './cancelable/of.js';
export {default as reject} from './cancelable/reject.js';
export {default as never} from './cancelable/never.js';
export {default as later} from './cancelable/internal/laterSucceed.js';
export {default as laterReject} from './cancelable/internal/laterFail.js';
export {default as race} from './cancelable/race.js';
export {default as chain} from './cancelable/chain.js';
export {default as ap} from './cancelable/ap.js';
export {default as liftA2} from './cancelable/liftA2.js';
export {default as liftA3} from './cancelable/liftA3.js';
export {default as liftA4} from './cancelable/liftA4.js';
export {default as fetchResponse} from './cancelable/fetchResponse.js';
export {default as fetchResponseIsoModule} from './cancelable/fetchResponseIsoModule.js';
export {default as cancelify} from './cancelable/cancelify.js';
export {default as bi_tap} from './cancelable/biTap.js';
export {default as share} from './cancelable/share.js';

const
	// :: Cancelable c => k -> c {k: v} -> c v
	pluck = curry((key, mc) => map(prop(key), mc));

export {
	map,
	pluck
};
