import fantasticCancelable from "./internal/fantasyfy.js";
import ap from './ap.js';
import chain from './chain.js';
import map from './map.js';
import never from './never.js';
import of from './of.js';

const
	reject = value => fantasticCancelable
		({ap, chain, map, never, of})
		((unused, reject) => {
			queueMicrotask(() => reject(value));
			return () => {};
		});

export default reject;
