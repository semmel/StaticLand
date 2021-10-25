Changelog v{{ config.meta.version }}
=========
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
