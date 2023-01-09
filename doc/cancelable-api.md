Cancelable Computation
======================

### Signature
`CancelableComputation e a :: ((a -> void), (e -> void)) -> (() -> void)`

Leaving the failure type to be implicitly an Error the signature can be shortened:
`CancelableComputation a :: ((a -> void), (* -> void)) -> (() -> void)`

### FantasyLand
provides [FantasyLand 4.0 Monad][FL-4-Monad] interface.

Generator Functions
-------------------

### Custom Cancelable `fantasyfy`
Every *function* taking two callbacks as arguments;

- a success callback, and
- a failure callback

which returns an abort function, and which calls one of the callbacks asynchronously can be treated as a *Cancelable*.

```javascript
import { addFantasyLandInterface } from '@visisoft/staticland/cancelable';
let cancelableWork = (res, rej) => {
	const work = beginSomeLongWork();
	whenCompletedWithResult(work, result => res(result));
	whenFailedWorkWithError(work, error => res(error));
   
	return () => { abort(work); };
};
addFantasyLandInterface(cancelableWork);
```

In order to provide *FantasyLand* methods such a function needs to be wrapped with `fantasyfy`.

### `of(value)`
`:: a -> Cancelable () a`

### `reject(e)`
`:: e => Cancelable e ()`

### `never()`
`:: () -> Cancelable () ()`
Creates a Cancelable which executes nothing and never settles.

### `later(dt, value)`
`:: Number -> a -> Cancelable () a`

### `laterReject(dt, e)`
`:: Number -> e -> Cancelable e ()`

### `cancelify(f)`
`:: (*... → Promise e a) → *... → Cancelable e a`

Takes a function `f` which generates a non-abort-/non-cancel-able Promise and returns a function with the same arguments but which returns a Cancelable. The computation cannot be cancelled. Cancelling the resulting Cancelable will simply prevent the continuation callbacks from getting called once the promise settles.

See [`promiseToCancelable`](transformations.md#promisetocancelablepromise).

### `fetchResponse({url, fetchSpec})` via `fetchResponseIsoModule`
`:: {url: (String|URL), init: {}} -> Cancelable Error Response`

This example fetches the number of libraries hosted at [cdnjs.com](https://cdnjs.com/api).

The result is a Cancelable of a Maybe of a Number. The 
- *failure continuation* of the cancelable contains network *errors* and errors in the JSON format of the response, 
- *nothing* path of the maybe is taken in case the combined network and parse duration exceeded the *timeout*,
- the *just* path of the Maybe in the *success continuation* of the Cancelable contains the *result*.

```javascript
import {ap, pair, pipe} from 'ramda';
import {chain as chain_c, later, map as map_c, fetchResponseIsoModule} 
from '@visisoft/staticland/cancelable';
import { eitherToCancelable, keyPromiseToPromiseCollection, promiseToCancelable } 
from '@visisoft/staticland/transformations';
import { chain as chain_e, right, left } from '@visisoft/staticland/either';
import {nothing, just, maybe } from '@visisoft/staticland/maybe';
// assume we are running in Node.js
import fetch from 'node-fetch';
import AbortController from "abort-controller";

const 
   // :: {url: (String|URL), init: {}} -> Cancelable Error Response
   fetchResponse = fetchResponseIsoModule({fetch, AbortController}),
   // in a Browser this would be
   fetchResponse = fetchResponseIsoModule(globalThis);
   // :: Pair Response {k:v} -> Either {k:v}
   checkFetchResponseWithPayload = ([response, payload]) =>
	   response.ok ?
		   right(payload) :
		   left({
			   message: response.statusText,
			   code: response.status,
			   payload
		   }),
   
   // :: {k:v} -> Either Number
   checkStatsResult = payload => 
      typeof payload.libraries === "number" ?
         right(payload.libaries) :
         left({
            message: "Unexpected API response",
            payload
         }),
   
   // :: Cancelable Maybe Number
   numberOfCDNJSLibraries = pipe(
       () => fetchResponse({url: "https://api.cdnjs.com/stats", init: { mode: "cors" }}),  // :: Cancelable Response
       map_c(ap(pair, response => response.json())),            // :: Cancelable Pair (Response) (Promise {k:v})
       map_c(keyPromiseToPromiseCollection(1)),                 // :: Cancelable Promise Pair (Response) ({k:v})
       chain_c(promiseToCancelable),                            // :: Cancelable Pair (Response) ({k:v})
       map_c(checkFetchResponseWithPayload),                    // :: Cancelable Either {k:v}
       map_c(chain_e(checkStatsResult)),                        // :: Cancelable Either Number
       chain_c(eitherToCancelable),                             // :: Cancelable Number
       map_c(just),                                             // :: Cancelable Maybe Number
       race(later(1000, nothing())),                            // :: Cancelable Maybe Number
    )();
	

new Promise(numberOfCDNJSLibraries)       // running
.then(                                    // consuming
	maybeCount => { 
		console.log(maybe(
           () => "Info: API request did not complete in time.", 
           n => `Result: CDNJS hosts ${n} libraries.`, 
           maybeCount
        )); 
    }, 
   error => { 
		console.log(`Error: fetching CNDJSAPI: "${error.message}".\nData received:"${JSON.stringify(error.payload)}"`); 
	}
);
```

Transformation
--------------

### `coalesce(onFailure, onSuccess, cancelable)`
`:: Cancelable c ⇒ (x → b) → (a → b) → c x a → c x b`

Maps failure via `onFailure` and success via `onSuccess` to new success value.

### `map(f, cancelable)`
`:: (Cancelable x) c ⇒ (a → b) → c a → c b`

### `biMap(f, cancelable)`
`:: Cancelable c ⇒ (x → y) → (a → b) → c x a → c y b`

### ~~`pluck(key)`~~ 
`:: Cancelable c ⇒ k → c {k: v} → c v`

`:: Cancelable c ⇒ number → c [v] → c v`

Simply `k => map(R.prop(k))` for mapping to a key value.

*Deprecated* use `pluck` from Ramda via fantasy-land api.

### `chain(f, cancelable)`
`:: (a → Cancelable b) → Cancelable a → Cancelable b`

### `biChain(fnLeft, fnRight, cancelable)`
`:: Cancelable c ⇒ (* → c b) → (a → c b) → c a → c b`

Side-Effects
-----------

### `bi_tap(onFailure, onSuccess)`
`:: (e -> *) -> (a -> *) -> Cancelable e a -> Cancelable e a`

If either function throws an error, the present outcome is replaced by a failure given of that error.

Combinations
------------

### `ap(cancelableFunc, cancelable)`
`:: Cancelable (a → b) → Cancelable a → Cancelable b`

*Parallel* running version: It runs both Cancelable arguments in parallel.

Note that *if it was* implemented simply `ap(mf, ma) = chain(f => map(f, ma), mf)` will *not* run the Cancelable Computations in *parallel*.

### `liftA2(f, ccA , ccB)`
`:: (a → b → c) → Cancelable a → Cancelable b → Cancelable c`

Equivalent to `(f, pa, pb) => Promise.all([pa, pb]).then(([a, b]) => f(a, b))`. `f` must be curried.

Note that when implemented by *sequentially* running *ap*, `liftA2(f, ma, mb) = ap(map(f, ma), mb)` will *not* run the Cancelable Computations in *parallel*.

### `liftA3(f, ccA , ccB, ccC)`
`:: (a → b → c → d) → Cancelable a → Cancelable b → Cancelable c → Cancelable d`

### `liftA4(f, ccA , ccB, ccC, ccD)`
`:: (a → b → c → d → e) → Cancelable a → Cancelable b → Cancelable c → Cancelable d → Cancelable e`

### `race(cancelableA, cancelableB)`
`:: Cancelable a → Cancelable a → Cancelable a`

Like `Promise.race` shortcuts (i.e. aborts the other) when any input value is settled with success or failure.

Utility
-------

### `share(cancelable)`
`:: Cancelable e a → Cancelable e a`

*Caches* the computational result for *sharing* with many consumers without the need for re-computation. See the [section on Copying/Sharing Cancelables](cancelable.md#copyingsharing) and it's role model [Fluture.cache](https://github.com/fluture-js/Fluture#cache).


[FL-4-Monad]: https://github.com/fantasyland/fantasy-land/tree/v4.0.1#monad
