import chai from 'chai';
import {isRight, isLeft, right, left, traverse, either} from '../../src/either.js';
import {of as of_p, map as map_p} from '../../src/promise.js';
import { identity, always } from "ramda";

const
	assert = chai.assert;

describe("Either traverse", function () {
	describe("applies the Into-Promise effect", function() {
		const
			applyToPromiseToEither = traverse(of_p, map_p),
			DT = 250,
			delayToSquareEffect = x => new Promise(resolve => setTimeout(resolve, DT, x * x));

		this.slow(2000);
		this.timeout(4000);

		it("applies the effect on the value of a Right and returns a Promise of a Right", () => {
			const
				delayed81 = applyToPromiseToEither(delayToSquareEffect, right(9)),
				begin = Date.now();

			assert.instanceOf(delayed81, Promise);

			return delayed81
			.then(x => {
				assert.isTrue(isRight(x));
				assert.strictEqual(either(always(-99), identity, x), 81);
				assert.approximately(Date.now() - begin, DT, DT / 4);
			});
		});

		it("does not apply the effect on a Left and returns a Promise of the Left", () => {
			const
				theLeftError = new Error("THE_TEST_ERROR_MESSAGE"),
				promisedLeft = applyToPromiseToEither(delayToSquareEffect, left(theLeftError)),
				begin = Date.now();

			assert.instanceOf(promisedLeft, Promise);

			return promisedLeft
			.then(x => {
				assert.isTrue(isLeft(x));
				assert.strictEqual(either(identity, always(new Error("UNEXPECTED_FILL_IN")), x), theLeftError);
				assert.approximately(Date.now() - begin, 0, 50);
			});
		});
	});

});
