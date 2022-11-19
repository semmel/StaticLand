import { curry } from "ramda";
import fantasticCancelable from "./internal/fantasyfy.js";
import ap from "./ap.js";
import map from "./map.js";
import never from "./never.js";
import of from "./of.js";
import chain from './chain.js';

const
	unity = () => undefined,
	
	biChain = curry((fnRej, fn, cc) => fantasticCancelable({ap, chain, map, never, of})(
		(resolve, reject) => {
			let cancel = unity;
			const
				resolveInner = x => {
					cancel = fn(x)(resolve, reject);
				},
				rejectInner = e => {
					cancel = fnRej(e)(resolve, reject);
				};
			
			cancel = cc(resolveInner, rejectInner);
			return () => cancel();
		}
	));

export default biChain;
