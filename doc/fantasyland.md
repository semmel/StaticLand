FantasyLand
===========

Trivial set of wrapper functions which delegate to the free static functions for Promise ([`@visisoft/staticland/promise`](promise.md)) – if the data type is Promise, otherwise to their implementations in [Ramda][ramda-homepage].

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

[ramda-homepage]: https://ramdajs.com
