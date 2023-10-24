import __promiseToCancelable from "./internal/_promiseToCancelable.js";

const
	/**
	 * @type {(fantasyfy: (fn: any) => any) => (spec: {url: String|URL, init: {[key: string]: any}}) => import('@visisoft/staticland/cancelable').Cancelable<Response>}
	 */
	// fetchResponse :: {url: (String|URL), init: {}} -> CancelableComputation Error Response
	fetchResponse = fantasyfy => ({url, init = {}}) => fantasyfy((resolve, reject) => {
		const
			abortController = new AbortController(),

			cancelPromiseContinuation =
				__promiseToCancelable(
					fetch(
						url.toString(),
						{...init, signal: abortController.signal}
					)
				)(resolve, reject);

		return () => {
			cancelPromiseContinuation();
			abortController.abort();
		};
	});

export default fetchResponse;
