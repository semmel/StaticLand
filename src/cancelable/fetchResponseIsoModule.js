/***
 * Iso version for the browser or Node.js
 */

import promiseToCancelable from "../transformations/promiseToCancelable.js";

const

	/**
	 * @type {(fantasyfy: (fn: any) => any) => (spec: WindowOrWorkerGlobalScope) => (spec: {[key: string]: any}) => import('@visisoft/staticland/cancelable').Cancelable<Response>}
	 */
	// fetchResponse :: {url: (String|URL), init: {}} -> Cancelable Error Response

	fetchResponseIsoModuleFactory = fantasyfy => ({fetch, AbortController}) =>
		({url, init = {}}) => fantasyfy((resolve, reject) => {
		const
			abortController = new AbortController(),

			cancelPromiseContinuation =
				promiseToCancelable(
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

export default fetchResponseIsoModuleFactory;
