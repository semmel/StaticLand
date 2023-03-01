import addFantasyLandInterface from "../cancelable/addFantasyLandInterface.js";
import { curryN } from "ramda";
import _promiseToCancelable from "./internal/_promiseToCancelable.js";

const
	cancelifyWithArityAbortable = (arity, fn) => curryN(arity, (...args) => {
		const cancelable = (resolve, reject) => {
			const
				controller = new AbortController(),
				
				promise = fn.apply(
					undefined,
					[
						...args.slice(0, -1),
						{
							...args[args.length - 1],
							signal: controller.signal
						}
					]
				),
			
				cancelPromiseContinuation = _promiseToCancelable(promise)(resolve, reject);
			
			return () => {
				cancelPromiseContinuation();
				controller.abort();
			};
		};
		
		addFantasyLandInterface(cancelable);
		
		return cancelable;
	});

export default cancelifyWithArityAbortable;
