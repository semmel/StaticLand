import {compose, curry, equals, identity, o} from 'ramda';
import {traverse as traverse_l} from '../../src/list.js';
import {of as of_p, later as later_p, map as map_p, liftA2 as liftA2_p} from '../../src/promise.js';
import hirestime from "../helpers/hirestime.mjs";
import chai from 'chai';

const
	assert = chai.assert,
	now = hirestime();

describe("List: traverse creating Promises", function () {
	this.slow(200);
	
	const
		// :: (a -> Promise b) -> List a -> Promise List b
		traversePromiseFactoryInList = traverse_l(of_p, liftA2_p),
		laterFail = curry((dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value))),
		asyncSquareRoot = x => (x >= 0) ? later_p(100, Math.sqrt(x)) : laterFail(25, "complex result");
	
	it("resolves with an array of successes", () => {
		const
			allPromises = traversePromiseFactoryInList(
				asyncSquareRoot,
				[4, 25, 81]
			),
			beginTS = now();
		
		assert.instanceOf(allPromises, Promise);
		return allPromises
		.then(xs => {
			assert.instanceOf(xs, Array);
			assert.deepStrictEqual(xs, [2, 5, 9]);
			assert.approximately(now() - beginTS, 100, 20);
		});
	});
	
	it ("fails with the first rejection", () => {
		const
			allPromises = traversePromiseFactoryInList(
				asyncSquareRoot,
				[4, -25, 81]
			),
			beginTS = now();
		
		assert.instanceOf(allPromises, Promise);
		return allPromises
		.then(
			val => { assert.fail(`Unexpected success with ${val}`); },
			error => {
				assert.approximately(now() - beginTS, 25, 10);
				assert.strictEqual(error, "complex result");
			}
		);
	});
});
