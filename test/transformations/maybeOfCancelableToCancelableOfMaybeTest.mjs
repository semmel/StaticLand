import {equals, identity, o} from 'ramda';
import chai from 'chai';
import {maybeOfCancelableToCancelableOfMaybe} from "../../src/transformations.js";
import {getOrElse, isJust, isNothing, nothing, of as of_mb} from "../../src/maybe.js";
import {of, reject} from '../../src/cancelable.js';

const
	assert = chai.assert,
	
	assertIsCancelable = x => {
		assert.isFunction(x);
		assert.lengthOf(x, 2);
	};

describe("transformations maybeOfCancelableToCancelableOfMaybe", function () {
	it("un-nests nothing to a Cancelable of nothing", () => {
		const cancelableOfNothing = maybeOfCancelableToCancelableOfMaybe(nothing());
		
		assertIsCancelable(cancelableOfNothing);
		
		return new Promise(cancelableOfNothing)
		.then(
			value => {
				assert.ok(isNothing(value));
			},
			error => {
				assert.fail(`Should not fail with ${error}`);
			}
		);
	});
	
	it("un-nests just a rejection to a rejected Cancelable", () => {
		const
			failedCancelable = maybeOfCancelableToCancelableOfMaybe(of_mb(reject("foo")));
		
		assertIsCancelable(failedCancelable);
		
		return new Promise(failedCancelable)
		.then(
			value => { assert.fail(`should not succeed with ${value}!`); },
			error => { assert.equal(error, "foo"); }
		);
	});
	
	it("un-nests just a resolved cancelable to a Cancelable of a just", () => {
		const
			cancelableOfJust = maybeOfCancelableToCancelableOfMaybe(of_mb(of("bar")));
		
		assertIsCancelable(cancelableOfJust);
		
		return new Promise(cancelableOfJust)
		.then(
			value => {
				assert.ok(isJust(value));
				assert.equal(getOrElse("unexpected value", value), "bar");
			},
			error => {
				assert.fail(`Should not fail with ${error}`);
			}
		);
	});
});
