import {curry} from "semmel-ramda";

// map :: (a -> b) -> Promise e a -> Promise e b
export default curry((fn, aPromise) => aPromise.then(fn));
