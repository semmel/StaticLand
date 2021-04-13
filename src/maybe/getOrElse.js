import {reduce} from "semmel-ramda";

/**
	 * Extract the value of a Just or return the provided default.
	 * @function
	 * @template T
	 * @param {T} defaultValue
	 * @param {Maybe<T>} maybe
	 * @return {T}
	 */
	// getOrElse :: a -> Maybe a -> a
export default reduce((acc, x) => x); // alt: xs => xs[0]
