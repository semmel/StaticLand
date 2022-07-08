import {curry, identity} from 'ramda';
import fantasticCancelable from "./internal/fantasyfy.js";
import of from './of.js';
import ap from './ap.js';
import map from './map.js';
import never from './never.js';

const
	chain = curry((fn, cc) => fantasticCancelable({ap, chain, map, never, of})( (resolve, reject) => {
		let cancel = identity;
		const resolveInner = x => {
			cancel = fn(x)(resolve, reject);
		};
		
		cancel = cc(resolveInner, reject);
		return () => cancel();
	} ));

export default chain;
