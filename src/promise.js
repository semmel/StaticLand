/**
 * StaticLand: promise.js
 *
 * see https://medium.com/@JosephJnk/an-introduction-to-applicative-functors-aea966799b1d
 * https://funfix.org/api/exec/classes/future.html
 */

import { curry, o, identity } from 'semmel-ramda';
import map from './promise/map.js';

const
	// Creation //
	
	// Applicative
	// of :: a -> Promise e a
	of = value => Promise.resolve(value),
	
	empty = () => Promise.resolve(),
	
	/**
	 * Note that `Promise.reject` rejects with any type including any Promise (unsettled, rejected or fulfilled)!
	 * @see https://stackoverflow.com/questions/39197769/what-happens-if-i-reject-a-promise-with-another-promise-value
	 * @template T
	 * @param {T} error it better be always an `Error`
	 * @return {Promise}
	 */
	// reject :: e -> Promise e a
	reject = error => Promise.reject(error),
	
	// Callback a :: a -> undefined
	// create :: (Callback a -> undefined) -> Promise * a
	// create :: ((Callback a, Callback e) -> undefined) -> Promise e a
	create = worker => new Promise(worker),
	
	// Transformation //
	
	/**
	 * shameless copy from Fluture
	 */
	// mapRej :: (e -> c) -> Promise e b -> Promise c b
	mapRej = curry((fn, aPromise) => aPromise.catch(o(reject, fn))),
	
	/**
	 * shameless copy from Fluture
	 */
	chainRej_ = curry((fn, aPromise) => aPromise.then(null, fn)),
	// this implementation enforces fn to return a promise
	// chainRej :: (e -> Promise g a) -> Promise e a -> Promise g b
	chainRej = curry((fn, aPromise) =>
		new Promise((resolve, reject_) => {
			aPromise.then(resolve, a => fn(a).then(resolve, reject_));
		})
	),
	
	// bimap :: Bifunctor m => (a -> c) -> (b -> d) -> m a b -> m c d
	bimap = curry((failureMap, successMap, aPromise) =>
		aPromise.then(successMap, o(reject, failureMap))),

	chain_ = (fn, value) => value.then(fn),
	// this implementation enforces fn to return a promise
	// chain :: (a -> Promise e b) -> Promise g a -> Promise (e|g) b
	chain = curry((fn, aPromise) =>
		new Promise((resolve, reject_) => {
			aPromise
			.then(a =>
				fn(a).then(resolve)
			)
			.catch(reject_);
		})),
	
	// chainIf :: (a -> Boolean) -> (a -> Promise a) -> Promise a -> Promise a
	chainIf = curry((predicate, fn, aPromise) =>
		new Promise((resolve, reject_) => {
			aPromise
			.then(a => predicate(a) ? fn(a).then(resolve) : resolve(a))
			.catch(reject_);
		})),
	
	// It's essentially Promise.then and named coalesce in crocks Async
	// coalesce :: (e -> b) -> (a -> b) -> Promise e a -> Promise e b
	coalesce = curry((left, right, p) =>
		p.then(right, left)
	),

  // In this implementation an exception in the side-effect rubs off to the Promise
  // tap :: (a -> *) -> Promise a -> Promise a
  tap = curry((fn, p) =>
    p.then(x => {
      fn(x);
      return x;
    })),

  /**
	* Execute a synchronous side effect.
	* In this implementation an exception in the side-effect is ignored.
	* <pre>
	* promise X ---------> X --->
	*          \
	*           - fn(X) -> Y
	* </pre>
	*
	* @aka forEach
   * @template A
   * @param {function(A):*} sideEffect
   * @return {function(Promise<A>): Promise<A>}
   */
  // tapRegardless :: (a -> *) -> Promise a -> Promise a
  tapRegardless = curry((fn, p) => {
    p.then(fn).catch(x => x);

    return p;
  }),
	
	/**
	 * Execute an asynchronous (could be a side-effect) function and wait until it is settled.
	 * Mostly like `tap` except for the wait part
	 * @template T
	 * @param {function(T): Promise<any>} fn asynchronous side effect
	 * @param {Promise<T>} p
	 * @return {Promise<T>}
	 */
	// chainTap :: (a -> Promise g *) -> Promise e a -> Promise (e|g) a
	chainTap = curry((fn, p) =>
		new Promise((resolve, reject_) => {
			p
			.then(a =>
				fn(a)
				.then(() => resolve(a))
			)
			.catch(reject_);
		})),

	/// Combinators ///
	
	// This implementation prioritises the left promise in way that
	// if the left promise fails it's rejected value takes precedence over
	// the rejected value of the right promise regardless of the time sequence.
	// Thus if the right promise fails that's UnhandledPromiseRejection
	// Note: ap(mf, ma) = chain(f => map(f, ma))
	// ap :: Promise (a -> b) -> Promise a -> Promise b
	/*ap_ = curry((fnPromise, aPromise) => fnPromise.then(fn => aPromise.then(fn))),*/
	
	// this implementation avoids the UnhandledPromiseRejection error
	// when Promise a fails.
	// Note: Is the UnhandledPromiseRejection really an issue?
	// It occurs only if there is no .catch or .then(, onError)
	// in a promise which is a result of ap (i.e. which is created on calling .then)
	// see https://stackoverflow.com/a/52409612/564642
	// ap :: Promise (a -> b) -> Promise a -> Promise b
	/*ap = curry((fnPromise, aPromise) => {
		if (typeof Promise.allSettled === 'function') {
			return Promise.allSettled([fnPromise, aPromise])
			.then(([fnOutcome, anOutcome]) => {
				if ((fnOutcome.status === 'fulfilled') && (anOutcome.status === 'fulfilled')) {
					return fnOutcome.value(anOutcome.value);
				}
				else if (fnOutcome.status === 'fulfilled') {
					return Promise.reject(anOutcome.reason);
				}
				else if (anOutcome.status === 'fulfilled') {
					return Promise.reject(fnOutcome.reason);
				}
				else if (anOutcome.reason === fnOutcome.reason) {
					return Promise.reject(fnOutcome.reason);
				}
				else {
					const
						aggregateError = new Error(`${fnOutcome.reason.message},\n${anOutcome.reason.message}`);
					
					aggregateError.name = "AggregateError";
					
					if (anOutcome.reason.name === "AggregateError") {
						aggregateError.errors = anOutcome.reason.errors.concat([fnOutcome.reason]);
					}
					else if (fnOutcome.reason.name === "AggregateError") {
						aggregateError.errors = fnOutcome.reason.errors.concat([anOutcome.reason]);
					}
					else {
						aggregateError.errors = [fnOutcome.reason, anOutcome.reason];
					}
					
					return Promise.reject(aggregateError);
				}
			});
		}
		else {
			return ap_(fnPromise, aPromise);
		}
	}),
	
	liftA2 = curry((fn, pa, pb) =>
		ap(map(fn, pa), pb)
	),*/
	
	// :: [Promise e a] -> Promise e [a]
	all = promises => Promise.all(promises),

	// :: [Promise e a] -> Promise e a
	race = promises => Promise.race(promises),
	
	/**
	 * Providing a means for a fallback or alternative value, alt combines two Promises and will
	 * resolve with the value of the first resolved promise it encounters or
	 * reject with the value of the last Rejected instance if it does not encounter a Resolved instance.
	 */
	// :: Promise e a -> Promise e a -> Promise e a
	alt = curry((pa, pb) => new Promise((resolve_, reject_) => {
		const
			rejectGenerator = function* () {
				reject_(yield);
			},
			rejectIterator = rejectGenerator(),
			rejectSecond = e => rejectIterator.next(e);
		
		pa.then(resolve_, rejectSecond);
		pb.then(resolve_, rejectSecond);
	}));

export {
	of, all, alt, bimap, chain, chainIf, chainTap, chainRej, coalesce, create, map, mapRej,
	race, reject, tap, tapRegardless, empty
};

export {default as ap} from './promise/ap.js';
export {default as later} from './promise/internal/laterSucceed.js';
export {default as liftA2} from './promise/liftA2.js';

export let join = identity;
/** @deprecated */
export let unit = empty;
