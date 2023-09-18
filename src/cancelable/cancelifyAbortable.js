import { curryN } from "ramda";
import _promiseToCancelable from "./internal/_promiseToCancelable.js";

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

				cancelPromiseContinuation = _promiseToCancelable(promise)(resolve, reject);

			return () => {
				cancelPromiseContinuation();
				controller.abort();
			};
		}
	));

export default cancelifyWithArityAbortableFactory;
