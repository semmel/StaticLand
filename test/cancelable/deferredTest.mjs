import createDeferred from '../../src/cancelable/deferred.js';
import chai from 'chai';
import { assertCorrectInterface } from "../helpers/types.mjs";

const
	assert = chai.assert;

describe("createDeferred cancelable", function () {
	it("creates a FL monad", () => {
		assertCorrectInterface("monad")(createDeferred().cancelable);
	});
	
	it("settles via resolve hook", () => {
		const
			dfd = createDeferred(),
			begin = Date.now();
		
		setTimeout(dfd.resolve, 50, "foo");
		
		return new Promise(dfd.cancelable)
		.then(x => {
			assert.strictEqual(x, "foo");
			assert.approximately(Date.now() - begin, 50, 10, "resolve in time");
		});
	});
	
	it("fails via reject hook", () => {
		const
			dfd = createDeferred(),
			begin = Date.now(),
			failure = new Error("oops!");
		
		setTimeout(dfd.reject, 50, failure);
		
		return new Promise(dfd.cancelable)
		.then(
			x => { assert.fail(`Unexpected success with ${x}`); },
			e => {
				assert.strictEqual(e, failure);
				assert.approximately(Date.now() - begin, 50, 10, "reject in time");
			});
	});
});
