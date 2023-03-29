import {curry} from 'ramda';
import {isJust} from "./inspection.js";

/**
 * Extract the value of a Just or return the provided default.
 * @function
 * @template T
 * @param {T} defaultValue
 * @param {Maybe<T>} maybe
 * @return {T}
 */
// getOrElse :: a -> Maybe a -> a
export default curry((a, ma) => isJust(ma) ? ma.$value : a);
