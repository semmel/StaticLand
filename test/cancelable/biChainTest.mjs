import { chain as chain_fl, equals, identity, o } from 'ramda';
import chai from 'chai';
import laterSucceed from "../../src/cancelable/internal/laterSucceed.js";
import laterFail from "../../src/cancelable/internal/laterFail.js";
import { biChain, of, reject } from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("Cancelable biChain", function () {
	let
		leftFnGotCalled = null, rightFnGotCalled = null, aContinuationFnGotCalled = null;
	
	const
		eitherHalfOrSquareLater = biChain(
			e => { leftFnGotCalled = true;  return laterSucceed(10, e / 2); },
			x => { rightFnGotCalled = true; return laterSucceed(10, x * x); }
		),
	
		eitherNegateOrDoubleLaterFailing = biChain(
			e => { leftFnGotCalled = true;  return laterFail(10, -e); },
			x => { rightFnGotCalled = true; return laterFail(10, 2 * x); }
		);
	
	beforeEach(function() {
		rightFnGotCalled = leftFnGotCalled = aContinuationFnGotCalled = false;
	});
	
	this.slow(400);
	
	it("returns the result of fnRight for a succeeding computation", () => Promise.all([
		new Promise(eitherHalfOrSquareLater(of(7)))
		.then(
			x => { assert.strictEqual(x, 49); },
			e => { assert.fail(`Should not fail with ${e}`); }
		),
		
		new Promise(eitherNegateOrDoubleLaterFailing(of(8)))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => { assert.strictEqual(e, 16); }
		)
	]));
	
	it("returns the result of fnLeft for a failing computation", () => Promise.all([
		new Promise(eitherHalfOrSquareLater(reject(14)))
		.then(
			x => { assert.strictEqual(x, 7); },
			e => { assert.fail(`Should not fail with ${e}`); }
		),
		
		new Promise(eitherNegateOrDoubleLaterFailing(reject(8)))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => { assert.strictEqual(e, -8); }
		)
	]));
	
	it("does not invoke fnRight for a failing computation", () =>
		new Promise(eitherNegateOrDoubleLaterFailing(reject(6)))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => {
				assert.strictEqual(e, -6);
				assert.isFalse(rightFnGotCalled);
			}
		)
	);
	
	it("does not invoke fnLeft for a successful computation", () =>
		new Promise(eitherNegateOrDoubleLaterFailing(of(6)))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => {
				assert.strictEqual(e, 12);
				assert.isFalse(leftFnGotCalled);
			}
		)
	);
	
	it("does not execute neither one of the chain functions nor the continuations when cancelled before", () => {
		const
			T_1 = 30,
			fooBarCC = biChain(
				e => { leftFnGotCalled = true; return laterSucceed(T_1, `${e}-baz`); },
				x => { rightFnGotCalled = true; return laterSucceed(T_1, `${x}-bar`); },
				laterSucceed(T_1, "foo")
			),
			cancel = fooBarCC(() => {aContinuationFnGotCalled = true;}, () => {aContinuationFnGotCalled = true;});
		
		return new Promise(resolve => setTimeout(resolve, T_1 / 2))
		.then(() => cancel())
		.then(() => new Promise(resolve => setTimeout(resolve, 2 * T_1)))
		.then(() => {
			assert.isFalse(aContinuationFnGotCalled, "flag aContinuationFnGotCalled is raised");
			assert.isFalse(leftFnGotCalled, "flag leftFnGotCalled is raised");
			assert.isFalse(rightFnGotCalled, "flag rightFnGotCalled is raised");
		});
	});
	
	it("does execute one of the chain functions but not the continuations when cancelled in-between", () => {
		let leftCallCount = 0, rightCallCount = 0;
		const
			T_1 = 30,
			fooBarCC = biChain(
				e => { leftCallCount++; return laterSucceed(T_1, `${e}-baz`); },
				x => { rightCallCount++; return laterSucceed(T_1, `${x}-bar`); },
				laterFail(T_1, "foo")
			),
			cancel = fooBarCC(() => {aContinuationFnGotCalled = true;}, () => {aContinuationFnGotCalled = true;});
		
		return new Promise(resolve => setTimeout(resolve, 1.5 * T_1))
		.then(() => cancel())
		.then(() => new Promise(resolve => setTimeout(resolve, 2 * T_1)))
		.then(() => {
			assert.isFalse(aContinuationFnGotCalled, "flag aContinuationFnGotCalled is raised");
			assert.strictEqual(leftCallCount, 1);
			assert.strictEqual(rightCallCount, 0);
		});
	});
});
