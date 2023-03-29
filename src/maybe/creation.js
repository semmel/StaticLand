import {Maybe, Nothing} from "./mostly-adequate.js";

const
	// :: a -> Maybe a
	of = Maybe.of,

	nothing = () => new Nothing();

export {
	of, nothing
};

export let just = of;
