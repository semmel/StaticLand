/**
 * @typedef {function(function(*): void, function(*): void): function(): void} CancelableComputation
 */

export {default as of} from './cancelable/of.js';
export {default as reject} from './cancelable/reject.js';
export {default as later} from './cancelable/internal/laterSucceed.js';
export {default as laterReject} from './cancelable/internal/laterFail.js';
export {default as race} from './cancelable/race.js';
export {default as fetchResponse} from './cancelable/fetchResponse.js';
