import {curry, unary} from 'ramda';

/** @deprecated Use FL compliant utility function e.g. R.map */
// map :: (a -> b) -> Maybe a -> Maybe b
export default curry((f, mx) => mx.map(unary(f)));
