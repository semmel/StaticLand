[![Dependencies](https://img.shields.io/david/semmel/StaticLand.svg?style=flat-square)](https://david-dm.org/semmel/StaticLand) [![NPM Version](https://img.shields.io/npm/v/@visisoft/staticland.svg?style=flat-square)](https://www.npmjs.com/package/@visisoft/staticland)

[@visisoft/staticland](https://semmel.github.io/StaticLand/) v{{ config.meta.version }}
====================
Operations on Algebraic Data Types (ADT) (Either, Maybe, Promise, CancelableComputation) realised with *free static functions*. The static functions do not expect custom-made ADT classes but work on the *native JavaScript types* as `Array`, `Promise` and `Function`. Fairness demands to confess that `Function` carries some data in the closed over variables. 

Using simple native types means that 

- Conversion between the types is easy, but
- *@visisoft/staticland* practically gives up on type inspection and leaves that to the calling code. This is in line with the characteristics of JavaScript. 

|           |   `of`        |   `map`       |   `chain`     |   Consumption |
|-----------|---------------|---------------|---------------|---------------|
| Maybe     | `x => [x]`    |`Array.prototype.map`|`Array.prototype.flatMap`|`xs => xs[0]`|
| Either    | `x => [,x]` |`Array.prototype.map`|`Array.prototype.flatMap`|`xs => xs[1]`|
|CancelableComputation| `cc = (resolve, reject) => () => ()` | | | `new Promise(cc)` |
| Promise   | `Promise.resolve`|`Promise.then`|`Promise.then`|`Promise.then`|
| IO        | `x => x`        |`compose`      |`run(compose)` |`call`|

In a way @visisoft/staticland provides functions which operate on and access types you operate with anyway.

[Homepage and Documentation](https://semmel.github.io/StaticLand/)
----------------------------------------

Hello @visisoft/staticland
--------------------------
### Installation
`npm install @visisoft/staticland`

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

Objective
---------

Support programming in functional pipelines by exposing a familiar set of operations on asynchronous, optional and faulty data.

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

As FP utility library [Ramda][ramda-homepage] is used. The patch fork [semmel-ramda][semmel-ramda] will be replaced with Ramda when it gets published as proper dual-mode or [hybrid][2-ality-hybrid] module.

[sl-ref]: https://github.com/fantasyland/static-land/
[ramda-homepage]: https://ramdajs.com
[2-ality-hybrid]: https://2ality.com/2019/10/hybrid-npm-packages.html
[semmel-ramda]: https://github.com/semmel/ramda
[wikipedia-fcompose]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
[ramda-fantasy]: https://github.com/ramda/ramda-fantasy
[crocks]: https://crocks.dev/docs/crocks/
