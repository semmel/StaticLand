import { curry, o } from 'ramda';
import fantasticCancelable from "./internal/fantasyfy.js";
import ap from "./ap.js";
import chain from "./chain.js";
import never from "./never.js";
import of from "./of.js";
import map from './map.js';

const
	_biMap = (fnLeft, fnRight, cc) => fantasticCancelable({ap, chain, map, never, of})(
		(resolve, reject) =>
			cc(o(resolve, fnRight), o(reject, fnLeft))
	);

export default curry(_biMap);
