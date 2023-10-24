Maybe
=====

Working with optional data, commonly done with `if`-`else` blocks.

Native JavaScript arrays which are empty or have a single element are considered a *Maybe* here.


Generators
----------
### fromNilable `:: (a|undefined|null) → Maybe a`
Generates a maybe from a value which can be nullish.

```javascript
fromNilable({}.foo) // Nothing
fromNilable("bar") // Just("bar")
```

### `fromContentHolding(a)`
`:: a → Maybe a`

```javascript
fromContentHolding("a")  // Just("a")
fromContentHolding("")  // Nothing
```

### `fromPredicate(predicate, subject)`
`:: (a → Boolean) → a → Maybe a`

If the predicate test holds it returns the subject as a `Just`, otherwise a `Nothing`.

Consumption
-----------

### `getOrElse(defaultValue, m)`
`:: a -> Maybe a -> a`

Extract the value of a Just or return the provided default.
```javascript
getOrElse("foo", nothing()); // -> "foo"
getOrElse("foo", just("bar")); // -> "bar"
```

### `maybe(onNothing, doWithJust, m)`
`:: (() -> b) -> (a -> b) -> Maybe a -> b`

Composition of `getOrElse` and `map`.
Transforms the value if it exists with the provided function.
Otherwise, returns the default value.

Inspection (Side Effects)
---------------

### `biTap(onNothing, onJust)`
`:: (() → ()) → (a → ()) → Maybe a → Maybe a`

### `tap(onJust)`
`:: (a → ()) → Maybe a → Maybe a`

Transformation
---------------

### ~~`pluck(key)`~~
`:: Maybe m => k -> m {k: v} -> m v`

`:: Maybe m => number -> m [v] -> m v`

*Deprecated* use `pluck` from Ramda or `fantasyland/pluck`.
Simply `k => map(R.prop(k))` for mapping to a key value.

### ~~`sequence(of_f, map_f, MaybeOfF)`~~
`:: Applicative f => ((a → f a), ((a → b) → f a → f b) → Maybe (f a) → f (Maybe a)`

*Deprecated* Use `fantasyland/sequence`.
Swap the sequence of types: **Maybe** of *Functor* of Value to *Functor* of **Maybe** of Value. Maybe takes the role of a "Traversable" `t`.

#### Examples
##### Change a Maybe of a Promise into a Promise of a Maybe
```javascript
const 
   // :: Maybe Promise e a -> Promise e Maybe a
   maybeOfPromiseToPromiseOfMaybe = sequence(of_p, map_p);

maybeOfPromiseToPromiseOfMaybe(just(Promise.resolve("foo"))); // -> Promise Just "foo"
maybeOfPromiseToPromiseOfMaybe(just(Promise.reject("bar"))); // -> Promise.reject("bar")
maybeOfPromiseToPromiseOfMaybe(nothing()); // -> Promise Nothing

// getInputValue :: () -> Maybe string
// fetchServer :: string -> Promise data
// map_mb :: (a -> b) -> Maybe a -> Maybe b
// defaultData :: data
const
   // :: a -> Promise a
   of_p = value => Promise.resolve(value),
   // :: (a -> b) -> Promise a -> Promise b
   map_p = curry((fn, aPromise) => aPromise.then(fn)),
   // :: () -> Promise Data
   getServerData = pipe(
   	  getInputValue,                   // :: Maybe String
      map_mb(fetchServer),             // :: Maybe Promise Data
      maybeOfPromiseToPromiseOfMaybe,  // :: Promise Maybe Data
      map_p(getOrElse(defaultData))    // :: Promise Data
   );
```

##### Change a Maybe of a Key-Value Pair into a Key-Value Pair of a Maybe
`maybeOfFooObjectToObjectFooOfMaybe :: Maybe {foo: a} → {foo: Maybe a}`

```javascript
import {modify, objOf} from 'ramda';
const
   ofFooObj = x => ({foo: x}),            // :: a → {foo: a}
   mapFooObj = modify("foo"),             // :: (a → b) → {foo: a} → {foo: b}
   maybeOfFooObjectToObjectFooOfMaybe =   // :: Maybe {foo: a} → {foo: Maybe a}
      sequence(ofFooObj, mapFooObj),
   justFooBar = just({foo: "bar"});       // :: Just {foo: "bar"}

maybeOfFooObjectToObjectFooOfMaybe(justFooBar); // {foo: Maybe "bar"}
```

### `traverse(of_f, map_f, effect_to_f, maybe)`
`:: (Applicative f, Traversable t) => (c → f c) → ((a → b) → f a → f b) → (a → f b) → Maybe a → f (Maybe b)`

Applies an "effect" `effect_to_f` to the value inside the Maybe. Then combines that "effect" with the Maybe by wrapping the "effect's" result in an Applicative of a Maybe. 

If, for instance the "effect" is an asynchronous computation wrapped in a Promise `a → Promise b`, it might make more sense to work with a Promise of a Maybe than a Maybe of a Promise. 

Using `traverse` essentially combines mapping the `effect_to_f` over the Maybe *and* calling `sequence(of_f, map_f)` in a single step.

```javascript
// see first example for sequence
const 
   // :: (a → Promise b) → Maybe a → Promise Maybe b
   applyToPromiseOfMaybe = traverse(of_p, map_p),
   // :: a → Promise b
   delayEffect = x => new Promise(resolve => setTimeout(resolve, 1000, x));

applyToPromiseOfMaybe(delayEffect, just("foo")); // -> Promise Just "foo"
applyToPromiseOfMaybe(delayEffect, nothing());  // -> Promise Nothing

   // :: () -> Promise Data
   getServerData = pipe(
   	  getInputValue,                      // :: Maybe String
      applyToPromiseOfMaybe(fetchServer), // :: Promise Maybe Data
      map_p(getOrElse(defaultData))       // :: Promise Data
   );
```

#### Relation with `sequence`
`sequence(of_f, map_f, t) ≡ traverse(of, map, identity, t)`, and `traverse(of_f, map_f, effect_to_f, t) ≡ sequence(of_f, map_f, map(effect_to_f, t))`.

The first two parameters of `sequence` and `traverse` are the same and due to the implementation.

Caveats
-------
### Argument type checking
This library functions do not guard the user from supplying arguments of a wrong type. In particular, passing some other type as the maybe subject or passing a function to `chain` which returns a some other type, will cause undefined behaviour later.
