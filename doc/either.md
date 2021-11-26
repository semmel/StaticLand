Either
======
represents two mutually exclusive values, e.g. instead of throwing, a computation could return a computed result or a computational error in an Either.

As by convention the generally anticipated outcome is stored as a `right`, while the exceptional value is a `left`.

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
### `map(fn, ma)`
`:: (a -> b) -> Either c a -> Either c b`

Consumption
-----------
### `either(onLeftVal, onRightVal, m)`
`::  (c -> b) -> (a -> b) -> Either c a -> b`
