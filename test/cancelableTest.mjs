import {applyTo, curry, equals, identity, o, pipe} from 'semmel-ramda';
import chai from 'chai';

const
	assert = chai.assert,
	assertCancelableComputationEquality = (mAct, mExp, desc) =>
		Promise.all([new Promise(mAct), new Promise(mExp)])
		.then(([act, exp]) => {
			assert.strictEqual(act, exp, desc);
		}),
	
	laterSucceed = curry((dt, value) => (resolve, unused) => {
		const timer = setTimeout(resolve, dt, value);
		return () => { clearTimeout(timer); };
	}),
	laterFail = curry((dt, value) => (unused, reject) => {
		const timer = setTimeout(reject, dt, value);
		return () => { clearTimeout(timer); };
	}),
	of = laterSucceed(0),
	map = curry((fn, cc) => (resolve, reject) => cc(o(resolve, fn), reject)),
	chain = curry((fn, cc) => (resolve, reject) => {
		let cancel = identity;
		const resolveInner = x => {
			cancel = fn(x)(resolve, reject);
		};
		
		cancel = cc(resolveInner, reject);
		return () => cancel();
	}),
	toPromise = cc => new Promise(cc),
	mFoo = of('foo'),

	// F.map(x => x, mx) ≡ mx
	assertIdentityLaw = (m, desc) =>
		assertCancelableComputationEquality(map(identity, m), m, desc),
	
	// F.map(x => f(g(x)), mx) ≡ F.map(f, F.map(g, mx))
	assertCompositionLaw = (m, f, g, desc) =>
		assertCancelableComputationEquality(map(o(f, g), m), o(map(f), map(g))(m), desc);

describe("map", function () {
	this.slow(200);
	
	it("invokes the fn and forwards the result in the success case", () =>
		toPromise(
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
	
	it.skip("should fail if the computation is a rejected", () => {
		const THAT_ERROR = new Error("that error");
		
		return map(x => laterSucceed(10, x))(Promise.reject(THAT_ERROR))
		.then(
			() => assert.fail("should not succeed"),
			err => assert.strictEqual(err, THAT_ERROR)
		);
	});
	
	it.skip("does not execute the map function on failure", () =>
		map(() => assert.fail("should not execute this line"))(laterFail(20, "test failure"))
		.then(
			() => assert.fail("should not succeed"),
			err => assert.strictEqual(err, "test failure")
		)
	);
});

describe("chain", function() {
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
	
	it.skip("does not invoke f for a rejected promise", () =>
		chain(x => { gotCalled = true; return laterFail(10, x * x); }, Promise.reject(6))
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
