/**
 * StaticLand: deferred.js
 *
 * Created by Matthias Seemann on 6.01.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

import createEmitter from './internal/emitter.js';
import { thunkify } from "ramda";

const
	noop = () => undefined,

	/** @description Make a lazy Cancelable eager */
	createDeferredFactory = fantasyfy => () => {
		// one time mutables
		let
			/** @type {"pending" | "rejected" | "resolved" | "cancelled"} */
			state = "pending",
			outcome;

		const
			emitter = createEmitter({onLastSinkRemoved: noop, onFirstSinkAdded: noop}),

			resolve = value => {
				state = "resolved";
				outcome = value;
				// in case anybody already listens, tell them…
				emitter.emitOnce({outcome: value, isSuccess: true});
			},

			reject = error => {
				state = "rejected";
				outcome = error;
				// in case anybody already listens, tell them…
				emitter.emitOnce({outcome: error, isSuccess: false});
			},

			cancel = () => {
				state = "cancelled";
				// in case anybody listens, forget them all…
				emitter.removeAllSinks();
			},

			cancelable = (propagateResolve, propagateReject) => {
				const
					resolveAsap = thunkify(propagateResolve)(outcome),
					rejectAsap = thunkify(propagateReject)(outcome)
				switch (state) {
					case "pending":
						const
							sink = {resolve: propagateResolve, reject: propagateReject},
							unsubscribe = () => {
								emitter.removeSink(sink);
							};

						emitter.addSink(sink);

						return unsubscribe;
					case "cancelled":
						break;
					case "rejected":
						queueMicrotask(rejectAsap);
						break;
					case "resolved":
						queueMicrotask(resolveAsap);
						break;
					default:
						queueMicrotask(() => {
							propagateReject(new Error(`Unexpected cancelable deferred state: "${state}"`));
						});
				}
				return noop;
			};

		return {
			cancelable: fantasyfy(cancelable),
			resolve,
			reject,
			cancel
		};
	};

export default createDeferredFactory;
