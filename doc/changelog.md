Changelog v{{ config.meta.version }}
=========
0.2.2
-----
- *breaking:* Either type is now implemented as ES6 class (taken from the Mostly Adequate Guide) instead of an array of length 2
- feat: Either now a FantasyLand Monad and Setoid type

0.2.0
-----
- renamed `point-free` submodule to `fantasyland`,
- fixed tests for Node v16

0.2.0
-----
- `point-free` functions `ap`, `chain`, `map`, `pluck`, `liftA2` to support FantasyLand types *and* native Promise
- Fantasy-Land support for Cancelables

0.1.43
------
- `maybe/pluck`

0.1.42
------
- Maybe and Either are now "opaque" TS types. 

0.1.40
-------
- `cancelable/liftA3`, `cancelable/liftA4`

0.1.39
----
- `cancelable/pluck`

0.1.38
----
- adds: `either/traverse`, `either/sequence`

0.1.37
-----
- chore: replaced `semmel-ramda` v0.33.0 with `ramda` v0.28.0

0.1.36
-----
- fix: `cancelable/ap` and thus `cancelable/liftA2` did always resolve the right argument with `undefined`.

0.1.35
-----
- fix: `transformations/cancelableToEventStream` avoid cancellation for synchronous calls (e.g. when the stream ends thus calling `abort` synchronously on behalf of `sink(x)`

0.1.34
-----
- fix: `transformations/cancelableToEventStream` no longer invokes the Cancelable's `abort` function if the event stream ends after the Cancelable has settled.

0.1.33
-----
- exceptions in the `cancelable/bi_tap` functions get picked up

0.1.32
-----
- added `cancelable/share`

0.1.31
-----
- migrate `cancelable/fetchResponse(NodeJS)` to `cancelable/fetchResponseIsoModule(globalThis)`

0.1.30
-----
- forgot either/isEither to export

0.1.29
-------
- adds `cancelable/cancelify`

0.1.28
-----
- test: eitherToPromise

0.1.27
-----
- lenses
- Breaking: removed `unlens`, `propUnlens`, `indexUnlens`

0.1.26
------
- unlens, propUnlens, indexUnlens

0.1.25
------
- `duplexRace` for Promise

0.1.24
------
- `find_l`

0.1.23
------
- `bi_tap`

0.1.22
------
- updated rollup plugin

0.1.21
------
- added `sequence` and `traverse` for Arrays ("Lists")
- added `sequence` and `traverse` for Maybe

0.1.20
------
- added `maybeOfCancelableToCancelableOfMaybe`
- moved to JSON license
- generate HTML doc and publish on GitHub pages

0.1.19
------
- added `maybeOfBaconObservableToBaconObservableOfMaybe`

0.1.16
-------
- Begun API for CancelableComputation incl. natural transformations to and from Bacon and Most streams

0.1.15
------
- fix: Either no longer based on a unique Symbol but rather on a unique string. This should make Either compatible with a differently loaded staticland library.

0.1.11
------
- more submodules for Node.js consumption

0.1.4
-----
- Adds transformation `maybeOfPromiseToPromiseOfMaybe`

0.1.2
-----
- Added transformations

0.1.1
-----
- Added Either type
- Added transformations fo Either and Maybe to Promise
