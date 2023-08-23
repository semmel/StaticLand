import * as Bacon from 'baconjs';
import addFantasyLandInterface from "../cancelable/addFantasyLandInterface.js";

const
	baconObservableToCancelable = observable => {
		// Warn of converting of shared Bacon (many-event) observables
		// to lazy (i.e. evaluate when needed) cancelables.
		// Possible (breaking-change) solutions would be
		// 	- subscribing to observable.toProperty(),
		// 	- or/and returning a shared cancelable
		// Use of undocumented property _isProperty!
		//if (!observable._isProperty) {
			console.warn(`Possible bug: Creating a lazy cancelable from a shared once-executed Bacon Observable "${observable.inspect()}"!`);
		//}

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
	};

export default baconObservableToCancelable;

