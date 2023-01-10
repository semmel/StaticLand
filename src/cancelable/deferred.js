/**
 * StaticLand: deferred.js
 *
 * Created by Matthias Seemann on 6.01.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

import Emittery from "../../src-external/emittery.js";
import addFantasyLandInterface from "./addFantasyLandInterface.js";

const
	noop = () => undefined,
	
	/** @description Make a lazy Cancelable eager */
	createDeferred = () => {
		// one time mutables
		let
			/** @type {"pending" | "rejected" | "resolved" | "cancelled"} */
			state = "pending",
			outcome;
			
		const
			emitter = new Emittery(),
			
			resolve = value => {
				state = "resolved";
				outcome = value;
				// in case anybody already listens, tell them…
				emitter.emit("settle", {outcome: value, isSuccess: true});
			},
			
			reject = error => {
				state = "rejected";
				outcome = error;
				// in case anybody already listens, tell them…
				emitter.emit("settle", {outcome: error, isSuccess: false});
			},
			
			cancel = () => {
				state = "cancelled";
				// in case anybody listens, forget them all…
				emitter.clearListeners(["settle"]);
			},
			
			cancelable = (propagateResolve, propagateReject) => {
				switch (state) {
					case "pending":
						const
							unSubscribe =
								emitter.on("settle", ({ isSuccess, outcome: theOutcome }) => {
									(isSuccess ? propagateResolve : propagateReject)(theOutcome);
									unSubscribe();
								});
						
						return unSubscribe;
					case "cancelled":
						return noop;
					case "rejected":
						setTimeout(propagateReject, 0, outcome);
						return noop;
					case "resolved":
						setTimeout(propagateResolve, 0, outcome);
						return noop;
					default:
						setTimeout(propagateReject, 0, new Error(`Unexpected cancelable deferred state: "${state}"`));
						return noop;
				}
			};
		
		addFantasyLandInterface(cancelable);
		
		return {
			cancelable,
			resolve,
			reject,
			cancel
		};
	};

export default createDeferred;
