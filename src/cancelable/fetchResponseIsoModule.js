/***
 * Iso version for the browser or Node.js
 */

import promiseToCancelable from "../transformations/promiseToCancelable.js";
import fantasticCancelable from "./internal/fantasyfy.js";
import of from './of.js';
import ap from "./ap.js";
import chain from "./chain.js";
import map from "./map.js";
import never from "./never.js";

const
	
	/**
	 * @type {(spec: WindowOrWorkerGlobalScope) => (spec: {[key: string]: any}) => import('@visisoft/staticland/cancelable').Cancelable<Response>}
	 */
	// fetchResponse :: {url: (String|URL), init: {}} -> Cancelable Error Response
	
	fetchResponseIsoModule = ({fetch, AbortController}) =>
		({url, init = {}}) => fantasticCancelable({ap, chain, map, never, of})((resolve, reject) => {
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
	
export default fetchResponseIsoModule;
