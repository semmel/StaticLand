import {equals, identity, o} from 'semmel-ramda';
import chai from 'chai';
import map from '../../src/cancelable/map.js';
import of from '../../src/cancelable/of.js';
import reject from '../../src/cancelable/reject.js';
import laterSucceed from "../../src/cancelable/internal/laterSucceed.js";

const
	assert = chai.assert,
	
	assertCancelableComputationEquality = (mAct, mExp, desc) =>
		Promise.all([new Promise(mAct), new Promise(mExp)])
		.then(([act, exp]) => {
			assert.strictEqual(act, exp, desc);
		}),
	
	// F.map(x => x, mx) ≡ mx
	assertIdentityLaw = (m, desc) =>
		assertCancelableComputationEquality(map(identity, m), m, desc),
	
	// F.map(x => f(g(x)), mx) ≡ F.map(f, F.map(g, mx))
	assertCompositionLaw = (m, f, g, desc) =>
		assertCancelableComputationEquality(map(o(f, g), m), o(map(f), map(g))(m), desc),

	mFoo = of('foo');

describe("cancelable map", function () {
	this.slow(200);
	
	it("invokes the fn and forwards the result in the success case", () =>
		new Promise(
			map(x => `${x}-bar`, mFoo)
		)
		.then(
			x => { assert.strictEqual(x, "foo-bar"); },
			e => { assert.fail(`Unexpected failure with ${e}`); }
		)
	);
	
	it("obeys the identity law", () =>
		assertIdentityLaw(mFoo)
	);
	
	it("obeys composition law", function () {
		const f = s => `${s}-f`, g = s => `${s}-g`, gz = () => undefined, gn = () => [];
		return Promise.all([
			assertCompositionLaw(mFoo, f, g),
			assertCompositionLaw(mFoo, g, f),
			assertCompositionLaw(mFoo, f, gz),
			assertCompositionLaw(mFoo, f, gn)
		]);
	});
	
	it("does not execute neither the map function nor the continuations when cancelled before", () => {
		let gotCalled = false;
		const
			T_SUCCESS = 40,
			fooBarCC = map(
				x => { gotCalled = true; return `${x}-bar`; },
				laterSucceed(T_SUCCESS, "foo")
			),
			cancel = fooBarCC(() => {gotCalled = true;}, () => {gotCalled = true;});
		
		return new Promise(resolve => setTimeout(resolve, T_SUCCESS / 2))
		.then(() => cancel())
		.then(() => new Promise(resolve => setTimeout(resolve, 2 * T_SUCCESS)))
		.then(() => { assert.isFalse(gotCalled, "flag gotCalled is raised"); });
	});
	
	it("should fail if the computation is failing", () => {
		const THAT_ERROR = new Error("that error");
		
		return new Promise(map(x => x, reject(THAT_ERROR)))
		.then(
			() => assert.fail("should not succeed"),
			err => assert.strictEqual(err, THAT_ERROR)
		);
	});
	
	it("does not execute the map function on failure", () =>
		new Promise(
			map(() => assert.fail("should not execute this line"), reject("test failure"))
		)
		.then(
			() => assert.fail("should not succeed"),
			err => assert.strictEqual(err, "test failure")
		)
	);
});
