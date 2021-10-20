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

Consumption
-----------

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

Combination
---------------

### `duplexRace(a, b)`
`:: Promise a → Promise a → Promise a`

It's `Promise.race` but only for two input promises.
