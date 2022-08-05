import chai from 'chai';
import { later, laterReject, share } from "../../src/cancelable.js";
import hirestime from "../helpers/hirestime.mjs";
import { later as later_p } from '../../src/promise.js';
import { assertCorrectInterface } from "../helpers/types.mjs";

const
	assert = chai.assert,
	now = hirestime();

describe("cancelable share", function () {
	this.slow(2000);
	this.timeout(4000);

	const
		dT = 50;

	it("delivers the outcome to the only consumer as usual", () => {
		const
			sharableFoo = share(later(dT, "foo"));

		let begin = 0;

		return later_p(dT, undefined)
		.then(x => {
			begin = now();
			return new Promise(sharableFoo);
		})
		.then(x => {
			assert.approximately(now() - begin, dT, 10);
			assert.strictEqual(x, "foo");
		});
	});
	
	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(share(later(10, 50)));
	});

	it("delivers the cached result ASAP", () => {
		const
			sharableFoo = share(later(dT, "foo"));

		let begin = now();

		return new Promise(sharableFoo)
		.then(x => {
			assert.approximately(now() - begin, dT, 10);
			assert.strictEqual(x, "foo");

			begin = now();
			return new Promise(sharableFoo);
		})
		.then(x => {
			assert.approximately(now() - begin, 0, 10);
			assert.strictEqual(x, "foo");
		});
	});

	it("delivers the cached rejection ASAP", () => {
		const
			sharableFoo = share(laterReject(dT, "bar"));

		let begin = now();

		return new Promise(sharableFoo)
		.then(
			x => { assert.fail(`Unexpected success with ${x}`); },
			e => {
				assert.approximately(now() - begin, dT, 10);
				assert.strictEqual(e, "bar");

				begin = now();
				return new Promise(sharableFoo);
			}
		)
		.then(
			x => { assert.fail(`Unexpected success with ${x}`); },
			e => {
				assert.approximately(now() - begin, 0, 10);
				assert.strictEqual(e, "bar");
			}
		);
	});

	it("delivers the result at the same instance of time to all parallel consumers", () => {
		const
			sharableFoo = share(later(dT, "foo")),
			begin = now();

		return Promise.all([
			new Promise(sharableFoo),

			later_p(dT / 2, undefined)
			.then(() => new Promise(sharableFoo))
		])
		.then(xs => {
			assert.deepStrictEqual(xs, ["foo", "foo"]);
			assert.approximately(now() - begin, dT, 10);
		});
	});

	it ("aborts and restarts the computation depending on the number of consumers", () => {
		let
			cancellationCount = 0,
			executionCount = 0,
			begin = 0;
		const
			computation = share((res, rej) => {
				const timer = setTimeout(res, 2 * dT, "qux");
				executionCount++;
				return () => {
					clearTimeout(timer);
					cancellationCount++;
				};
			}),

			// start together
			unConsumeA = computation(
				x => { throw new Error(`Unexpected success callback call with ${x}`); },
				e => { throw new Error(`Unexpected failure callback call with ${e}`); }
			),
			unConsumeB = computation(
				x => { throw new Error(`Unexpected success callback call with ${x}`); },
				e => { throw new Error(`Unexpected failure callback call with ${e}`); }
			);

		// un-consume one after the other
		setTimeout(unConsumeA, dT / 2);
		setTimeout(unConsumeB, dT);

		// restart one after the other
		return later_p(3 * dT, undefined)
		.then(() => {
			begin = now();
			return Promise.all([
				new Promise(computation),

				later_p(dT, undefined)
				.then(() => new Promise(computation))
			]);
		})
		.then(xs => {
			assert.approximately(now() - begin, 2 * dT, 15);
			assert.deepStrictEqual(xs, ["qux", "qux"]);
			assert.equal(cancellationCount, 1);
			assert.equal(executionCount, 2);
		});

	});
});
