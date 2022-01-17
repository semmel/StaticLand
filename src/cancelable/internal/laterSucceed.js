import {curry} from 'ramda';

const
	// :: Number -> a -> Cancelable * a
	laterSucceed = curry((dt, value) => (resolve, unused) => {
		const timer = setTimeout(resolve, dt, value);
		return () => { clearTimeout(timer); };
	});

export default laterSucceed;
