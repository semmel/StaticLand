import chai from 'chai';
import {of as of_mb, liftA2 as liftA2_mb, isNothing, isJust, just, getOrElse, nothing} from '../../src/maybe.js';
import {of as of_p, later as later_p, liftA2 as liftA2_p} from '../../src/promise.js';
import {sequence} from '../../src/list.js';
import {map, range} from 'ramda';
import { createRequire } from 'node:module';
const
	require = createRequire(import.meta.url),
	hirestime = require('hirestime').default,

	assert = chai.assert,
	now = hirestime();

describe("List sequence", function () {
	describe("swaps List of Maybes into Maybe of List", function() {
		const
			listOfMaybesToMaybeOfList = sequence(of_mb, liftA2_mb);
		
		it("swaps a List of Justs", () => {
			const
				items = range(0, 10),
				listOfJusts = map(just, items),
				justOfList = listOfMaybesToMaybeOfList(listOfJusts);
			
			assert.isTrue(isJust(justOfList));
			assert.deepStrictEqual(getOrElse(["stupid"], justOfList), items);
		});
		
		it("transforms a List with a Nothing into a Nothing", () => {
			const
				maybeOfList = listOfMaybesToMaybeOfList([just("foo"), nothing(), just("bar")]);
			
			assert.isTrue(isNothing(maybeOfList));
		});
	});
	
	describe("swaps a List of Promises into a Promise of a List", function() {
		this.slow(200);
		
		const
			listOfPromisesToPromiseOfList = sequence(of_p, liftA2_p),
			/** @type {<T>(delay: number, t:T) => Promise<T>} */
			laterFail = (dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value));
		
		it ("resolves with an array of successes", () => {
			const
				allPromises = listOfPromisesToPromiseOfList([
					later_p(50, "foo"),
					Promise.resolve("bar"),
					later_p(75, "baz")
				]),
				beginTS = now();
			
			assert.instanceOf(allPromises, Promise);
			return allPromises
			.then(xs => {
				assert.approximately(now() - beginTS, 75, 20);
				assert.instanceOf(xs, Array);
				assert.deepStrictEqual(xs, ["foo", "bar", "baz"]);
			});
		});
		
		it ("fails with the first failure", () => {
			const
				allPromises = listOfPromisesToPromiseOfList([
					later_p(100, "foo"),
					laterFail(25, "qux"),
					laterFail(75, "faz")
				]),
				beginTS = now();
			
			assert.instanceOf(allPromises, Promise);
			return allPromises
			.then(
				val => { assert.fail(`Unexpected success with ${val}`); },
				error => {
					assert.approximately(now() - beginTS, 25, 10);
					assert.strictEqual(error, "qux");
				}
			);
		});
	});
	
	// TODO:
	describe.skip("swaps a List of Cancelables into a Cancelable of a List", function() {
		this.slow(200);
		
	});
});
