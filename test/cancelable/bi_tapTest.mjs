import { equals, identity, o } from 'ramda';
import chai from 'chai';
import { bi_tap, later, laterReject, of } from "../../src/cancelable.js";
import hirestime from '../helpers/hirestime.mjs';
import { assertCorrectInterface } from "../helpers/types.mjs";

const
	assert = chai.assert,
	now = hirestime();

describe("bi_tap", function () {
	let begin, successValue, failureValue;
	
	beforeEach(function() {
		begin = now();
		successValue = "initial success";
		failureValue = "initial failure";
	});
	
	const
		successSideEffect = x => {
			successValue = `${x}-bar`;
		},
		failureSideEffect = e => {
			failureValue = `${e}-foo`;
		};
	
	it("should execute the side effect in the success case", () =>
		new Promise(bi_tap(failureSideEffect, successSideEffect)(later(20, "foo")))
		.then(result => {
			assert.strictEqual(result, "foo");
			assert.strictEqual(successValue, "foo-bar");
			assert.strictEqual(failureValue, "initial failure");
			assert.approximately(now() - begin, 20, 8);
		})
	);
	
	it("should execute the side effect in failure", () =>
		new Promise(bi_tap(failureSideEffect, successSideEffect, laterReject(20, "bar")))
		.then(
			() => assert.fail("should not succeed"),
			error => {
				assert.approximately(now() - begin, 20, 8);
				assert.strictEqual(error, "bar");
				assert.strictEqual(failureValue, "bar-foo");
				assert.strictEqual(successValue, "initial success");
			}
		)
	);
	
	it("propagates exceptions in the side-effect to the returned promise", () => {
		const
			error = new Error("side-effect exception");
		
		return new Promise(bi_tap(
			identity,
			_ => {
				throw error;
			},
			of("foo")
		))
		.then(
			val => assert.fail(`Should not resolve with ${val} after exception in the side-effect function`),
			e => assert.equal(e, error)
		);
	});
	
	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(bi_tap(identity, identity, of("foo")));
	});
});
