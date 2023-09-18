Either
======
represents two mutually exclusive values, e.g. instead of throwing, a computation could return a computed result or a computational error in an Either.

As by convention the generally anticipated outcome is stored as a `right`, while the exceptional value is a `left`.

### FantasyLand
provides [FantasyLand 4.0][FL-4] Monad and Setoid interface.

Generators
-----------
### `right(a)`
`:: a -> Either * a`

### `left(c)`
`:: c -> Either c *`

### `fromThrowable(fn)(...args)`
`:: (…b -> a) -> …b -> Either c a`

### `fromAssertedValue(predicate, makeLeftValue, a)`
`:: (a -> Boolean) -> (a -> c) -> a -> Either c a`

Inspection
---------
### `isRight(m)`
`:: Either c a -> Boolean`

### `isLeft(m)`
`:: Either c a -> Boolean`

### `isEither(m)`
`:: Either c a -> Boolean`

Transformation
-------------

### `bimap(fnLeft, fnRight, ma)`
`:: (c -> d) -> (a -> b) -> Either c a -> (Either c b) | (Either d a)`

Combining
-------

### `chain(fn, ma)`
`:: Either m ⇒ (a → m e b) → m c a → m e b`

Useful for converting a right to a left.

Can use also use `fantasylanc/chain` or Ramda `chain`.

### `chainLeft(fn, ma)`
`:: Either m ⇒ (c → m e b) → m c a → m e b`

Useful for converting a left to a right.

### `join(m)`
`:: Either (Either a) → Either a`

### ~~`map(fn, ma)`~~
`:: (a -> b) -> Either c a -> Either c b`

*Deprecated:* Use `fantasyland/map` or Ramda `map`

### ~~`sequence(of_f, map_f, EitherOfF)`~~
`:: Applicative f => ((a → f a), ((a → b) → f a → f b) → Either c (f a) → f (Either c a)`

*Deprecated:* Use `fantasyland/sequence` or Ramda `sequence`

Swap the sequence of types: **Maybe** of *Functor* of Value to *Functor* of **Maybe** of Value. Maybe takes the role of a "Traversable" `t`.

### ~~`traverse(of_f, map_f, effect_to_f, either)`~~
`:: (Applicative f, Traversable t) => (c → f c) → ((a → b) → f a → f b) → (a → f b) → Either c a → f (Either c b)`

*Deprecated:* Use `fantasyland/traverse` or Ramda `traverse`

Applies an "effect" `effect_to_f` to the value inside the Maybe. Then combines that "effect" with the Maybe by wrapping the "effect's" result in an Applicative of a Maybe. 

If, for instance the "effect" is an asynchronous computation wrapped in a Promise `a → Promise b`, it might make more sense to work with a Promise of a Maybe than a Maybe of a Promise. 

Using `traverse` essentially combines mapping the `effect_to_f` over the Maybe *and* calling `sequence(of_f, map_f)` in a single step.

Consumption
-----------
### `either(onLeftVal, onRightVal, m)`
`::  (c -> b) -> (a -> b) -> Either c a -> b`


[FL-4]: https://github.com/fantasyland/fantasy-land/tree/v4.0.1#fantasy-land-specification
