import {curry, o, tap, tryCatch} from 'ramda';
import fantasticCancelable from "./internal/fantasyfy.js";
import ap from "./ap.js";
import chain from './chain.js';
import map from "./map.js";
import never from "./never.js";
import of from "./of.js";

export default curry((fnf, fns, cc) => fantasticCancelable({ap, chain, map, never, of})(
	(resolve, reject) => cc(
	tryCatch(o(resolve, tap(fns)), (e, ...args) => reject(e)),
	tryCatch(o(reject, tap(fnf)), (e_fnf, e) => reject(e_fnf))
)));
