import createEmitter from './internal/emitter.js';
import { thunkify } from "ramda";

const
	share = cc => (function() {
		const
			doNothing = () => undefined;

		// mutable state
		let
			cancelRunningComputation = doNothing(),
			isFinallyResolved = false,
			isFinallyRejected = false,
			finalOutcome;

		const
			onLastSinkRemoved = () => {
				if (!isFinallyResolved && !isFinallyRejected) {
					// abort the running computation if the number of consumers drops to zero
					cancelRunningComputation();
				}
			},

			// run once for all when the number of consumers exceeds zero
			onFirstSinkAdded = () => {
				cancelRunningComputation = cc(
					value => {
						finalOutcome = value;
						isFinallyResolved = true;
						emitter.emitOnce({outcome: value, isSuccess: true});
					},
					error => {
						finalOutcome = error;
						isFinallyRejected = true;
						emitter.emitOnce({outcome: error, isSuccess: false});
					}
				);
			},

			emitter = createEmitter({onFirstSinkAdded, onLastSinkRemoved});

		return (resolve, reject) => {
			if (isFinallyResolved) {
				const resolveAsap = thunkify(resolve)(finalOutcome);
				queueMicrotask(resolveAsap);
				return doNothing;
			}

			if (isFinallyRejected) {
				const rejectAsap = thunkify(reject)(finalOutcome);
				queueMicrotask(rejectAsap);
				return doNothing;
			}

			const
				sink = { resolve, reject },
				unConsume = () => { emitter.removeSink(sink); };

			emitter.addSink(sink);

			return unConsume;
		};
	}());

export default share;

