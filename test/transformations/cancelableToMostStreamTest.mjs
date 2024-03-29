import {pipe, equals, identity, o} from 'ramda';
import chai from 'chai';
import {of, reject} from "../../src/cancelable.js";
import schedulersPkg from '@most/scheduler';
import mostCore from '@most/core';
import cancelableToMostStream from "../../src/transformations/cancelableToMostStream.js";
import {reduceStreamToPromiseHelper} from '../helpers/most.mjs';

const
	assert = chai.assert,
	{ newDefaultScheduler } = schedulersPkg,
	{ runEffects, tap: tap_s, recoverWith, empty: empty_s, until, at } = mostCore;

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
