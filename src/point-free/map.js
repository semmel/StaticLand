import { curryN, map } from 'ramda';
import map_p from '../promise/map.js';

const
	_map = curryN(2, (fn, functor) => {
		if (Object.prototype.toString.call(functor) === '[object Promise]') {
			return map_p(fn, functor);
		}
		return map(fn, functor);
	});

export default _map;
