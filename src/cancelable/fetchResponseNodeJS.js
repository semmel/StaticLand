/***
 * Node.js version
 */

import {promiseToCancelable} from "../transformations.js";
import fetch from 'node-fetch';
import AbortController from "abort-controller";

const
	/**
	 * @param {Object} options
	 * @param {String|URL} options.url
	 * @param {Object} [options.init]
	 * @return {CancelableComputation}
	 */
	// fetchResponse :: {url: (String|URL), init: {}} -> CancelableComputation Error Response
	fetchResponse = ({url, init = {}}) => (resolve, reject) => {
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
			
			if (abortController) {
				abortController.abort();
			}
		};
	};
	
export default fetchResponse;
