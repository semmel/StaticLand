Lens
====
A Lens is a function which focuses on a particular aspect, property, index, ... of a data structure. Their purpose is to make changes in a data structure in a non-mutating functional way. 

Lenses compose with themselves, traversal functions (`Type.traverse(of_f, liftA2_f)`), mapping functions (`Type.map`) and isomorphism functions. All these items piped together drill deep down into a data structure. Thereby a particular aspect deep in this complex data structure can be modeled by such a composed lens function. 

Lenses are put into action by a set of helper functions (`view`, `over`, `set`) which take the lens and source data as arguments and return the result data.

For a thorough introduction read ["Lenses with Immutable.js" by Brian Lonsdorf][1], for the details of the implementation for StaticLand data structures read ["Partial Lenses Implementation" by Vesa Karvonen][2]

Types
-----
```
MapF = Functor F => (a -> b) -> Fa -> Fb
Lens sa = MapF => MapF -> (a -> Fa) -> sa -> Fsa
ComposableLens sa = (a -> Fa) -> sa -> Fsa
```
Note that `ComposableLens` bears the same signature as `traverse(of_f, map_f)` and `map`.


Static-Land vs. Fantasy-Land (Ramda) Lenses
----------------------------------------
A lens is primary implemented as
```js
lens = getter, setter => Fmap => x2Fy => xs => 
    Fmap(y => setter(y, xs), x2Fy(getter(xs)));
```
While in Fantasy-Land the `Fmap` argument is not needed, since the functor's map function is referenced by the `[fantasy-land/map]` property.
```js
lens = getter, setter => x2Fy => xs => 
    x2Fy(getter(xs))[fantasy-land/map](y => setter(y, xs));
```

Thus, in StaticLand composability requires specifying a particular functor's map and therefore is much more laborious or requires a layer of helper functions.

Creation
-------
In general two procedures are required, one for extracting the item of interest, the other for re-assembling the data structure. The returned functions (i.e. lenses) themselves *cannot be composed* together. Instead, they serve as initial building blocks for the entire composition of the data aspect. 

### `lens(getter, setter)`
`:: (sa -> a) -> ((a, sa) -> sa) -> Lens sa`

Compare `lens` to `promap`:
```javascript
const charLens = lens(s => s.charCodeAt(0), n => String.fromCharCode(n)), 
   stringLens = lens(R.split(''), R.join('')),
   charLensC = makeComposableOverLens(charLens),
   stringLensC = makeComposableOverLens(stringLens),
   singleLens = R.compose(stringLensC, R.unary(R.map), charLensC);

over(singleLens, R.add(-8), "ziuli"); // -> 'ramda'

// promap example from the Ramda documentation:
const decodeChar = R.promap(s => s.charCodeAt(), n => String.fromCharCode(n), R.add(-8)),
   decodeString = R.promap(R.split(''), R.join(''), R.map(decodeChar));

decodeString("ziuli") //=> "ramda"
```

### `indexLens(n)`
`:: Number -> Lens sa`

### `propertyLens(key)`

Create Composable Lenses
------------------
These can be composed with `map`, `traverse` and themselves to define the focus on the data aspect.

### `makeComposableViewLens(lens)`
`F ≡ Constant`

Creates one `map`-like function for *viewing* / *extracting* a data aspect.

### `makeComposableOverLens(lens)`
`F ≡ Identity`

Example, the data is 
1. inside a `bar` property
2. inside a `Promise`
```javascript
//                             data aspect
//                                    ↓
const data = { bar: Promise.resolve("BAR") }, 
   barLens = propertyLens("bar"), 
// decide to "mutate the data structure, so make an OverLens:
   composableBarLens = makeComposableOverLens(barLens),
// define the whole path to the data
   aspect = compose(composableBarLens, mapPromise);
// employ in a functional pipeline
   changeAspect = over(aspect);

changeAspect(reverse)(data); // { bar: Promise.resolve("RAB") }
```


### `makeComposableSequenceLens(map_f, lens)`
`F ≡ f`

Employ Lenses
---------

### `view(viewLens)`
`:: Lens sa -> a`

### `over(overLens)`
`:: Lens sa -> (a -> a) -> sa -> sa`

### `set(overLens)`
`:: Lens sa -> a -> sa -> sa`

### `sequence(lens, subject)`
`:: ComposableLens sa -> saf -> fsa`


[1]:https://medium.com/@drboolean/lenses-with-immutable-js-9bda85674780
[2]:https://calmm-js.github.io/partial.lenses/implementation.html 