// :: Promise e a -> Cancelable e a
import addFantasyLandInterface from "../cancelable/addFantasyLandInterface.js";

const promiseToCancelable = promise => {
	const cancelable = (res, rej) => {
		let
			resolveInner = res,
			rejectInner = rej;
		
		promise.then(x => resolveInner(x), e => rejectInner(e));
		
		return () => {
			resolveInner = () => undefined;
			rejectInner = () => undefined;
		};
	};
	
	addFantasyLandInterface(cancelable);
	
	return cancelable;
};

export default promiseToCancelable;
