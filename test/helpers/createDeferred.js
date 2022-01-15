/**
 * WebRTCPeer: createDeferred.js
 *
 * Created by Matthias Seemann on 11.01.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

/** @typedef {Object} Deferred
 * @property {Promise<any>} promise
 * @property {(any) => void} resolve
 * @property {(any) => void} reject
 */

const
	/**
	 *
	 * @return {Deferred}
	 */
	// createDeferred :: () -> Deferred e a
	//    Deferred e a = { reject: e -> void, resolve: a -> void, promise: Promise e a}
	createDeferred = function () {
		const
			/** @type {Deferred} */
			myself = Object.create(null);
		
		myself.promise = new Promise(function (resolve, reject) {
			myself.resolve = resolve;
			myself.reject = reject;
		});
		
		return myself;
	};
	
export default createDeferred;
