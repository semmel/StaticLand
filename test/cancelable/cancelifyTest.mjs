import { pipe, identity, o, reverse } from 'ramda';
import chai from 'chai';
import cancelify from "../../src/cancelable/cancelify.js";
import { cancelableToPromise } from "../../src/transformations.js";
import { coalesce as coalesce_p, tap as tap_p } from '../../src/promise.js';
import hirestime from "../helpers/hirestime.mjs";
import assertCancellationDiscontinues from "./helpers/assertCancellationDiscontinues.mjs";
import { assertCorrectInterface } from "../helpers/types.mjs";

const
	assert = chai.assert,
	now = hirestime(),
	createLatePromise = a => new Promise(resolve => {
		setTimeout(resolve, 50, a);
	}),
	createLateRejectedPromise = (a, b) => new Promise((resolve, reject) => {
		setTimeout(reject, 50, a - b);
	});

describe("cancelable/cancelify", function () {
	this.slow(200);
	
	const
		createLateCancelable = cancelify(createLatePromise),
		createLateRejectedCancelable = cancelify(createLateRejectedPromise);
	
	it("propagates the resolved value of the promise", () => {
		const
			beginTS = now();
		
		return pipe(
			() => createLateCancelable("foo"),
			cancelableToPromise,
			tap_p(x => {
				assert.strictEqual(x, "foo");
				assert.approximately(now() - beginTS, 50, 10);
			})
		)();
	});
	
	it("propagates the rejected value of a binary promise generator", () => {
		const
			beginTS = now();
		
		return pipe(
			() => createLateRejectedCancelable(13, 10),
			cancelableToPromise,
			coalesce_p(
				x => {
					assert.strictEqual(x, 3);
					assert.approximately(now() - beginTS, 50, 10);
				},
				x => { assert.fail(`Unexpected success with ${x}.`); }
			)
		)();
	});
	
	it ("asynchronous cancelling discontinues pending succeeding promise", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: createLateCancelable("baz"),
			delay: 20
		})
	);
	
	it ("synchronous cancelling discontinues a settled promise", () => Promise.all([
		assertCancellationDiscontinues({
			assert,
			cancelable: cancelify(x => Promise.resolve(x))("baz-baz"),
			isSynchronous: true
		}),
		assertCancellationDiscontinues({
			assert,
			cancelable: cancelify(x => Promise.reject(x))("foo-baz"),
			isSynchronous: true
		})
	]));
	
	it ("asynchronous cancelling discontinues pending failing promise", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: createLateRejectedCancelable(200, 1),
			delay: 20
		})
	);
	
	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(createLateCancelable("foo"));
	});
});
