import baconObservableToCancelable from "../../src/transformations/baconObservableToCancelable.js";
import chai from 'chai';
import assertCancellationDiscontinues from "../cancelable/helpers/assertCancellationDiscontinues.mjs";
import * as Bacon from 'baconjs';
import { assertCorrectInterface } from "../helpers/types.mjs";

const
	assert = chai.assert;

describe("transformation baconObservableToCancelable", function () {
	this.slow(1000);
	this.timeout(2000);
	
	it("completes with the last event value", () =>
		new Promise(baconObservableToCancelable(Bacon.sequentially(10, ["foo", "doo"])))
		.then(x => { assert.strictEqual(x, "doo"); })
	);
	
	it("rejects with the first error in the stream", () =>
		new Promise(baconObservableToCancelable(Bacon.sequentially(10, ["foo", new Bacon.Error("baz"), "doo", new Bacon.Error("bar")])))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => { assert.strictEqual(e, "baz"); }
		)
	);
	
	it("cancellation discontinues", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: baconObservableToCancelable(Bacon.sequentially(50, ["foo", new Bacon.Error("baz"), "doo"])),
			delay: 60
		})
	);
	
	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(baconObservableToCancelable(Bacon.once("foo")));
	});
});
