/***
 * Browser version
 */

import __promiseToCancelable from "./internal/_promiseToCancelable.js";

const
	IS_ABORT_CONTROLLER_SUPPORTED = typeof AbortController === 'function',

	/**
	 * @deprecated
	 * use fetchResponseIsoModule
	 * @param {Object} options
	 * @param {String|URL} options.url
	 * @param {Object} [options.init]
	 * @return {CancelableComputation}
	 */
	// fetchResponse :: {url: (String|URL), init: {}} -> CancelableComputation Error Response
	fetchResponse = ({url, init = {}}) => (resolve, reject) => {
		const
			abortController = IS_ABORT_CONTROLLER_SUPPORTED ? new AbortController() : undefined,

			cancelPromiseContinuation =
				__promiseToCancelable(
					fetch(
						url.toString(),
						{...init, signal: abortController ? abortController.signal: undefined}
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
