import chai from 'chai';
import { right, left } from '../../src/either.js';
import eitherToCancelable from "../../src/transformations/eitherToCancelable.js";
import assertCancellationDiscontinues from "../cancelable/helpers/assertCancellationDiscontinues.mjs";

const
	assert = chai.assert;

describe("transformations eitherToCancelable", function () {
	it("returns a succeeding cancelable from a right", () =>
		new Promise(eitherToCancelable(right("foo")))
		.then(
			x => { assert.equal(x, "foo"); },
			e => { assert.fail(`Unexpected failure with value ${e}`); }
		)
	);
	
	it("returns a failing cancelable from a left", () =>
		new Promise(eitherToCancelable(left("bar")))
		.then(
			x => { assert.fail(`Unexpected success with value ${x}`); },
			e => { assert.equal(e, "bar"); }
		)
	);
	
	it("cancellation discontinues", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: eitherToCancelable(right("baz")),
			isSynchronous: true
		})
	);
});
