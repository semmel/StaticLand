Changelog
=========
2.1.4
---
- test: fix lowered async delay which was too long for the GitHub CI
- test: removed unused manual browser test page
- chore: test with coverage only when publishing docs
- chore: update to latest Ramda dependency

2.1.0
---

### Cancelables
`fromNodeCallback`, `of`, `reject` also moved from using the Macrotask queue (`setTimeout`) to the Microtask queue

2.0.0
---
*breaking*

- update to Ramda `v0.29.1`
- `cancelable/deferred` now uses the [Microtask queue][microtask] (i.e. `queueMicrotask`) instead of the Macrotask queue (i.e. `setTimeout`)

*features*

- removed `emittery` dependency 

2.0.0-alpha.3
----
- un-deprecated `cancelable/fetchResponse`

2.0.0-alpha.2
---
- refactor `cancelable` to avoid circular source file dependencies

1.2
---
- adds `cancelable/fromNodeCallbackWithArity`

1.1
---
- adds `either/bimap`

1.0.0
---
- adds `nth`, `last` and `head` to `/list`

0.7.0
---
- detect `Maybe` and `Either` instances no longer when both instances have the *same* `Maybe` or `Either` *prototype class*, but when they have the *same [well-known symbol][wks]* `"@@type"`. This will permit an app to use `Maybe`s and `Either`s from different module versions of `@visisoft/staticland`. `"@@type"` is also used by *monet* and *sanctuary*. 
- overloaded `instanceof` for `Maybe` and `Either` to operate just on `other['@@type']`. Choosing this approach instead of comparing everywhere `['@@type']`s, preserves the ability to use Ramda's `R.is` utility function. 

0.6.1
---
- removed `dist/cjs/cancelable/cancelable-pre-node-v18` because it never worked
- `baconjs` is now a "peer dependency"

0.6
---
### **Breaking**

- moved deprecated NodeJs version of `fetchResponseNodeJS` into own CJS module `/cancelable/cancelable-pre-node-v18`
- changed the `Either` method `"fantasy-land/traverse"` to comply with Fantasy Land,
- changed the `Either` methods `sequence` and `traverse` to match those of [Crocks](https://crocks.dev/docs/crocks/Either.html#traverse) (and others)

### Features

- replaced the `Array` based implementation of `Maybe` with a "mostly adequate", Fantasy Land compliant one,
- introduced `Either.ap` and thus make `lift` possible for `Either` data
- `Maybe.ap` and `Either.ap` 
   - share the signatures with their Fantasy Land versions,
   - thus they're the same as in monet.js, purify and Tom Harding's blog but differ from Prof. Frisby's Guide and Crocks,
   - are just provided for convenience,
- added pointfree-style `fantasyland/sequence` and `fantasyland/traverse` with signatures like in `crocks/pointfree` and will be in Ramda `v0.29`

0.5.1
----
- `cancelable/cancelifyWithArityAbortable`
- fixes [conditional exports](https://nodejs.org/dist/latest-v18.x/docs/api/packages.html#conditional-exports). (`default` should have come last)

0.5.0
----
- `cancelable/createDeferred`

0.4.0
---
- `cancelable/biMap`

0.3.0
----
- `cancelable/biChain`

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

[wks]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#well-known_symbols
[microtask]: https://javascript.info/event-loop#macrotasks-and-microtasks
