Promise
=======

Represents the eventual outcome or failure of an eagerly executed computation.

Related Work and Inspiration
----------------------------
[Applicative Functors](junker-apfun), [Futures](funfix-futures-api)
 
 [junker.apfun]: https://medium.com/@JosephJnk/an-introduction-to-applicative-functors-aea966799b1d
 [funfix-futures-api]: https://funfix.org/api/exec/classes/future.html
 
Generation
----------

### `later(dt, a)`
`:: number → a → Promise a`

### `of(a)`
`:: a -> Promise e a`

### `reject(e)`
`:: * -> Promise *`
Abbreviates `Promise.reject`. Note that `Promise.reject` rejects with *any type* including any Promise (unsettled, rejected or fulfilled)! Read [what happens][rejected-promise].

### `never()`
`:: () -> Promise ()`
Creates a Promise which never settles.

Transformation
-----------

### `chainRej(onError)`
`:: (e -> Promise g b) -> Promise e a -> Promise (e | g) (a | b)`

### `coalesce(onFailure, onSuccess, p)`
`:: (e -> b) -> (a -> b) -> Promise e a -> Promise e b`
It's essentially `Promise.then` and named coalesce in crocks Async.

Side-Effects
-----------

### `bi_tap(onFailure, onSuccess, p)`
`:: (* -> *) -> (a -> *) -> Promise a -> Promise a` 

Like [`tap`](#tap-fn-p) but also with a failure side-effect function.

### `tap(fn, p)`
`:: (a -> *) -> Promise a -> Promise a` 

In this implementation an exception in the side-effect `fn` rubs off to the Promise.

### `tapRegardless(fn, p)`
`:: (a -> *) -> Promise a -> Promise a` 

Execute a synchronous side effect. Aka *forEach*.

In this implementation an exception in the side-effect is ignored.
<pre>
promise X ---------> X --->
          \
           - fn(X) -> Y
</pre>

### `chainTap(fn, p)`
`:: (a -> Promise g *) -> Promise e a -> Promise (e|g) a`

Execute an asynchronous (could be a side-effect) function and wait until it is settled.
Mostly like [`tap`](#tap-fn-p) except for the wait part.

Combination
---------------

### `ap(promisedFunc, promise)`
`:: Promise (a → b) → Promise a → Promise b`

Parallel running version: Both Promises are treated equally in time, meaning if any fails the *first* failure is propagated to the result.

### `duplexRace(a, b)`
`:: Promise a → Promise a → Promise a`

It's `Promise.race` but only for *two* input promises.

[rejected-promise]:https://stackoverflow.com/questions/39197769/what-happens-if-i-reject-a-promise-with-another-promise-value
