import chai from 'chai';
import { right, left } from '../../src/either.js';
import eitherToCancelable from "../../src/transformations/eitherToCancelable.js";
import assertCancellationDiscontinues from "../cancelable/helpers/assertCancellationDiscontinues.mjs";
import { chain as chain_c, later as later_c, laterReject as later_reject_c } from '../../src/cancelable.js';
import {identity, pipe} from 'semmel-ramda';
import { cancelableToPromise } from "../../src/transformations.js";
import { tap as tap_p } from '../../src/promise.js';

const
	assert = chai.assert,
	join_c = chain_c(identity);

describe("transformations eitherToCancelable", function () {
	it("returns a succeeding cancelable from a right", () =>
		new Promise(eitherToCancelable(right("foo")))
		.then(
			x => { assert.equal(x, "foo"); },
			e => { assert.fail(`Unexpected failure with value ${e}`); }
		)
	);
	
	it("returns a succeeding Cancelable of a Cancelable", pipe(
		() => right(later_c(20, "foo")),
		eitherToCancelable,
		join_c,
		cancelableToPromise,
		tap_p(x => { assert.strictEqual(x, "foo"); })
	));
	
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
