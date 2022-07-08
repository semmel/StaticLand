import fantasticCancelable from "./internal/fantasyfy.js";
import ap from './ap.js';
import chain from './chain.js';
import map from './map.js';
import of from './of.js';

const
	never = () => fantasticCancelable({ap, chain, map, never, of})( (unused, unusedToo) => () => {} );

export default never;
