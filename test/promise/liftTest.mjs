import { add, equals, identity, o } from 'ramda';
import chai from 'chai';
import hirestime from '../helpers/hirestime.mjs';
import liftA2 from "../../src/point-free/liftA2.js";

const
	assert = chai.assert,
	/** @type {<T>(delay: number, t:T) => Promise<T>} */
	laterSucceed = (dt, value) => new Promise(resolve => setTimeout(resolve, dt, value)),
	/**
	 * @type {<T>(delay: number, t:T) => Promise<T>}
	 */
	laterFail = (dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value)),
	now = hirestime();

describe("promise liftA2", function () {
	it ("succeeds with the result of the function", () => {
		const
			beginTs = now();
		
		return liftA2(add, laterSucceed(50, 27), laterSucceed(50, 42))
		.then(value => {
			assert.strictEqual(value, 69);
			assert.approximately(now() - beginTs, 50, 10);
		});
	});
	
	it ("fails with the first rejection", () => {
		const
			beginTs = now();
		
		return liftA2(add, laterSucceed(50, 27), laterFail(25, 42))
		.then(
			value => { assert.fail(`Unexpected success with ${value}`); },
			error => {
				assert.strictEqual(error, 42);
				assert.approximately(now() - beginTs, 25, 10);
		});
	});
});
