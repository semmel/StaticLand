import { curryN, chain } from 'ramda';
import chain_p from '../promise/chain.js';

const
	_chain = curryN(2, (fn, monad) => {
		if (Object.prototype.toString.call(monad) === '[object Promise]') {
			return chain_p(fn, monad);
		}
		return chain(fn, monad);
	});

export default _chain;
