import {equals, identity, o} from 'semmel-ramda';
import chai from 'chai';
import promiseToCancelable from "../../src/transformations/promiseToCancelable.js";
import assertCancellationDiscontinues from "../cancelable/helpers/assertCancellationDiscontinues.mjs";

const
	assert = chai.assert;

describe("transformation promiseToCancelable", function () {
	it("propagates the settlement of the promise", () => Promise.all([
		new Promise(promiseToCancelable(Promise.resolve("foo")))
		.then(x => { assert.strictEqual(x, "foo"); }),
		new Promise(promiseToCancelable(Promise.reject("bar")))
		.then(
			x => { assert.fail(`Should not succeed with ${x}`); },
			e => { assert.strictEqual(e, "bar"); }
		)
	]));
	
	it ("asynchronous cancelling discontinues pending succeeding promise", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: promiseToCancelable(new Promise(resolve => setTimeout(resolve, 30, "baz"))),
			delay: 20
		})
	);
	
	it ("synchronous cancelling discontinues a settled promise", () => Promise.all([
		assertCancellationDiscontinues({
			assert,
			cancelable: promiseToCancelable(Promise.resolve("baz-baz")),
			isSynchronous: true
		}),
		assertCancellationDiscontinues({
			assert,
			cancelable: promiseToCancelable(Promise.reject("foo-baz")),
			isSynchronous: true
		})
	]));
	
	it ("asynchronous cancelling discontinues pending failing promise", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: promiseToCancelable(new Promise((unused, reject) => setTimeout(reject, 30, "fuz"))),
			delay: 20
		})
	);
});
