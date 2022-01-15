import { equals, identity, o, pair, pipe } from 'ramda';
import chai from 'chai';
import {bi_tap as bi_tap_c, later as later_c, laterReject as later_reject_c, of as of_c, liftA2} from '../../src/cancelable.js';
import createDeferred from "../helpers/createDeferred.js";
import {later as later_p} from '../../src/promise.js';
import hirestime from "../helpers/hirestime.mjs";

const
	assert = chai.assert,
	tap_c = bi_tap_c(identity),
	now = hirestime();

describe("cancelable liftA2", function () {
	this.slow(500);
	this.timeout(2000);
	
	let
		leftCancellationCount, rightCancellationCount, beginTs;
	
	const
		incrementLeftCancellationCount = () => { leftCancellationCount++; },
		incrementRightCancellationCount = () => { rightCancellationCount++; },
		leftRightLater = incrementCancellationCount => (dt, value) => (res, rej) => {
			const timer = setTimeout(res, dt, value);
			return () => {
				clearTimeout(timer);
				incrementCancellationCount();
			};
		},
		leftRightLaterReject = incrementCancellationCount => (dt, value) => (res, rej) => {
			const timer = setTimeout(rej, dt, value);
			return () => {
				clearTimeout(timer);
				incrementCancellationCount();
			};
		},
		/** @type {(dt: number, value: any) => import('@visisoft/staticland/cancelable').Cancelable} */
		leftLater = leftRightLater(incrementLeftCancellationCount),
		/** @type {(dt: number, value: any) => import('@visisoft/staticland/cancelable').Cancelable} */
		rightLater = leftRightLater(incrementRightCancellationCount),
		/** @type {(dt: number, value: any) => import('@visisoft/staticland/cancelable').Cancelable} */
		leftLaterReject = leftRightLaterReject(incrementLeftCancellationCount),
		/** @type {(dt: number, value: any) => import('@visisoft/staticland/cancelable').Cancelable} */
		rightLaterReject = leftRightLaterReject(incrementRightCancellationCount);
	
	beforeEach(function() {
		leftCancellationCount = rightCancellationCount = 0;
		beginTs = now();
	});
	
	it("returns the combination of two resolved Cancelables", () => Promise.all([
		new Promise(liftA2(pair, leftLater(20, "foo"), rightLater(0, "bar")))
		.then(x => {
			assert.deepStrictEqual(x, ["foo", "bar"]);
			assert.equal(leftCancellationCount + rightCancellationCount, 0);
		}),
		new Promise(liftA2(pair, leftLater(10, "foo"), rightLater(20, "bar")))
		.then(x => {
			assert.deepStrictEqual(x, ["foo", "bar"]);
			assert.equal(leftCancellationCount + rightCancellationCount, 0);
		})
	]));
	
	it("cancels the still pending computation on the left", () => {
		const
			dfd = createDeferred(),
			toCancel = liftA2(pair, leftLater(100, "foo"), rightLater(0, "bar"))(dfd.resolve, dfd.reject);
		
		return later_p(20, undefined)
		.then(() => {
			toCancel();
			return Promise.race([later_p(120, "have-waited-long-enough"), dfd.promise]);
		})
		.then(x => {
			assert.strictEqual(x, "have-waited-long-enough");
			assert.equal(rightCancellationCount, 0);
			assert.equal(leftCancellationCount, 1);
		});
	});
	
	it("cancels the still pending computation on the left", () => {
		const
			dfd = createDeferred(),
			toCancel = liftA2(pair, leftLater(0, "foo"), rightLater(100, "bar"))(dfd.resolve, dfd.reject);
		
		return later_p(20, undefined)
		.then(() => {
			toCancel();
			return Promise.race([later_p(120, "have-waited-long-enough"), dfd.promise]);
		})
		.then(x => {
			assert.strictEqual(x, "have-waited-long-enough");
			assert.equal(rightCancellationCount, 1);
			assert.equal(leftCancellationCount, 0);
		});
	});
	
	it("cancels the still pending computations on both sides", () => {
		const
			dfd = createDeferred(),
			toCancel = liftA2(pair, leftLater(100, "foo"), rightLaterReject(80, "bar"))(dfd.resolve, dfd.reject);
		
		return later_p(20, undefined)
		.then(() => {
			toCancel();
			return Promise.race([later_p(120, "have-waited-long-enough"), dfd.promise]);
		})
		.then(x => {
			assert.strictEqual(x, "have-waited-long-enough");
			assert.equal(rightCancellationCount, 1);
			assert.equal(leftCancellationCount, 1);
		});
	});
	
	it("shortcuts to the first failure", () =>
		new Promise(liftA2(pair, leftLaterReject(0, "baz"), rightLaterReject(50, "qux")))
		.then(
			x => { assert.fail(`Unexpected success with ${x}.`); },
			e => {
				assert.strictEqual(e, "baz");
				assert.approximately(now() - beginTs, 5, 5);
				assert.equal(leftCancellationCount, 0);
				assert.equal(rightCancellationCount, 1);
			}
		)
	);
	
	it("settles with the trailing left failure", () =>
		new Promise(liftA2(pair, leftLaterReject(50, "baz"), rightLater(10, "bar")))
		.then(
			x => { assert.fail(`Unexpected success with ${x}.`); },
			e => {
				assert.strictEqual(e, "baz");
				assert.approximately(now() - beginTs, 50, 5);
				assert.equal(leftCancellationCount, 0);
				assert.equal(rightCancellationCount, 0);
			}
		)
	);
	
	it("settles with the leading left failure", () =>
		new Promise(liftA2(pair, leftLaterReject(0, "baz"), rightLater(50, "bar")))
		.then(
			x => { assert.fail(`Unexpected success with ${x}.`); },
			e => {
				assert.strictEqual(e, "baz");
				assert.approximately(now() - beginTs, 5, 5);
				assert.equal(leftCancellationCount, 0);
				assert.equal(rightCancellationCount, 1);
			}
		)
	);
	
	it("settles with the trailing right failure", () =>
		new Promise(liftA2(pair, leftLater(10, "baz"), rightLaterReject(50, "qux")))
		.then(
			x => { assert.fail(`Unexpected success with ${x}.`); },
			e => {
				assert.strictEqual(e, "qux");
				assert.approximately(now() - beginTs, 50, 5);
				assert.equal(leftCancellationCount, 0);
				assert.equal(rightCancellationCount, 0);
			}
		)
	);
	
	it("settles with the leading right failure", () =>
		new Promise(liftA2(pair, leftLater(100, "bar"), rightLaterReject(20, "qux")))
		.then(
			x => { assert.fail(`Unexpected success with ${x}.`); },
			e => {
				assert.strictEqual(e, "qux");
				assert.approximately(now() - beginTs, 20, 5);
				assert.equal(leftCancellationCount, 1);
				assert.equal(rightCancellationCount, 0);
			}
		)
	);
});
