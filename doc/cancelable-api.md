Cancelable Computation
======================

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

Combinations
------------

### `race(cancelableA, cancelableB)`
`:: Cancelable e a → Cancelable e a → Cancelable e a`

Like `Promise.race` shortcuts (i.e. aborts the other) when any input value is settled.

Utility
-------

### `share(cancelable)`
`:: Cancelable e a → Cancelable e a`
