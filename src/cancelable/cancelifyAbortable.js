import { curryN } from "ramda";
import __promiseToCancelable from "./internal/_promiseToCancelable.js";

const
	cancelifyWithArityAbortableFactory = fantasyfy => (arity, fn) => curryN(arity, (...args) => fantasyfy(
		(resolve, reject) => {
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

				cancelPromiseContinuation = __promiseToCancelable(promise)(resolve, reject);

			return () => {
				cancelPromiseContinuation();
				controller.abort();
			};
		}
	));

export default cancelifyWithArityAbortableFactory;
