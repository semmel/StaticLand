import chai from 'chai';
import { right, left } from '../../src/either.js';
import {eitherToPromise} from "../../src/transformations.js";

const
	assert = chai.assert;

describe("transformations eitherToPromise", function () {
	it("returns a resolved Promise from a right", () =>
		eitherToPromise(right("foo"))
		.then(x => assert.strictEqual(x, "foo"))
	);
	
	it("returns a rejected Promise from a left", () =>
		eitherToPromise(left("bar"))
		.then(
			val => { assert.fail(`Unexpected success with ${val}`); },
			x => { assert.strictEqual(x, "bar"); }
		)
	);
});
