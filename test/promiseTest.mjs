import {applyTo, identity, o, pipe} from 'semmel-ramda';
import chai from 'chai';
import hirestime from './helpers/hirestime.mjs';
import {chainRej, map, of, tap, tapRegardless} from '../src/promise.js';

const
	assert = chai.assert,
	laterSucceed = (dt, value) => new Promise(resolve => setTimeout(resolve, dt, value)),
	laterFail = (dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value)),
	now = hirestime(),
	
	mFoo = of('foo'),
	
	assertPromiseEquality = (mAct, mExp, desc) =>
		Promise.all([mAct, mExp])
		.then(([act, exp]) => {
			assert.strictEqual(act, exp, desc);
		}),
	
	// F.map(x => x, mx) ≡ mx
	assertIdentityLaw = (m, desc) => {
		assertPromiseEquality(map(identity, m), m, desc);
	},
	
	// F.map(x => f(g(x)), mx) ≡ F.map(f, F.map(g, mx))
	assertCompositionLaw = (m, f, g, desc) => {
		assertPromiseEquality(map(o(f, g), m), o(map(f), map(g))(m), desc);
	};

describe("Promise", function() {
	describe("map", function () {
		it("should be suitable for composing functions in the success case", () => {
			const
				DURATION = 50,
				DELTA = DURATION / 5,
				beginTs = now();
			
			return applyTo(Promise.resolve(3))(
				pipe(
					map(x => laterSucceed(DURATION, x * 2)),
					map(x => {
						assert.strictEqual(x, 6);
						assert.approximately(now() - beginTs, DURATION, DELTA);
					})
				)
			);
		});
		
		it("obeys the identity law", () =>
			assertIdentityLaw(mFoo)
		);
		
		it("obeys composition law", function () {
			const f = s => `${s}-f`, g = s => `${s}-g`, gz = () => undefined, gn = () => [];
			assertCompositionLaw(mFoo, f, g);
			assertCompositionLaw(mFoo, g, f);
			assertCompositionLaw(mFoo, f, gz);
			assertCompositionLaw(mFoo, f, gn);
		});
		
		it("should fail if the input is a rejected Promise", () => {
			const THAT_ERROR = new Error("that error");
			
			return map(x => laterSucceed(10, x))(Promise.reject(THAT_ERROR))
			.then(
				() => assert.fail("should not succeed"),
				err => assert.strictEqual(err, THAT_ERROR)
			);
		});
		
		it("does not execute the map function on failure", () =>
			map(() => assert.fail("should not execute this line"))(laterFail(20, "test failure"))
			.then(
				() => assert.fail("should not succeed"),
				err => assert.strictEqual(err, "test failure")
			)
		);
	});
	
	describe("tap", function () {
		it("should execute the side effect in the success case", () => {
			var valueToSet;
			const begin = now();
			
			return tap(x => {
				valueToSet = `${x}-bar`;
			})(laterSucceed(20, "foo"))
			.then(result => {
				assert.strictEqual(result, "foo");
				assert.strictEqual(valueToSet, "foo-bar");
				assert.approximately(now() - begin, 20, 8);
			});
		});
		
		it("should not execute the side effect in failure", () => {
			var valueToRemain = "bar";
			const begin = now();
			
			return tap(x => {
				valueToRemain = `unexpected value ${x}`;
			})(laterFail(20, "foo"))
			.then(
				() => assert.fail("should not succeed"),
				error => {
					assert.approximately(now() - begin, 20, 8);
					assert.strictEqual(error, "foo");
					assert.strictEqual(valueToRemain, "bar");
				}
			);
		});
		
		it("propagates exceptions in the side-effect to the returned promise", () => {
			const
				error = new Error("side-effect exception");
			
			return tap(_ => {
				throw error;
			}, Promise.resolve("foo"))
			.then(
				val => assert.fail(`Should not resolve with ${val} after exception in the side-effect function`),
				e => assert.equal(e, error)
			);
		});
	});
	
	describe("tapRegardless", function () {
		it("should ignore exceptions in the side-effect", () =>
			tapRegardless(_ => {
				throw new Error("side-effect exception");
			}, Promise.resolve("foo"))
			.then(
				val => assert.strictEqual(val, "foo"),
				e => assert.fail(`Should not reject with ${e}`)
			)
		);
	});
	
	describe("chainRej", function() {
		it("leaves a resolved promise untouched", () => {
			var isFnCalled = false;
			
			return chainRej(
				x => { isFnCalled = true; return Promise.resolve(`Foo ${x}`); },
				Promise.resolve("bar")
			)
			.then(
				x => {
					assert.strictEqual(x, "bar");
					assert.isFalse(isFnCalled, "fn should've not been called.");
				}
			);
		});
		
		it ("resolves with the resolved return value of fn", () =>
			chainRej(
				e => Promise.resolve(`foo-${e}`),
				Promise.reject("bar")
			)
			.then(x => { assert.strictEqual(x, "foo-bar"); })
		);
		
		it ("rejects with the rejected return value of fn", () =>
			chainRej(
				e => Promise.reject(`FOO-${e}`),
				Promise.reject("BAR")
			)
			.then(
				x => { assert.fail(`should not succeed with ${x}`); },
				e => { assert.strictEqual(e, "FOO-BAR"); }
			)
		);
	});
});