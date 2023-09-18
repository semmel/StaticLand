import {identity} from 'ramda';

const
	chain = (fn, cc) => (resolve, reject) => {
		let cancel = identity;
		const resolveInner = x => {
			cancel = fn(x)(resolve, reject);
		};

		cancel = cc(resolveInner, reject);
		return () => cancel();
	};

export default chain;
