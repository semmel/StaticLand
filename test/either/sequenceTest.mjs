import { always, equals, identity, o } from 'ramda';
import chai from 'chai';
import { either, isLeft, isRight, left, right, sequence } from "../../src/either.js";
import { map as map_p, of as of_p } from "../../src/promise.js";

const
	assert = chai.assert;

describe("Either sequence", function () {
	describe("swaps an Either of a Promise into a Promise of an Either", function() {
		const
			eitherOfPromiseToPromiseOfEither = sequence(of_p, map_p);
		
		it ("swaps a Right of a resolved Promise", () => {
			const
				rja = eitherOfPromiseToPromiseOfEither(right(Promise.resolve("foo")));
			
			assert.instanceOf(rja, Promise);
			
			return rja
			.then(ja => {
				assert.isTrue(isRight(ja));
				assert.strictEqual(either(always("UNEXPECTED_FILL_IN"), identity, ja), "foo");
			});
		});
		
		it ("swaps into a Right of a failing Promise into a failing Promise", () => {
			const
				fja = eitherOfPromiseToPromiseOfEither(right(Promise.reject("bar")));
			
			assert.instanceOf(fja, Promise);
			
			return fja
			.then(
				val => {
					assert.fail(`Unexpected success (${val})`);
				},
				e => {
					//assert.isTrue(isJust(e));
					assert.strictEqual(e, "bar");
				}
			);
		});
		
		it ("turns a Left into a Promise of a Left", () => {
			const
				theError = new Error("THE_TEST_ERROR_MESSAGE"),
				fn = eitherOfPromiseToPromiseOfEither(left(theError));
			
			assert.instanceOf(fn, Promise);
			
			return fn
			.then(x => {
				assert.isTrue(isLeft(x));
				assert.strictEqual(either(identity, always(new Error("UNEXPECTED_FILL_IN")), x), theError);
			});
		});
	});
});
