import laterSucceed from "./internal/laterSucceed.js";
import fantasticCancelable from "./internal/fantasyfy.js";
import ap from './ap.js';
import chain from './chain.js';
import map from './map.js';
import never from './never.js';

const
	// :: a -> Cancelable * a
	of = a => fantasticCancelable({ap, chain, map, never, of})(laterSucceed(0, a));

export default of;
