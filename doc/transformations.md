Natural Transformations
=======================
 
Async Stuff
-----------

### `maybeOfCancelableToCancelableOfMaybe(mma)`
`:: Maybe Cancelable e a -> Cancelable e Maybe a`

### `eitherToCancelable(either)`
`:: Either e a → Cancelable e a`

"Alias" for `either(reject_cancelable, of_cancelable);`

### `eitherToPromise`
`:: Either c a → Promise a`
Since the Either represents an immediate value, the returned Promise is settled.

### `promiseToCancelable(promise)`
`:: Promise e a → Cancelable e a`

The transformation is with limitations:
- Eagerness cannot be transformed into laziness, i.e. the computation represented by the promise is already executing or even settled.
- The computation cannot be cancelled. Cancelling the resulting Cancelable will simply prevent the continuation callbacks from getting called once the promise settles.

See [`cancelable/cancelify`](cancelable.md#cancelifyf). 

Note that `promiseToCancelable(p) ≡ cancelify(() => p)`.

### `cancelableToPromise(cancelable)`
`:: Cancelable e a → Promise e a`

Since promises are eager, this transformation will run the cancelable computation. The ability to cancel the computation will be lost.

Note that in principle, the ability to cancel the computation could be maintained. However, a result of the cancellation would then be that the created Promise never settles. That is considered to be bad practise.

### ~~maybeOfPromiseToPromiseOfMaybe(promiseOfMaybe)~~ 
`:: Maybe Promise e a -> Promise e Maybe a`

*Deprecated:* instead use `maybe/sequence(of_p, map_p)`

Async into/from Reactive Streams
--------------------------------

### `cancelableToEventStream(cancelable)`
`:: Cancelable e a → EventStream e a`

Creates a single-valued [baconjs](http://baconjs.github.io) `EventStream` observable.

If the stream ends *after* the Cancelable Computation *has settled*, the cancel function of the latter is (of course) *not* called.

### `observableToCancelable(observable)`
`:: Observable e a → Cancelable e a`

It evaluates the *last* event (error or value event) of the given observable.

Since *baconjs* streams are implicitly *shared* and *not lazy*, converting them to lazy Cancelables can run to racing problems. 

```javascript
const 
   s = B.once("foo"),
   sc = observableToCancelable(s),
   spc = observableToCancelable(s.toProperty());
s.onValue(console.log); // -> "foo"
new Promise(sc).then(console.log);  // never settles!
new Promise(spc).then(console.log); // never settles!
const 
   p = B.once("bar").toProperty(),
   pc = observableToCancelable(p);
p.onValue(console.log); // -> "bar"
new Promise(pc).then(console.log) // -> "bar"
```

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

Extracting from/Wrapping with Collections
-----------------------------------------

### ~~keyMaybeToMaybeObj(key, coll)~~
`:: key -> {key: Maybe a, …} -> Maybe {key: a, …}`

`:: Idx -> [Idx: Maybe a, …] -> Maybe [Idx: a, …]`

*Deprecated:* Consider from `lens`

- `sequence(propertyLens(key)(map_mb), coll)` or
- `sequence(indexLens(idx)(map_mb), coll)`.
