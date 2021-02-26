import chai from 'chai';
import reject from '../../src/cancelable/reject.js';
import assertCancellationDiscontinues from "./helpers/assertCancellationDiscontinues.mjs";

const
	assert = chai.assert;

describe("cancelable reject", function () {
	it("calls the success callback with the given value", () =>
		new Promise(reject("foo"))
		.then(
			x => { assert.fail(`Should not succeed with ${x}`); },
			e => assert.strictEqual(e, "foo")
		)
	);
	
	it("will not invoke the callbacks when synchronously canceled", () =>
		assertCancellationDiscontinues({assert, cancelable: reject("foo"), isSynchronous: true})
	);
});
