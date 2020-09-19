Maybe
=====

Optional data, or `if`-`else` blocks


Generation
----------

Consumption
-----------

Transformation
---------------

Caveats
-------
This library does not guard the user from supplying arguments of a wrong type to the provided functions.

Due to using single-element arrays as implementation of the Maybe type, items in these cases cannot be distinguished:
- justs from single element arrays,
- nothing from empty arrays.

This directly affects `isJust`, `isNothing` and `equals`.  E.g. `equals(of(x), [x])` is `true` as well as `equals(nothing(), [])` is also `true`. 

However, given the right inputs this ambiguity has no relevance in practise. 