import * as Bacon from 'baconjs';

const
	baconObservableToCancelable = observable => (res, rej) =>
		observable.last().subscribe(evt => {
			if (evt.hasValue) {
				res(evt.value);
			}
			else if (evt.isError) {
				rej(evt.error);
			}
			return Bacon.noMore;
		});

export default baconObservableToCancelable;

