Natural Transformations
=======================

Extracting from/Wrapping with Collections
-----------------------------------------

### `keyMaybeToMaybeObj(key, coll)`
`:: key -> {key: Maybe a, …} -> Maybe {key: a, …}`

`:: Idx -> [Idx: Maybe a, …] -> Maybe [Idx: a, …]`

Async Stuff
-----------

### `maybeOfPromiseToPromiseOfMaybe(promiseOfMaybe)`
`:: Maybe Promise e a -> Promise e Maybe a`

### `maybeOfCancelableToCancelableOfMaybe(mma)`
`:: Maybe Cancelable e a -> Cancelable e Maybe a`

### `eitherToCancelable(either)`
`:: Either e a → Cancelable e a`

### `promiseToCancelable(promise)`
`:: Promise e a → Cancelable e a`

The transformation is with limitations:
- Eagerness cannot be transformed into laziness, i.e. the computation represented by the promise is already executing or even settled.
- The computation cannot be cancelled. Cancelling the resulting Cancelable will simply prevent the continuation callbacks from getting called once the promise settles.

### `cancelableToPromise(cancelable)`
`:: Cancelable e a → Promise e a`

Since promises are eager, this transformation will run the cancelable computation. The ability to cancel the computation will be lost.

Note that in principle, the ability to cancel the computation could be maintained. However, a result of the cancellation would then be that the created Promise never settles. That is considered to be bad practise.

Async into/from Reactive Streams
--------------------------------

### `cancelableToEventStream(cancelable)`
`:: Cancelable e a → EventStream e a`

Creates a single-valued [Bacon.js](http://baconjs.github.io) `EventStream` observable.

### `observableToCancelable(observable)`
`:: Observable e a → Cancelable e a`

### `cancelableToMostStream(cancelable)`
`:: Cancelable a → Stream a`

Crates a single-valued [@most/core](https://mostcore.readthedocs.io/en/latest/index.html) `Stream`.

### `mostStreamToCancelable(stream)`
`:: Stream a → Cancelable a`

If not cancelled the resulting Cancelable Computation will continue with the *last* value, or the *first* error in the stream.

Maybe/Either into/from Reactive Streams
---------------------------------------

### `maybeOfBaconObservableToBaconObservableOfMaybe(maybeObservable)`
`:: Maybe Observable a -> Observable Maybe a`
