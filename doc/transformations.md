Natural Transformations
=======================

### `promiseToCancelable(promise)`
`:: Promise e a → Cancelable e a`

The transformation is with limitations:
- Eagerness cannot be transformed into laziness, i.e. the computation represented by the promise is already executing or even settled.
- The computation cannot be cancelled. Cancelling the resulting Cancelable will simply prevent the continuation callbacks from getting called once the promise settles.

### `cancelableToPromise(cancelable)`
`:: Cancelable e a → Promise e a`

Since promises are eager, this transformation will run the cancelable computation. The ability to cancel the computation will be lost.

Note that in principle, the ability to cancel the computation could be maintained. However, a result of the cancellation would then be that the created Promise never settles. That is considered to be bad practise.

### `cancelableToBaconStream(cancelable)`
`:: Cancelable e a → EventStream e a`

Creates a single-valued [Bacon.js](http://baconjs.github.io) `EventStream` observable.

### `baconObservableToCancelable(observable)`
`:: Observable e a → Cancelable e a`
