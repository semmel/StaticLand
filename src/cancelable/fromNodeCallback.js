import { curryN } from "ramda";

const
	fromNodeCallbackWithArityFactory = fantasyfy => (arity, callbackComputation) =>
		curryN(arity, (...args) => fantasyfy(
			(res, rej) => {
				let
					resolveInner = res,
					rejectInner = rej;

				setTimeout(		// guard against synchronous callback calls
					() => {
						callbackComputation(...args, (error, result) => {
							if (error) {
								rejectInner(error);
							} else {
								resolveInner(result);
							}
						});
					},
					0
				);

				return () => {
					resolveInner = () => undefined;
					rejectInner = () => undefined;
				};
			}
		));

export default fromNodeCallbackWithArityFactory;
