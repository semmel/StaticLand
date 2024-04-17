import { curryN } from "ramda";

const
	fromNodeCallbackWithArityFactory = fantasyfy => (arity, callbackComputation) =>
		curryN(arity, (...args) => fantasyfy(
			(res, rej) => {
				let
					resolveInner = res,
					rejectInner = rej;

				queueMicrotask(		// guard against synchronous callback calls
					() => {
						callbackComputation(...args, (error, result) => {
							if (error) {
								rejectInner(error);
							} else {
								resolveInner(result);
							}
						});
					}
				);

				return () => {
					resolveInner = () => undefined;
					rejectInner = () => undefined;
				};
			}
		));

export default fromNodeCallbackWithArityFactory;
