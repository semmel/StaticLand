Cancelable Computation
======================

### Signature
`CancelableComputation e a :: ((a -> void), (e -> void)) -> (() -> void)`

Leaving the failure type to be implicitly an Error the signature can be shortened:
`CancelableComputation a :: ((a -> void), (* -> void)) -> (() -> void)`

Generator Functions
-------------------

### `of(value)`
`:: a -> Cancelable () a`

### `reject(e)`
`:: e => Cancelable e ()`

### `later(dt, value)`
`:: Number -> a -> Cancelable () a`

### `laterReject(dt, e)`
`:: Number -> e -> Cancelable e ()`

### `fetchResponse({url, fetchSpec})`
`:: {url: (String|URL), init: {}} -> Cancelable Error Response`

This example fetches the number of libraries hosted at [cdnjs.com](https://cdnjs.com/api).

The result is a Cancelable of a Maybe of a Number. The 
- *failure continuation* of the cancelable contains network *errors* and errors in the JSON format of the response, 
- *nothing* path of the maybe is taken in case the combined network and parse duration exceeded the *timeout*,
- the *just* path of the Maybe in the *success continuation* of the Cancelable contains the *result*.

```javascript
import {ap, pair, pipe} from 'ramda';
import {chain as chain_c, later, map as map_c, fetchResponse} 
from '@visisoft/staticland/cancelable';
import { eitherToCancelable, keyPromiseToPromiseCollection, promiseToCancelable } 
from '@visisoft/staticland/transformations';
import { chain as chain_e, right, left } from '@visisoft/staticland/either';
import {nothing, just, maybe } from '@visisoft/staticland/maybe';

const 
   // :: Pair Response {k:v} => Either {k:v}
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

### `map(f, cancelable)`
`:: (a → b) → Cancelable a → Cancelable → b`

### `chain(f, cancelable)`
`:: (a → Cancelable b) → Cancelable a → Cancelable → b`

Combinations
------------

### `ap(cancelableFunc, cancelable)`
`:: Cancelable (a → b) → Cancelable a → Cancelable b`

Parallel running version: It runs both Cancelable arguments in parallel.

Note that when implemented simply `ap(mf, ma) = chain(f => map(f, ma), mf)` will *not* run the Cancelable Computations in *parallel*.

### `liftA2(f, ccA , ccB)`
`:: (a → b → c) → Cancelable a → Cancelable b → Cancelable c`

Equivalent to `(f, pa, pb) => Promise.all([pa, pb]).then(([a, b]) => f(a, b))`. `f` must be curried.

Note that when implemented by **sequential** running **`ap`**, `liftA2(f, ma, mb) = ap(map(f, ma), mb)` will *not* run the Cancelable Computations in *parallel*.

### `race(cancelableA, cancelableB)`
`:: Cancelable a → Cancelable a → Cancelable a`

Like `Promise.race` shortcuts (i.e. aborts the other) when any input value is settled with success or failure.

Utility
-------

### `share(cancelable)`
`:: Cancelable e a → Cancelable e a`
