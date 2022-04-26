[![NPM Version](https://img.shields.io/npm/v/@visisoft/staticland.svg?style=flat-square)](https://www.npmjs.com/package/@visisoft/staticland) ![Statements](https://img.shields.io/badge/statements-91.2%25-brightgreen.svg?style=flat-square)

[@visisoft/staticland](https://semmel.github.io/StaticLand/) v{{ config.meta.version }}
====================
Support programming in functional pipelines by exposing a familiar set of operations on asynchronous, optional and faulty data.

Operations (Transforming, Lensing, Combination, etc.) on Algebraic Data Types (ADT) (`Either`, `Maybe`, `Promise`, `CancelableComputation`) provided as sets *free static functions*.

Motivation
-----
For the motivation I'd like to refer to [James Sinclair's post on StaticLand][sinclair-static-land].

Data Types
--------
Each set of these *free static functions* expect a particular data-holding type. `@visisoft/staticland` is very un-opinionated about the data type. E.g. the operations on non-cancelable computations simply expect a `Promise` as data type. This makes crossing the boundary into and out of `@visisoft/staticland` especially easy. 

Each *data type* represents a particular *computational feature* or *aspect of programming*. For instance an optional value is a `Maybe`, and a `CancelableComputation` represents just that. `@visisoft/staticland` does not "provide" data types e.g. as classes for these *computational features*. It is not productive to find the *best implementation* of a data type. The function sets of `@visisoft/staticland` choose to operate on just the simplest JavaScript objects – `Array`, `Function` or (as already mentioned) `Promise`. In Functional Programming (FP) *factory* and *consumption functions* are provided to interface with external code.

Sets of Operations
------------------
To its particular data type, each set of operations permit the transforming, the combining, the iterating or the focusing on an item of the data structure. Thus, the sets of operations have a lot in common – e.g. each have the functions `map`, and `chain`.

Admittedly, this brings an inflation to the api surface when working with different data types. Also, since each use of e.g. `map` or `chain` is targeted to a particular data type, the operations must be carefully placed, so that with nested data types the sequence of operations reflects the structure of the nested data exactly.

On the other hand,

- the current data type can be derived by looking at the code,
- using the TypeScript signatures, the code inspector can deduce the type correctness, and
- third-party data types can be integrated in this concept without altering or augmenting their provided data type, but by simply writing another set of operations.

### FantasyLand
It is worth mentioning the competing concept of *FantasyLand*. It features a *unified set of operations* which operate on *all* compatible data types. It does so be enforcing compatible data types to implement a particular protocol – i.e. carefully named object methods.

The free static functions of FantasyLand are just a *shell* which *delegates* to the operation implemented in the particular method of the data object. One prominent provider of such shell functions is the FP toolkit [Ramda][ramda-homepage]. Behind the promising advantage of having a unified set of operations, FantasyLand has drawbacks. Even among Ramda users its adoption is not 100% which [this comment][adispring-comment] illustrates. 

- Library authors need to be convinced to understand the [FantasyLand protocol][fl-ref] and implement it in their data types.
- Often libraries already provide free static functions like `map` and `chain` tailored to their data type. These integrate nicely with the StaticLand concept.
- The FantasyLand specification has several versions, allowing for a possible mismatch between FP toolkit and the data type library

In the search to overcome these drawbacks the concept of *StaticLand* was discovered. Both concepts are compared in an [article by James Sinclair][sinclair-static-land].


[Homepage and Documentation](https://semmel.github.io/StaticLand/)
----------------------------------------

Hello @visisoft/staticland
--------------------------
### Installation
When developing for Node.js
```shell
npm install @visisoft/staticland
```

When developing for the browser
```shell
npm install --no-optional @visisoft/staticland
```

### Hello Earth

Greeting with a 0.5 sec 2-way delay.

#### Usage in an ES module

```javascript
import {map as map_p, mapRej as mapRej_p, chain as chain_p} from '@visisoft/staticland/promise';
import {fromThrowable} from '@visisoft/staticland/either';
import {fromNilable, getOrElse} from '@visisoft/staticland/maybe';
import {curry, pipe} from 'ramda'; // or pipe from 'crocks' or any other composition function

const 
   // :: String -> {k: String} -> Maybe String
   getProperty = R.curry((property, object) => fromNilable(object[property])),
   // :: a -> Promise any a
   delay = x => new Promise(resolve => setTimeout(resolve, 500, x)),
   // :: any -> Either Error String
   safeGreet = fromThrowable(x => "Hello " + x.toString() + "!"),
   // :: any -> Promise (Maybe String) String
   getAnswer = R.pipe(
      delay,                            // Promise any             any
      map_p(safeGreet),                 // Promise any             (Either Error String)
      chain_p(delay),                   // Promise any             (Either Error String)
      chain_p(eitherToPromise),         // Promise (any|Error)     String
      mapRej_p(getProperty('message'))  // Promise (Maybe String)  String
   );

getAnswer("Earth")
.then(console.log, me => console.warn(getOrElse("unknown error", me)));
// -> "Hello Earth!"

getAnswer(null)
.then(console.log, me => console.warn(getOrElse("unknown error", me)));
// -> "Cannot read property 'toString' of null"
```   

#### Usage in a CommonJS module

```javascript
const 
   {chain: chain_p} = require('@visisoft/staticland/promise'),
   delay = t => x => new Promise(resolve => setTimeout(resolve, t, x));

chain(delay(500), Promise.resolve("foo")).then(console.log);
```


Design
------
Most functions comply with [Static-Land][sl-ref]`s algebraic laws. Where this is not possible (e.g. nesting of resolved Promises) a few reasonable paradigms have to be followed when using this library.

At the expense of complete algebraic lawfulness the data wrapping remains transparent and light-weight.

The functions are designed to support the usual functional programming style in JavaScript as it is the design philosophy for many libraries for example [Ramda's](ramda-homepage):

- Emphasise a purer functional style. Immutability and side-effect free functions help to write simple yet elegant code.
- Automatic currying. This allows you to easily build up new functions from old ones simply by not supplying the final parameters.
- Parameter order supports convenient currying. The data to be operated on is generally supplied last, so that it's easy to create functional pipelines by [composing functions](wikipedia-fcompose).

Related Fantasy-Land Libraries
-----------------------------
[Ramda-Fantasy](ramda-fantasy) is very well documented, but sadly no longer maintained.
[Crocks](crocks) is an exemplary implementation of common data types.

Dependencies
------------

As FP utility library [Ramda][ramda-homepage] is used.

Implementation Details
---------------------

|           |   `of`        |   `map`       |   `chain`     |   Consumption |
|-----------|---------------|---------------|---------------|---------------|
|CancelableComputation| `cc = (resolve, reject) => () => ()` | | | `new Promise(cc)` |
| Either    | `x => [,x]` |`Array.prototype.map`|`Array.prototype.flatMap`|`xs => xs[1]`|
| Maybe     | `x => [x]`    |`Array.prototype.map`|`Array.prototype.flatMap`|`xs => xs[0]`|
| Promise   | `Promise.resolve`|`Promise.then`|`Promise.then`|`Promise.then`|
| IO        | `x => x`        |`compose`      |`run(compose)` |`call`|

###### closed over
A [closure] is the combination of a function and the lexical environment within which that function was declared.

[closure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
[sl-ref]: https://github.com/fantasyland/static-land/
[fl-ref]: https://github.com/fantasyland/fantasy-land
[ramda-homepage]: https://ramdajs.com
[wikipedia-fcompose]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
[ramda-fantasy]: https://github.com/ramda/ramda-fantasy
[crocks]: https://crocks.dev/docs/crocks/
[sinclair-static-land]: https://jrsinclair.com/articles/2020/whats-more-fantastic-than-fantasy-land-static-land
[adispring-comment]: https://github.com/ramda/ramda/issues/3264#issuecomment-1101877126
