// :: Promise e a -> Cancelable e a
const promiseToCancelable = promise => (res, rej) => {
	let
		resolveInner = res,
		rejectInner = rej;
	
	promise.then(x => resolveInner(x), e => rejectInner(e));
	
	return () => {
		resolveInner = () => undefined;
		rejectInner = () => undefined;
	};
};

export default promiseToCancelable;
