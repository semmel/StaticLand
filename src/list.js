import nth from './list/nth.js';

const
	/** @type {(list: Array<any>|String) => import('./maybe').Maybe<any>} */
	head = nth(0),
	/** @type {(list: Array<any>|String) => import('./maybe').Maybe<any>} */
	last = nth(-1);

export {default as sequence} from './list/sequence.js';
export {default as traverse} from './list/traverse.js';
export {default as find} from './list/find.js';
export {default as map} from './list/map.js';

export {
	head,
	last,
	nth
};
