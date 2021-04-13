const
	// :: a -> Maybe a
	of = x => [x],
	//nothing = () => singleNothing, // TODO: alt: []
	nothing = () => [];

export {
	of, nothing
};

export let just = of;
