import {curry} from 'ramda';
import {isJust} from "./inspection.js";
import {nothing} from "./creation.js";

/** @deprecated Use FL compliant utility function e.g. R.chain */
// chain :: (a -> Maybe b) -> Maybe a -> Maybe b
//chain = curry((f, mx) => isJust(mx) ? mx.flatMap(f) : singleNothing),
//chain = curry((f, mx) => mx.flatMap(unary(f))),
export default curry((f, mx) => isJust(mx) ? f(mx.$value) : nothing());
