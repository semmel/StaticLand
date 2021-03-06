import {equals, identity, o} from 'semmel-ramda';
import chai from 'chai';
import of from '../../src/cancelable/of.js';
import assertCancellationDiscontinues from "./helpers/assertCancellationDiscontinues.mjs";

const
	assert = chai.assert;

describe("cancelable of", function () {
	it("calls the success callback with the given value", () =>
		new Promise(of("foo"))
		.then(x => assert.strictEqual(x, "foo"))
	);
	
	it("will not invoke the callbacks when synchronously canceled", () =>
		assertCancellationDiscontinues({assert, cancelable: of("foo"), isSynchronous: true})
	);
});
