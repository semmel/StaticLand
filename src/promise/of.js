
const
	// of :: a -> Promise e a
	of = value => Promise.resolve(value);

export default of;
