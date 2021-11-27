import { curryN } from "semmel-ramda";

const
	cancelify = fn => curryN(fn.length, (...args) =>
		(res, rej) => {
			let
				resolveInner = res,
				rejectInner = rej;
			
			fn(...args).then(x => resolveInner(x), e => rejectInner(e));
			
			return () => {
				resolveInner = () => undefined;
				rejectInner = () => undefined;
			};
		}
	);

export default cancelify;
