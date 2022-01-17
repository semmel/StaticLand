import {curry, unary} from 'ramda';
//map = curry((f, mx) => isJust(mx) ? mx.map(unary(f)) : singleNothing), // alt mx.map(unary(f))
// map :: (a -> b) -> Maybe a -> Maybe b
export default curry((f, mx) => mx.map(unary(f)));
