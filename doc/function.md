Function 
========
Functions `x → b` can be treated as functors `(→ x) b` (or `Functor f ⇒ f b`). The functor `f` or `(→ x)` represents all functions accepting `x` as argument. 

Reader
------
Treating functions as functors for instance makes it possible to compose pipelines of functions which are applied sequentially to their respective return values – as usual – but which are only executed when called with an additional, possibly mutable, argument – usually called "environment". Invoked with just their "primary" pipeline-entry argument, the pipeline is not executed and is thus referentially transparent. The responsibility to permit *reading* from the *environment* is left for the final caller of this so-called *Reader*. This is much like a binary curried function `a => b => someOperation(a, b)` which happens to be the `of` factory for *Reader* `of = x => env => x`.

Using [Ramda]
----
The Ramda version of the ADT functions `ap`, `map` and `chain` support not only StaticLand (i.e. native JavaScript) List functors (that is: `Array`) but also function functors.

From the understanding of functions as functors, some useful function combinators can be implemented with help of the ADT functions:

[![Function Combinators with Ramda](img/Useful Combinators in Ramda.png)](img/Useful Combinators in Ramda.pdf)

[Ramda]: http://ramdajs.com/
