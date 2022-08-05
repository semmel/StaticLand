import * as Bacon from 'baconjs';
import addFantasyLandInterface from "../cancelable/addFantasyLandInterface.js";

const
	baconObservableToCancelable = observable => {
		const cancelable = (res, rej) =>
			observable.last().subscribe(evt => {
				if (evt.hasValue) {
					res(evt.value);
				}
				else if (evt.isError) {
					rej(evt.error);
				}
				return Bacon.noMore;
			});
		
		addFantasyLandInterface(cancelable);
		
		return cancelable;
	}

export default baconObservableToCancelable;

