List 
====
By *List* is a synonym for Array-like collections. Although today the functions are expected to work just with `Array`.

Most List functions like `map`, `chain`, `of`, etc., can be taken from [Ramda](https://ramdajs.com).

Transformation
-------------
### `sequence(of_f, liftA2_f, arrayOfF)`
`:: Applicative f => ((a → f a), ((a → b → c) → f a → f b → f c) → [f a] → f [a]`

Swap the sequence of both the types List and a Functor: Turns a **List** of *Functors* of Values into a *Functor* of a **List** of Values.
#### Example
```javascript
import {liftA2 as liftA2_mb, of as of_mb, nothing, just} 
   from '@visisoft/staticland/maybe';
const 
   listOfMaybesToMaybeOfList = sequence(of_mb, liftA2_mb);

listOfMaybesToMaybeOfList([just("me"), just("you")]); // -> Just(["me", "you"])
listOfMaybesToMaybeOfList([just("me"), nothing()]); // -> Nothing
```

Note that the first two parameters `of_f` and `liftA2_f` are just needed to support the implementation. Both should be taken from the Applicative `f`'s static functions.

### `traverse(of_f, liftA2_f, effect_to_f, array)`
`:: Applicative f => ((a → f a), ((a → b → c) → f a → f b → f c) → (a → f b) → [a] → f [b]`

Note that the first two parameters `of_f` and `liftA2_f` are just needed to support the implementation. Both should be taken from the Applicative `f`'s static functions.
