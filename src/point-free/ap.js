import { curryN, ap } from 'ramda';
import ap_p from '../promise/ap.js';

const
	_ap = curryN(2, (fn, functor) => {
		if (Object.prototype.toString.call(functor) === '[object Promise]') {
			return ap_p(fn, functor);
		}
		return ap(fn, functor);
	});

export default _ap;
