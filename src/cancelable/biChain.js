
const
	unity = () => undefined,

	biChain = (fnRej, fn, cc) =>
		(resolve, reject) => {
			let cancel = unity;
			const
				resolveInner = x => {
					cancel = fn(x)(resolve, reject);
				},
				rejectInner = e => {
					cancel = fnRej(e)(resolve, reject);
				};

			cancel = cc(resolveInner, rejectInner);
			return () => cancel();
		};

export default biChain;
