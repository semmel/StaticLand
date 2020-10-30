/**
 * StaticLand: promise.js
 *
 * see https://medium.com/@JosephJnk/an-introduction-to-applicative-functors-aea966799b1d
 * https://funfix.org/api/exec/classes/future.html
 */

import { curry, o, identity } from 'semmel-ramda';

const
	// Creation //
	
	// Applicative
	// of :: a -> Promise e a
	of = value => Promise.resolve(value),
	
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
	
	

	ap_ = curry((fnPromise, aPromise) => fnPromise.then(fn => aPromise.then(fn))),
  // this implementation avoids the UnhandledPromiseRejection error
  // when Promise a fails
  // ap :: Promise (a -> b) -> Promise a -> Promise b
  ap = curry((fnPromise, aPromise) => {
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
	
	// Transformation //

	// map :: (a -> b) -> Promise e a -> Promise e b
	map = curry((fn, aPromise) => aPromise.then(fn)),
	
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
  });

export {
	of, ap, bimap, chain, chainRej, coalesce, create, map, mapRej, reject, tap, tapRegardless
};

export let join = identity;
