// :: Promise e a -> Cancelable e a
import addFantasyLandInterface from "../cancelable/addFantasyLandInterface.js";
import _promiseToCancelable from "../cancelable/internal/_promiseToCancelable.js";

const promiseToCancelable = promise => {
	const cancelable = _promiseToCancelable(promise);
	
	addFantasyLandInterface(cancelable);
	
	return cancelable;
};

export default promiseToCancelable;
