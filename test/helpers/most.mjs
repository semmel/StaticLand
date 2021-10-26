import {newDefaultScheduler} from '@most/scheduler';
import {runEffects, tap as tap_s} from "@most/core";

const
	// :: (b -> a -> b) -> Stream a -> Promise Stream b
	reduceStreamToPromiseHelper = (f, initial, stream) => {
		let result = initial;
		const source = tap_s(x => { result = f(result, x); }, stream);
		return runEffects(source, newDefaultScheduler()).then(() => result);
	};

export {
	reduceStreamToPromiseHelper
};
