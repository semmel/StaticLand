import chai from 'chai';
import {isNothing, isJust, just, nothing, traverse, getOrElse} from '../../src/maybe.js';
import {of as of_p, map as map_p} from '../../src/promise.js';

const
	assert = chai.assert;

describe("Maybe traverse", function () {
	describe("applies the Into-Promise effect", function() {
		const
			applyToPromiseToMaybe = traverse(of_p, map_p),
			DT = 250,
			delayToSquareEffect = x => new Promise(resolve => setTimeout(resolve, DT, x * x));

		this.slow(2000);
		this.timeout(4000);

		it("applies the effect on the value of a Just and returns a Promise of a Just", () => {
			const
				delayed81 = applyToPromiseToMaybe(delayToSquareEffect, just(9)),
				begin = Date.now();

			assert.instanceOf(delayed81, Promise);

			return delayed81
			.then(x => {
				assert.isTrue(isJust(x));
				assert.strictEqual(getOrElse(-99, x), 81);
				assert.approximately(Date.now() - begin, DT, DT / 4);
			});
		});

		it("does not apply the effect on a Nothing and returns a Promise of Nothing", () => {
			const
				promisedNothing = applyToPromiseToMaybe(delayToSquareEffect, nothing()),
				begin = Date.now();

			assert.instanceOf(promisedNothing, Promise);

			return promisedNothing
			.then(x => {
				assert.isTrue(isNothing(x));
				assert.approximately(Date.now() - begin, 0, 50);
			});
		});
	});

});
