import chai from 'chai';
import chain from '../../src/cancelable/chain.js';
import of from '../../src/cancelable/of.js';
import reject from '../../src/cancelable/reject.js';
import laterSucceed from "../../src/cancelable/internal/laterSucceed.js";
import laterFail from "../../src/cancelable/internal/laterFail.js";

const
	assert = chai.assert;

describe("cancelable map", function () {
	let
		gotCalled = null;
	
	beforeEach(function() {
		gotCalled = false;
	});
	
	this.slow(200);
	
	it("returns the result of f for a resolved computation", () => Promise.all([
		new Promise(chain(x => laterSucceed(10, x * x), of(7)))
		.then(
			x => { assert.strictEqual(x, 49); },
			e => { assert.fail(`Should not fail with ${e}`); }
		),
		
		new Promise(chain(x => laterFail(10, x * x), of(8)))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => { assert.strictEqual(e, 64); }
		)
	]));
	
	it("does not invoke f for a rejected promise", () =>
		new Promise(chain(
			x => { gotCalled = true; return laterFail(10, x * x); },
			reject(6))
		)
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => {
				assert.strictEqual(e, 6);
				assert.isFalse(gotCalled);
			}
		)
	);
	
	it("does not execute neither the chain function nor the continuations when cancelled before", () => {
		const
			T_1 = 30,
			fooBarCC = chain(
				x => { gotCalled = true; return laterSucceed(T_1, `${x}-bar`); },
				laterSucceed(T_1, "foo")
			),
			cancel = fooBarCC(() => {gotCalled = true;}, () => {gotCalled = true;});
		
		return new Promise(resolve => setTimeout(resolve, T_1 / 2))
		.then(() => cancel())
		.then(() => new Promise(resolve => setTimeout(resolve, 2 * T_1)))
		.then(() => { assert.isFalse(gotCalled, "flag gotCalled is raised"); });
	});
	
	it("does execute the the chain function but not the continuations when cancelled in-between", () => {
		let callCount = 0;
		const
			T_1 = 30,
			fooBarCC = chain(
				x => { callCount++; return laterSucceed(T_1, `${x}-bar`); },
				laterSucceed(T_1, "foo")
			),
			cancel = fooBarCC(() => {gotCalled = true;}, () => {gotCalled = true;});
		
		return new Promise(resolve => setTimeout(resolve, 1.5 * T_1))
		.then(() => cancel())
		.then(() => new Promise(resolve => setTimeout(resolve, 2 * T_1)))
		.then(() => {
			assert.isFalse(gotCalled, "flag gotCalled is raised");
			assert.strictEqual(callCount, 1);
		});
	});
});
