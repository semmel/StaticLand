import { call, equals, identity, o } from 'ramda';
import chai from 'chai';
import { assertCorrectInterface } from "../helpers/types.mjs";
import { createRequire } from 'node:module';
import { fromNodeCallbackWithArity } from "../../src/cancelable.js";
import assertCancellationDiscontinues from "./helpers/assertCancellationDiscontinues.mjs";

const
	require = createRequire(import.meta.url),
	hirestime = require('hirestime').default,
	now = hirestime(),
	assert = chai.assert,
	dT = 50,
	sampleSourceFn = (param, callback) => { setTimeout(() => { callback(null, param); }, dT); },
	sampleErrorSourceFn = (error, callback) => { setTimeout(() => { callback(error, null); }, dT); },
	sampleBinarySourceFn = (x, y, callback) => { setTimeout(() => { callback(null, x + y); }, dT); },
	sampleSyncSourceFn = (param, callback) => { callback(null, param); },
	sampleSyncErrorSourceFn = (error, callback) => { callback(error, null); };

describe("cancelable/fromNodeCallback", function () {
	this.slow(200);
	this.timeout(1000);

	let beginTs = 0;
	beforeEach(function() {
		beginTs = now();
	});

	it("creates a function with the right arity which returns a cancelable which fulfills with the result", () => {
		const
			createSampleCancelable = fromNodeCallbackWithArity(1, sampleSourceFn);

		assert.isFunction(createSampleCancelable);
		assert.equal(createSampleCancelable.length, 1, "Must have right arity");

		const
			sampleCancelable = createSampleCancelable("foo");

		assertCorrectInterface("monad")(sampleCancelable);

		return new Promise(sampleCancelable)
		.then(x => {
			assert.strictEqual(x, "foo");
			assert.approximately(now() - beginTs, dT, dT / 3);
		});
	});

	it("works with binary functions", () => {
		const
			createSampleCancelable = fromNodeCallbackWithArity(2, sampleBinarySourceFn);

		assert.isFunction(createSampleCancelable);
		assert.equal(createSampleCancelable.length, 2, "Must have right arity");

		const
			sampleCancelable = createSampleCancelable(5)(7);

		return new Promise(sampleCancelable)
		.then(x => {
			assert.strictEqual(x, 12);
			assert.approximately(now() - beginTs, dT, dT / 3);
		});
	});

	it("works with errors", () =>
		new Promise(fromNodeCallbackWithArity(1, sampleErrorSourceFn)("bar"))
		.then(
			x => { assert.fail(`Should not succeed with "${x}"`); },
			e => {
				assert.strictEqual(e, "bar");
				assert.approximately(now() - beginTs, dT, dT / 3);
			}
		)
	);

	it("synchronous cancellation discontinues", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: fromNodeCallbackWithArity(1, sampleSourceFn)("qux"),
			isSynchronous: true
		})
	);

	it("works with sync results", () => {
		const
			ca = fromNodeCallbackWithArity(1, sampleSyncSourceFn)("baz");

		return new Promise(ca)
		.then(x => {
			assert.strictEqual(x, "baz");
		});
	});

	it("works with sync failures", () =>
		new Promise(fromNodeCallbackWithArity(1, sampleSyncErrorSourceFn)("quz"))
		.then(
			x => { assert.fail(`Should not succeed with "${x}"`); },
			e => {
				assert.strictEqual(e, "quz");
			}
		)
	);
});
