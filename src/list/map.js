import {curry, unary} from "semmel-ramda";
// map :: (a -> b) -> [a] -> [b]
export default curry((f, mx) => mx.map(unary(f)));
