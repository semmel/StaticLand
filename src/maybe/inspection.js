const
	// isJust :: Maybe a -> Boolean
	isJust = mx => Array.isArray(mx) && (mx.length === 1), // alt: mx !== singleNothing
	isNothing = mx => Array.isArray(mx) && (mx.length === 0);

export {
	isJust, isNothing
};
