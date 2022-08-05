import {curry, o} from 'ramda';
import fantasticCancelable from "./internal/fantasyfy.js";
import ap from "./ap.js";
import chain from './chain.js';
import map from "./map.js";
import never from "./never.js";
import of from "./of.js";

export default curry(
	(onFailure, onSuccess, cc) => fantasticCancelable({ap, chain, map, never, of})(
		(resolve, unused) => cc(o(resolve, onSuccess), o(resolve, onFailure))
	)
);
