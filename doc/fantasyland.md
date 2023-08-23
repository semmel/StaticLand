FantasyLand (`/fantasyland`)
===========

Trivial set of wrapper functions `f` which 
- delegate to the free static functions for Promise ([`@visisoft/staticland/promise`](promise.md)) – if the data type is Promise, otherwise
- – except for `sequence` and `traverse` – delegate to their implementations in [Ramda][ramda-homepage]. 

In turn Ramda  
- dispatches to `Type.f`, or 
- dispatches to `Type["fantasy-land/f"]`, or
- implements for Lists if `Type` is `Array`, or
- implements for [Function Functors][tom-function-functors] if `Type` is `Function`.

This set of *utility functions* is typically provided by many FP libraries. The distinction is that this set
- supports `Promise` as type, and
- improving on Ramda `v0.28` expects `Type.traverse`, i.e. `Type['fantasy-land/traverse]` to comply with the [FL signature][traverse-fl-signature]

### `ap(mfn, ma)`
`:: Apply m ⇒ m (a → b) → m a → m b`

- dispatches to `ma['fantasy-land/ap']` or `@visisoft/staticland/promise/ap`, 
- not implemented as and not equivalent to `ap(mf, ma) = chain(f => map(f, ma), mf)`

### `chain(f, fa)`
`:: Functor f ⇒ (a → f b) → f a → f b`

### `liftA2(f, mA , mB)`
`:: Functor m ⇒ (a → b → c) → m a → m b → m c`

- `f` must be curried.
- implemented as `liftA2(f, ma, mb) = ap(map(f, ma), mb)`

### `map(fn, f)`
`:: Functor f ⇒ (a → b) → f a → f b`

`:: (a → b) → [a] → [b]`

`:: (a → b) → {k: a} → {k: b}`

### `pluck(key, f)` 
`:: Functor f ⇒ k → f {k: v} → f v`

`:: Functor f ⇒ number → f [v] → f v`

Simply `k => map(R.prop(k))` for mapping to a key value.

### `sequence(F, tfa)`
`:: (Applicative f, Traversable t) => TypeRep f -> t f a -> f t a`

### `traverse(F, a2fb, ta)`
`:: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f t b`

[ramda-homepage]: https://ramdajs.com
[tom-function-functors]: http://www.tomharding.me/2017/04/15/functions-as-functors/
[traverse-fl-signature]: https://github.com/fantasyland/fantasy-land#fantasy-landtraverse-method
