import {construct, equals, identity, o, pipe} from 'ramda';
import chai from 'chai';
import { right, left } from '../src/either.js';
import { getOrElse, isNothing, isJust, just, map as map_mb, nothing, of as of_mb } from '../src/maybe.js';
import {
	cancelableToEventStream, eitherToPromise, keyMaybeToMaybeObj,
	maybeToPromise, maybeOfPromiseToPromiseOfMaybe
}
from	'../src/transformations.js';
import { later as later_c, laterReject as later_reject_c } from "../src/cancelable.js";
import hirestime from "./helpers/hirestime.mjs";
import * as Bacon from 'baconjs';

const
	assert = chai.assert,
	now = hirestime();

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

describe("cancelableToEventStream", function() {
	this.slow(1000);
	
	let begin = 0, isCanceled = false;
	
	beforeEach(function() {
		begin = now();
		isCanceled = false;
	});
	
	it("propagates the success value", pipe(
		() => later_c(100, "OK"),
		cancelableToEventStream,
		s => s.toPromise(),
		p => p.then(outcome => {
			assert.strictEqual(outcome, "OK");
			assert.approximately(now() - begin, 100, 25);
		})
	));
	
	it("propagates the failure", () => {
		const sampleError = new Error("sample error");
		return pipe(
			() => later_reject_c(50, sampleError),
			cancelableToEventStream,
			s => s.toPromise(),
			p => p.then(
				outcome => { assert.fail(`Should not succeed with ${outcome}`); },
				error => {
					assert.equal(error, sampleError);
					assert.approximately(now() - begin, 100, 25);
				})
		);
	});
	
	it("aborts when stream unsubscribes", () => {
		const
			c = (res, rej) => {
				const timer = setTimeout(res, 200, "OK");
				return () => {
					clearTimeout(timer);
					isCanceled = true;
				};
			},
			
			s = cancelableToEventStream(c).takeUntil(Bacon.later(50, undefined));
		
		return Promise.race([
			s.toPromise()
			.finally(() => {
				assert.fail("cancelable should not settle");
			}),
			new Promise(resolve => { setTimeout(resolve, 300, "race B"); })
		])
		.then(raceOutcome => {
			assert.strictEqual(raceOutcome, "race B");
			assert.isTrue(isCanceled, "cancelable should be canceled");
		});
	});
});

