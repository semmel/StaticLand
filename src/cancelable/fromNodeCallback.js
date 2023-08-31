import { curryN } from "ramda";
import addFantasyLandInterface from "./addFantasyLandInterface.js";

const
	fromNodeCallbackWithArity = (arity, callbackComputation) =>
		curryN(arity, (...args) => {
			const cancelable = (res, rej) => {
				let
					resolveInner = res,
					rejectInner = rej;

				callbackComputation(...args, (error, result) => {
					if (error) {
						rejectInner(error);
					} else {
						resolveInner(result);
					}
				});

				return () => {
					resolveInner = () => undefined;
					rejectInner = () => undefined;
				};
			};

			addFantasyLandInterface(cancelable);

			return cancelable;
	});

export default fromNodeCallbackWithArity;
