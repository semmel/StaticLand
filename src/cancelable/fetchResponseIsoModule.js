/***
 * Iso version for the browser or Node.js
 */

import promiseToCancelable from "../transformations/promiseToCancelable.js";

const
	
	/**
	 * @type {(spec: WindowOrWorkerGlobalScope) => (spec: {[key: string]: any}) => import('@visisoft/staticland/cancelable').Cancelable<Response>}
	 */
	// fetchResponse :: {url: (String|URL), init: {}} -> Cancelable Error Response
	
	fetchResponseIsoModule = ({fetch, AbortController}) =>
		({url, init = {}}) => (resolve, reject) => {
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
	};
	
export default fetchResponseIsoModule;
