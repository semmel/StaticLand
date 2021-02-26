import chai from 'chai';
import cancelableToPromise from "../../src/transformations/cancelableToPromise.js";
import {of, reject} from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("transformation cancelableToPromise", function () {
	it("propagates success", () =>
		cancelableToPromise(of("foo")).then(x => {assert.strictEqual(x, "foo");})
	);
	
	it("propagates failure", () =>
		cancelableToPromise(reject("doo"))
		.then(
			x => {assert.fail(`Unexpected success with ${x}`); },
			x => {assert.strictEqual(x, "doo");}
		)
	);
});
