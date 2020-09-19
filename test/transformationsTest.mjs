import {equals, identity, o} from 'semmel-ramda';
import chai from 'chai';
import { right, left } from '../src/either.js';
import { just, nothing } from '../src/maybe.js';
import { eitherToPromise, maybeToPromise } from '../src/transformations.js';

const
	assert = chai.assert;

describe("eitherToPromise", function () {
	it("returns a succeeding promise from a right", () =>
		eitherToPromise(right("foo"))
		.then(
			x => { assert.equal(x, "foo"); },
			e => { assert.fail(`Unexpected failure with value ${e}`); }
		)
	);
	
	it ("returns a failing promise from a left", () =>
		eitherToPromise(left("bar"))
		.then(
			x => { assert.fail(`Unexpected success with value ${x}`); },
			e => { assert.equal(e, "bar"); }
		)
	);
});

describe("maybeToPromise", function() {
	it("returns a promise rejected with the given value for a nothing", () =>
		maybeToPromise("foo", nothing())
		.then(
			x => { assert.fail(`Unexpected success with value ${x}`); },
			e => { assert.equal(e, "foo"); }
		)
	);
});