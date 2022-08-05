// Until sindresorhus/emittery is published as ESM (https://github.com/sindresorhus/emittery/issues/92),
// we need to convert the CJS module using command npm run postinstall:emittery
// and import our converted version
import Emittery from "../../src-external/emittery.js";
import addFantasyLandInterface from "./addFantasyLandInterface.js";

const
	share = cc => (function() {
		const
			emitter = new Emittery(),
			doNothing = () => undefined;
		
		// mutable state
		let
			cancelRunningComputation = doNothing(),
			isFinallyResolved = false,
			isFinallyRejected = false,
			previousListenerCount = 0,
			finalOutcome;
		
		emitter.on(Emittery.listenerRemoved, (function() {
			return function onListenerRemoved() {
				//console.log(`listenerRemoved: count=${emitter.listenerCount("settle")}, previousCount=${previousListenerCount}`);
				if ((emitter.listenerCount("settle") === 0) && (previousListenerCount > 0)
				&& !isFinallyResolved && !isFinallyRejected) {
					// abort the running computation if the number of consumers drops to zero
					cancelRunningComputation();
				}
				
				previousListenerCount = emitter.listenerCount("settle");
			};
		}()));
		
		emitter.on(Emittery.listenerAdded, (function() {
			return function onListenerAdded() {
				//console.log(`listenerAdded: count=${emitter.listenerCount("settle")}, previousCount=${previousListenerCount}`);
				if ((emitter.listenerCount("settle") > 0) && (previousListenerCount === 0)) {
					// run once for all when the number of consumers exceeds zero
					cancelRunningComputation = cc(
						value => {
							finalOutcome = value;
							isFinallyResolved = true;
							emitter.emit("settle", {outcome: value, isSuccess: true});
						},
						error => {
							finalOutcome = error;
							isFinallyRejected = true;
							emitter.emit("settle", {outcome: error, isSuccess: false});
						}
					);
				}
				
				previousListenerCount = emitter.listenerCount("settle");
			};
		}()));
		
		const
			cancelable = (resolve, reject) => {
				if (isFinallyResolved) {
					setTimeout(resolve, 0, finalOutcome);
					return doNothing;
				}
				
				if (isFinallyRejected) {
					setTimeout(reject, 0, finalOutcome);
					return doNothing;
				}
				
				const
					unConsume =
						emitter.on("settle", ({isSuccess, outcome}) => {
							(isSuccess ? resolve : reject)(outcome);
							unConsume();
						});
				
				return unConsume;
			};
		
		addFantasyLandInterface(cancelable);
		
		return cancelable;
	}());

export default share;

