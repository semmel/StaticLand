import chai from 'chai';
import mostCorePkg from "@most/core";
import {inc, pipe} from 'ramda';
import mostStreamToCancelable from "../../src/transformations/mostStreamToCancelable.js";
import assertCancellationDiscontinues from "../cancelable/helpers/assertCancellationDiscontinues.mjs";

const
	{at, periodic, take, scan, continueWith, throwError} = mostCorePkg,
	assert = chai.assert,
	nrs0to10 = take(11, scan(inc, 0, periodic(10))),
	laterAThenAXErrorThenBThenYError = pipe(
		() => at(200, "A"),
		continueWith(() => throwError("X")),
		continueWith(() => at(200, "B")),
		continueWith(() => throwError("Y"))
	)();

describe("transformation mostStreamToCancelable", function () {
	this.slow(1000);
	this.timeout(2000);
	
	it("completes with the last stream value", () =>
		new Promise(mostStreamToCancelable(nrs0to10))
		.then(x => { assert.strictEqual(x, 10); })
	);
	
	it("rejects with the first error in the stream", () =>
		new Promise(mostStreamToCancelable(laterAThenAXErrorThenBThenYError))
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => { assert.strictEqual(e, "X"); }
		)
	);
	
	it("cancellation discontinues", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: mostStreamToCancelable(nrs0to10),
			delay: 60
		})
	);
});
