/**
 * StaticLand: deferred.js
 *
 * Created by Matthias Seemann on 6.01.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */
import { once } from 'ramda';
import fantasticCancelable from "./internal/fantasyfy.js";
import ap from "./ap.js";
import chain from "./chain.js";
import map from "./map.js";
import never from "./never.js";
import of from './of.js';
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
				// in case anybody listens, forget them…
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
	},
	
	createDeferred_obsolete = () => {
		let isResolved, isRejected, isCanceled, isSettled, outcomeValue;
		let pendingResolve = x => {
			isResolved = true;
			isRejected = false;
			isSettled = true;
			outcomeValue = x;
		};
		let pendingReject = e => {
			isRejected = true;
			isResolved = false;
			isSettled = true;
			outcomeValue = e;
		};
		const
			resolve = x => pendingResolve(x),
			reject = e => pendingReject(e),
			cancel = () => {
				isCanceled = true;
				pendingResolve = noop;
				pendingReject = noop;
			},
			
			cancelable = (forwardResolve, forwardReject) => {
				if (isSettled) {
					setTimeout(isResolved ? forwardResolve : forwardReject, 0, outcomeValue);
				}
				else if (!isCanceled) {
					// FIXME: What if multiple times subscribed to while not settled?
					// This would OVERRIDE the previous listener – it's forwardResolve and
					// forwardReject would never be called.
					pendingResolve = once(forwardResolve);
					pendingReject = once(forwardReject);
				}
				
				return cancel;
			};
		
		return {
			cancelable: fantasticCancelable({ap, chain, map, never, of})(cancelable),
			resolve,
			reject,
			cancel
		};
	};

export default createDeferred;
