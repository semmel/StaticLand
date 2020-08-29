[![Dependencies](https://img.shields.io/david/semmel/StaticLand.svg?style=flat-square)](https://david-dm.org/semmel/StaticLand)

@visisoft/StaticLand (SL)
=========================
Operations on Algebraic Data Types (ADT) (Maybe, Promise) realised with *free static functions*. The static functions do not expect custom-made ADTs but work on *native JavaScript types* as `Array` and `Promise`.  

Objective
---------

Support programming in functional pipelines by exposing a familiar set of operations on asynchronous and optional data.

Design
------
Most functions comply with [Static-Land][sl-ref]`s algebraic laws. Where this is not possible (e.g. nesting of resolved Promises) a few reasonable paradigms have to be followed when using this library.

At the expense of complete algebraic lawfulness the data wrapping remains transparent and light-weight.

The functions are designed to support the usual functional programming style in JavaScript as it is the design philosophy for many libraries for example [Ramda's](ramda-homepage):

- Emphasise a purer functional style. Immutability and side-effect free functions help to write simple yet elegant code.
- Automatic currying. This allows you to easily build up new functions from old ones simply by not supplying the final parameters.
- Parameter order supports convenient currying. The data to be operated on is generally supplied last, so that it's easy to create functional pipelines by [composing functions](wikipedia-fcompose).

Related Work
------------
[Ramda-Fantasy](ramda-fantasy) is very well documented, but sadly no longer maintained.

[sl-ref]: https://github.com/fantasyland/static-land/
[ramda-homepage]: https://ramdajs.com#what-s-different-
[wikipedia-fcompose]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
[ramda-fantasy]: https://github.com/ramda/ramda-fantasy