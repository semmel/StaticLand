Maybe
=====

Working with optional data, commonly done with `if`-`else` blocks.

Native JavaScript arrays which are empty or have a single element are considered a *Maybe* here.


Generators
----------
### fromNilable `:: (a|undefined|null) -> Maybe a`
Generates a maybe from a value which can be nullish.

```javascript
fromNilable({}.foo) // Nothing
fromNilable("bar") // Just("bar")
```

Consumption
-----------

Transformation
---------------

Caveats
-------
### Argument type checking
This library functions do not guard the user from supplying arguments of a wrong type. In particular, passing some other type as the maybe subject or passing a function to `chain` which returns a some other type, will cause undefined behaviour later.

### Value limitations
Choosing empty and single-element arrays as implementation of the Maybe type causes these ambiguities:
- A just and any single element array,
- a nothing and any empty array
cannot be distinguished.

This directly affects the inspection functions `isJust`, `isNothing` and `equals`.  E.g. `equals(of(x), [x])` is `true` as well as `equals(nothing(), [])` is also `true`.

Also `join()` will treat a just containing an empty array as a just containing nothing which is collapsed to a nothing.

The library does *not* guard against these cases by inspecting value types at runtime. However, if the source code keeps track of the data type, e.g. `join()` should never been called with data of the wrong type (e.g. with a just of an array). Thus, such silent errors of `join` would never occur in practise.


The other way around, recursively *flattening an Array containing Maybes* will destroy all Maybe elements. This can only be prevented by using Array.flat with the accurate deepness.
