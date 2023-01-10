import { createDeferred } from '../../src/cancelable.js';
import chai from 'chai';
import hirestime from "../helpers/hirestime.mjs";
import { assertCorrectInterface } from "../helpers/types.mjs";
import { map, reverse } from "ramda";

const
	assert = chai.assert,
	now = hirestime();

describe("cancelable/createDeferred", function () {
	/** @type {import('../../src/cancelable').DeferredCancelable<string>} */
	let dfd;
	/** @type {number} */
	let begin;
	
	const dT = 50;
	
	this.slow(500);
	
	beforeEach(function(){
		dfd = createDeferred();
		begin = now();
	});
	
	it("creates a FL monad", () => {
		assertCorrectInterface("monad")(dfd.cancelable);
	});
	
	it("delivers the success to all early subscribers when settled via resolve hook", () => {
		
		setTimeout(dfd.resolve, dT, "foo");
		
		return Promise.all([
			Promise.all([
				new Promise(dfd.cancelable),
				new Promise(map(reverse)(dfd.cancelable))
			])
			.then(([x, xr]) => {
				assert.strictEqual(x, "foo");
				assert.strictEqual(xr, "oof");
				assert.approximately(now() - begin, dT, 10, "resolve in time");
			}),
			
			new Promise(resolve => setTimeout(resolve, 1.5 * dT))
			.then(() => new Promise(dfd.cancelable))
			.then(x => {
				assert.strictEqual(x, "foo");
				assert.approximately(now() - begin, 1.5 * dT, 10, "resolves late subscribers ASAP");
			})
		]);
	});
	
	it("fails via reject hook", () => {
		const
			failure = new Error("oops!");
		
		setTimeout(dfd.reject, 50, failure);
		
		return Promise.any([
			new Promise(dfd.cancelable),
			new Promise(resolve => setTimeout(resolve, 1.5 * dT))
			.then(() => new Promise(dfd.cancelable))
		])
		.then(
			x => { assert.fail(`Unexpected success with ${x}`); },
			ae => {
				assert.instanceOf(ae, AggregateError);
				assert.lengthOf(ae.errors, 2);
				assert.deepStrictEqual(ae.errors, [failure, failure]);
				assert.approximately(now() - begin, 1.5 * dT, 10, "reject in time");
			}
		);
	});
	
	it("never settles when cancelled", () => {
		
		setTimeout(dfd.cancel, 50);
		
		return Promise.race([
			new Promise(dfd.cancelable),
			new Promise(resolve => setTimeout(resolve, 1.5 * dT)).then(() => new Promise(dfd.cancelable)),
			new Promise(resolve => setTimeout(resolve, 2 * dT, "end-of-wait"))
		])
		.then(x => {
			assert.strictEqual(x, "end-of-wait");
			assert.approximately(now() - begin, 2 * dT, 10, "cancelables did loose the race");
		});
	});
});
