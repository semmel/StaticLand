import {add, identity, o, pipe, pluck} from 'ramda';
import chai from 'chai';
import {alt, bi_tap, chain, chainRej, chainTap, chainIf, liftA2, map, of, tap, tapRegardless} from '../src/promise.js';
import { createRequire } from 'node:module';
const
	require = createRequire(import.meta.url),
	hirestime = require('hirestime').default,

	assert = chai.assert,
	/** @type {<T>(delay: number, t:T) => Promise<T>} */
	laterSucceed = (dt, value) => new Promise(resolve => setTimeout(resolve, dt, value)),
	/**
	 * @type {<T>(delay: number, t:T) => Promise<T>}
	 */
	laterFail = (dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value)),
	now = hirestime(),
	
	mFoo = of('foo'),
	
	assertPromiseEquality = (mAct, mExp, desc) =>
		Promise.all([mAct, mExp])
		.then(([act, exp]) => {
			assert.strictEqual(act, exp, desc);
		}),
	
	// F.map(x => x, mx) ≡ mx
	assertIdentityLaw = (m, desc) =>
		assertPromiseEquality(map(identity, m), m, desc),
	
	// F.map(x => f(g(x)), mx) ≡ F.map(f, F.map(g, mx))
	assertCompositionLaw = (m, f, g, desc) =>
		assertPromiseEquality(map(o(f, g), m), o(map(f), map(g))(m), desc);

describe("Promise", function() {
	describe("map", function () {
		it("should be suitable for composing functions in the success case", () => {
			const
				DURATION = 50,
				DELTA = DURATION / 5,
				beginTs = now();
			
			return pipe(
				() => Promise.resolve(3),
				map(x => laterSucceed(DURATION, x * 2)),
				map(x => {
					assert.strictEqual(x, 6);
					assert.approximately(now() - beginTs, DURATION, DELTA);
				})
			)();
		});
		
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
	
	describe("bi_tap", function () {
		let begin, successValue, failureValue;
		
		beforeEach(function() {
			begin = now();
			successValue = "initial success";
			failureValue = "initial failure";
		});
		
		const
			successSideEffect = x => {
				successValue = `${x}-bar`;
			},
			failureSideEffect = e => {
				failureValue = `${e}-foo`;
			};
		
		it("should execute the side effect in the success case", () =>
			bi_tap(failureSideEffect, successSideEffect)(laterSucceed(20, "foo"))
			.then(result => {
				assert.strictEqual(result, "foo");
				assert.strictEqual(successValue, "foo-bar");
				assert.strictEqual(failureValue, "initial failure");
				assert.approximately(now() - begin, 20, 8);
			})
		);
		
		it("should execute the side effect in failure", () =>
			bi_tap(failureSideEffect, successSideEffect, laterFail(20, "bar"))
			.then(
				() => assert.fail("should not succeed"),
				error => {
					assert.approximately(now() - begin, 20, 8);
					assert.strictEqual(error, "bar");
					assert.strictEqual(failureValue, "bar-foo");
					assert.strictEqual(successValue, "initial success");
				}
			)
		);
		
		it("propagates exceptions in the side-effect to the returned promise", () => {
			const
				error = new Error("side-effect exception");
			
			return bi_tap(
				identity,
				_ => {
					throw error;
				},
				Promise.resolve("foo")
			)
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
	
	describe("chain", function() {
		let
			gotCalled = null;
		
		beforeEach(function() {
			gotCalled = false;
		});
		
		it("returns the result of f for a resolved promise", () => Promise.all([
			chain(x => laterSucceed(10, x * x), of(7))
			.then(
				x => { assert.strictEqual(x, 49); },
				e => { assert.fail(`Should not fail with ${e}`); }
			),
			
			chain(x => laterFail(10, x * x), of(8))
			.then(
				x => { assert.fail(`should not succeed with ${x}`); },
				e => { assert.strictEqual(e, 64); }
			)
		]));
		
		it("does not invoke f for a rejected promise", () =>
			chain(x => { gotCalled = true; return laterFail(10, x * x); }, Promise.reject(6))
			.then(
				x => { assert.fail(`should not succeed with ${x}`); },
				e => {
					assert.strictEqual(e, 6);
					assert.isFalse(gotCalled);
				}
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
	
	describe("chainTap", function() {
		const
			dT = 50;
		let
			beginTs;
		
		beforeEach(function() {
			beginTs = now();
		});
		
		it("delays a resolved promise for the duration of the async function", () =>
			chainTap(() => laterSucceed(dT, "bar"), of("foo"))
			.then(
				x => {
					assert.strictEqual(x, "foo");
					assert.approximately(now() - beginTs, dT, 15);
				},
				e => { assert.fail(`Should not fail with ${e}`); }
			)
		);
		
		it("does not invoke f for a rejected promise", () => {
			let isInvoked = false;
			
			return chainTap(
				() => {
					isInvoked = true;
					return Promise.resolve("bar");
				},
				Promise.reject("foo")
			)
			.then(
				x => { assert.fail(`Should not succeed with ${x}`); },
				e => {
					assert.strictEqual(e, "foo");
					assert.isFalse(isInvoked, "must not call f");
				}
			);
		});
		
		it("returns a rejected promise with the rejected value of the async function", () =>
			chainTap(() => laterFail(dT, "bar"), of("foo"))
			.then(
				x => { assert.fail(`Should not succeed with ${x}`); },
				e => { assert.strictEqual(e, "bar"); }
			)
		);
	});
	
	describe("chainIf", function() {
		let
			gotCalled = null;
		
		beforeEach(function() {
			gotCalled = false;
		});
		
		it("chains f if the predicate holds", () =>
			Promise.all([
				chainIf(x => x === 7, x => laterSucceed(10, x * x), of(7))
				.then(
					x => { assert.strictEqual(x, 49); },
					e => { assert.fail(`Should not fail with ${e}`); }
				),
				
				chainIf(x => x === 7, x => laterFail(10, x * x), of(7))
				.then(
					x => { assert.fail(`Should not succeed with ${x}`); },
					e => { assert.strictEqual(e, 49); }
				)
			])
		);
		
		it("does not invoke f if the predicate test fails", () =>
			chainIf(
				x => x === 7,
				x => {
					gotCalled = true;
					return laterFail(10, x * x);
				},
				of(8)
			)
			.then(
				x => {
					assert.strictEqual(x, 8);
					assert.isFalse(gotCalled, "Should not invoke f");
				},
				e => { assert.fail(`Should not fail with ${e}`); }
			)
		);
	});
	
	describe("alt", function() {
		it("resolves with the value of the first resolved promise", () => Promise.all([
			alt(laterSucceed(10, "foo"), laterSucceed(50, "bar"))
			.then(
				x => { assert.strictEqual(x, "foo"); },
				e => { assert.fail(`Should not fail with ${e}`); }
			),
			alt(laterSucceed(100, "foo"), laterSucceed(50, "bar"))
			.then(
				x => { assert.strictEqual(x, "bar"); },
				e => { assert.fail(`Should not fail with ${e}`); }
			),
			alt(laterFail(10, "FOO"), laterSucceed(50, "bar"))
			.then(
				x => { assert.strictEqual(x, "bar"); },
				e => { assert.fail(`Should not fail with ${e}`); }
			),
			alt(laterFail(100, "FOO"), laterSucceed(50, "bar"))
			.then(
				x => { assert.strictEqual(x, "bar"); },
				e => { assert.fail(`Should not fail with ${e}`); }
			)
		]));
		
		it("rejects with the value of the last rejected promise", () => Promise.all([
			alt(laterFail(10, "FOO"), laterFail(50, "BAR"))
			.then(
				x => { assert.fail(`Should not succeed with ${x}!`); },
				e => { assert.strictEqual(e, "BAR"); }
			),
			
			alt(laterFail(50, "FOO"), laterFail(10, "BAR"))
			.then(
				x => { assert.fail(`Should not succeed with ${x}!`); },
				e => { assert.strictEqual(e, "FOO"); }
			)
		]));
	});
	
	describe.skip("ap", function () {
	
	});
	
	describe("liftA2", function () {
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
});
