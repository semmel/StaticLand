List 
====
By *List* is a synonym for Array-like collections. Although at this stage, `@visisoft/staticland/list` supports just `Array` as list type.

If combining just data or functions with a "list", these functions (like `map`, `chain`, `of`, etc.) are provided by [Ramda](https://ramdajs.com) and thus will not be implemented here.

However, when combining "list" with *other* algebraic types, unfortunately Ramda expects them to be [Fantasy-Land objects](https://github.com/fantasyland/fantasy-land) with accordingly named methods. So, because Static-Land is all about static functions instead of member functions, `@visisoft/staticland/list` provides the following functions that work with combinations of "list" with the other `@visisoft/staticland` data "types".

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
