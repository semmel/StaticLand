import {curry, o} from 'ramda';
import fantasticCancelable from "./internal/fantasyfy.js";
import of from './of.js';
import ap from './ap.js';
import chain from './chain.js';
import never from './never.js';

const
	map = curry((fn, cc) =>
		fantasticCancelable({ap, chain, map, never, of})(
			(resolve, reject) => cc(o(resolve, fn), reject)
		));

export default map;

