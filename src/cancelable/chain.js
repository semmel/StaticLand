import {curry, identity} from "semmel-ramda";

export default curry((fn, cc) => (resolve, reject) => {
	let cancel = identity;
	const resolveInner = x => {
		cancel = fn(x)(resolve, reject);
	};
	
	cancel = cc(resolveInner, reject);
	return () => cancel();
});
