import {equals, identity, o} from 'ramda';
import chai from 'chai';
import { right, left } from '../src/either.js';
import { getOrElse, isNothing, isJust, just, map as map_mb, nothing, of as of_mb } from '../src/maybe.js';
import {
	eitherToPromise, keyMaybeToMaybeObj,
	maybeToPromise, maybeOfPromiseToPromiseOfMaybe
}
from	'../src/transformations.js';


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

describe("maybeOfPromiseToPromiseOfMaybe", function() {
	it("un-nests nothing to a promise of nothing", () => {
		const
			promiseOfNothing = maybeOfPromiseToPromiseOfMaybe(nothing());
		
		assert.instanceOf(promiseOfNothing, Promise);
		
		return promiseOfNothing
		.then(
			value => {
				assert.ok(isNothing(value));
			},
			error => {
				assert.fail(`Should not fail with ${error}`);
			}
		);
	});
	
	it("un-nests just a rejection to a rejected promise", () => {
		const
			failedPromise = maybeOfPromiseToPromiseOfMaybe(of_mb(Promise.reject("foo")));
		
		assert.instanceOf(failedPromise, Promise);
		
		return failedPromise
		.then(
			value => { assert.fail(`should not succeed with ${value}!`); },
			error => { assert.equal(error, "foo"); }
		);
	});
	
	it("un-nests just a resolved promise to a promise of a just", () => {
		const
			promiseOfJust = maybeOfPromiseToPromiseOfMaybe(of_mb(Promise.resolve("bar")));
		
		assert.instanceOf(promiseOfJust, Promise);
		
		return promiseOfJust
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

describe("keyMaybeToMaybeObj", function() {
	it("returns a Just of the record with the just value at the given key", () => {
		assert.deepStrictEqual(
			keyMaybeToMaybeObj("foo", {foo: just("FOO"), bar: "BAR"}),
			just({foo: "FOO", bar: "BAR"})
		);
	});
	
	it("returns a Nothing for a record with a nothing value at the given key", () => {
		assert.deepStrictEqual(
			keyMaybeToMaybeObj("foo", {bar: "BAR", foo: nothing()}),
			nothing()
		);
	});
});

