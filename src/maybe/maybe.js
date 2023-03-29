import {curry} from 'ramda';
import {isJust} from './inspection.js';
import getOrElse from './getOrElse.js';

/**
 * Composition of `getOrElse` and `map`.
 * Transforms the value if it exists with the provided function.
 * Otherwise return the default value.
 * @function
 * @template T, U
 * @param {U} defaultValue
 * @param {function(T): U}
 * @return {function(Maybe<T>): U}
 */
// maybe :: (() -> b) -> (a -> b) -> Maybe a -> b
export default curry((nothingFn, justFn, ma) =>
	isJust(ma)
		? getOrElse("THIS_VALUE_SHOWING_ANYWHERE_IS_AN_ERROR", ma.map(justFn))
		: nothingFn()
);
