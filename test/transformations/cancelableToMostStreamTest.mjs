import {pipe, equals, identity, o} from 'semmel-ramda';
import chai from 'chai';
import {of, reject} from "../../src/cancelable.js";
import schedulersPkg from '@most/scheduler';
import mostCore from '@most/core';
import cancelableToMostStream from "../../src/transformations/cancelableToMostStream.js";

const
	assert = chai.assert,
	{ newDefaultScheduler } = schedulersPkg,
	{ runEffects, tap: tap_s, recoverWith, empty: empty_s, until, at } = mostCore,
	// :: (b -> a -> b) -> Stream a -> Promise Stream b
	reduceStreamToPromiseHelper = (f, initial, stream) => {
		let result = initial;
		const source = tap_s(x => { result = f(result, x); }, stream);
		return runEffects(source, newDefaultScheduler()).then(() => result);
	};

describe("transformation cancelableToMostStream", function () {
	it("handles successful cancelables", () =>
		runEffects(
			pipe(
				() => cancelableToMostStream(of("foo")),
				tap_s(x => { assert.strictEqual(x, "foo"); })
			)(),
			newDefaultScheduler()
		)
	);
	
	it("handles failing cancelables", () =>
		runEffects(
			pipe(
				() => cancelableToMostStream(reject("bar")),
				tap_s(x => { assert.fail(`Must not produce a value ${x}`); }),
				recoverWith(error => {
					assert.strictEqual(error, "bar");
					return empty_s();
				})
			)(),
			newDefaultScheduler()
		)
	);
	
	it("unsubscribing from the stream cancels the Cancelable", () => {
		let gotCancelled = false;
		const foo50 = (res, rej) => {
			const timer = setTimeout(res, 50, "foo");
			return () => {
				clearTimeout(timer);
				gotCancelled = true;
			};
		};
		
		return reduceStreamToPromiseHelper(
			(acc, next) => [...acc, next],
			[],
			until(at(20, undefined), cancelableToMostStream(foo50))
		)
		.then(x => {
			assert.deepStrictEqual(x, []);
			assert.isTrue(gotCancelled);
		});
	});
});
