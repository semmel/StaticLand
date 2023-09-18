import { o } from 'ramda';

const
	_biMap = (fnLeft, fnRight, cc) => (resolve, reject) =>
		cc(o(resolve, fnRight), o(reject, fnLeft));

export default _biMap;
