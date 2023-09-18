import { newDefaultScheduler } from '@most/scheduler';
import { addFantasyLandInterface as fantasyfy } from "../cancelable.js";

const
	mostStreamToCancelable = observable => fantasyfy(
		(res, rej) => {
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
		}
	);

export default mostStreamToCancelable;
