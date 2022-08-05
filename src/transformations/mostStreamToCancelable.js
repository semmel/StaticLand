import pkg from '@most/scheduler'; // tree-shaking goes takes a dump
import addFantasyLandInterface from "../cancelable/addFantasyLandInterface.js";

const
	{ newDefaultScheduler } = pkg,
	mostStreamToCancelable = observable => {
		const cancelable = (res, rej) => {
			let last;
			const disposer = observable.run(
				{
					event: (unused, x) => {
						last = x;
					},
					error: (unused, e) => {
						rej(e);
					},
					end: () => {
						res(last);
					}
				},
				newDefaultScheduler()
			);
			
			return () => {
				disposer.dispose();
			};
		};
		
		addFantasyLandInterface(cancelable);
	
		return cancelable;
	};

export default mostStreamToCancelable;
