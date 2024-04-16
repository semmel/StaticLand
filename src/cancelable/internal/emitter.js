/**
 * @template T
 * @typedef {{ resolve(t:T): void, reject(e: Error): void }} Sink
 */

/**
 * @template T
 * @typedef {{isSuccess: boolean, outcome: T|Error}} EmitterEvent
 */

/**
 * @template T
 * @typedef {{ emitOnce: (event: EmitterEvent<T>) => void, removeAllSinks: () => void, addSink: (sink: Sink<T>) => void, removeSink: (s: Sink<T>) => void }} Emitter
 */

const
	/**
	 * @template T
	 * @param onLastSinkRemoved
	 * @param onFirstSinkAdded
	 * @return Emitter<T>
	 */
	emitterForSingleEmission = ({
		onLastSinkRemoved,
		onFirstSinkAdded
	                            }) => {
		const
			/** @type {Sink[]} */
			sinks = [],

			/**
			 * @template T
			 * @param {Sink<T>} sink
			 */
			addSink = sink => {
				sinks.push(sink);
				if (sinks.length === 1) {
					onFirstSinkAdded();
				}
			},

			removeSink = sink => {
				const
					index = sinks.indexOf(sink);
				if (index !== -1) {
					sinks.splice(index, 1);
					if (sinks.length === 0) {
						onLastSinkRemoved();
					}
				}
			},

			removeAllSinks = () => {
				if (sinks.length > 0) {
					sinks.splice(0);
					onLastSinkRemoved();
				}
			},

			/**
			 * @template T
			 * @param {EmitterEvent<T>} event
			 */
			emitOnce = event => {
				const {isSuccess, outcome} = event;
				sinks.forEach(({resolve, reject}) => {
					(isSuccess ? resolve : reject)(outcome);
				});
				removeAllSinks();
			};

		return {
			addSink,
			removeSink,
			removeAllSinks,
			emitOnce
		};
	};

export default emitterForSingleEmission;
