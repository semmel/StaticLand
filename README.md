[![NPM Version](https://img.shields.io/npm/v/@visisoft/staticland.svg?style=flat-square)](https://www.npmjs.com/package/@visisoft/staticland) ![Statements](https://img.shields.io/badge/statements-91.2%25-brightgreen.svg?style=flat-square)

[@visisoft/staticland](https://semmel.github.io/StaticLand/) v{{ config.meta.version }}
====================
Operations (Mapping, Lensing, etc.) on Algebraic Data Types (ADT) (Either, Maybe, Promise, CancelableComputation) realised with *free static functions*. 

The data-holding types are modelled with "simple" *native JavaScript constructs* as `Array`, `Promise` or `Function`. Thus, the algebraic operations do not expect objects from ADT classes but work on those "simple" *JavaScript types*.  

Using simple native types means that 

- Conversion between the types is easy, but
- *@visisoft/staticland* practically gives up on type inspection and leaves that to the calling code. This is in line with the characteristics of JavaScript. 

|           |   `of`        |   `map`       |   `chain`     |   Consumption |
|-----------|---------------|---------------|---------------|---------------|
|CancelableComputation| `cc = (resolve, reject) => () => ()` | | | `new Promise(cc)` |
| Either    | `x => [,x]` |`Array.prototype.map`|`Array.prototype.flatMap`|`xs => xs[1]`|
| Maybe     | `x => [x]`    |`Array.prototype.map`|`Array.prototype.flatMap`|`xs => xs[0]`|
| Promise   | `Promise.resolve`|`Promise.then`|`Promise.then`|`Promise.then`|
| IO        | `x => x`        |`compose`      |`run(compose)` |`call`|

In a way @visisoft/staticland provides functions which operate on and access types you operate with anyway.

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

As FP utility library [Ramda][ramda-homepage] is used.

###### closed over
A [closure] is the combination of a function and the lexical environment within which that function was declared.

[closure]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
[sl-ref]: https://github.com/fantasyland/static-land/
[ramda-homepage]: https://ramdajs.com
[wikipedia-fcompose]: https://en.wikipedia.org/wiki/Function_composition_(computer_science)
[ramda-fantasy]: https://github.com/ramda/ramda-fantasy
[crocks]: https://crocks.dev/docs/crocks/
