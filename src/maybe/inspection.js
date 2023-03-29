import {Maybe} from "./mostly-adequate.js";

const
	// isJust :: Maybe a -> Boolean
	isJust = mx => mx instanceof Maybe && mx.isJust,
	isNothing = mx => mx instanceof Maybe && mx.isNothing;

export {
	isJust, isNothing
};
