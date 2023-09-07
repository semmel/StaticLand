import { curryN } from "ramda";
import addFantasyLandInterface from "./addFantasyLandInterface.js";

const
	fromNodeCallbackWithArity = (arity, callbackComputation) =>
		curryN(arity, (...args) => {
			const cancelable = (res, rej) => {
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
			};

			addFantasyLandInterface(cancelable);

			return cancelable;
	});

export default fromNodeCallbackWithArity;
