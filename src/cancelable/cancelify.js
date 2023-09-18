import { curryN } from 'ramda';

const
	cancelifyFactory = fantasyfy => fn => curryN(fn.length, (...args) =>
		fantasyfy((res, rej) => {
			let
				resolveInner = res,
				rejectInner = rej;

			fn(...args).then(x => resolveInner(x), e => rejectInner(e));

			return () => {
				resolveInner = () => undefined;
				rejectInner = () => undefined;
			};
		})
	);

export default cancelifyFactory;
