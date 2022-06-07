import { add, equals, identity, o, subtract as subtractFrom} from 'ramda';
import chai from 'chai';
import { coalesce, later, laterReject } from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("cancelable coalesce", function () {
	it("is like map for success", () =>
		new Promise(
			coalesce(add(10), subtractFrom(90), later(10, 50))
		)
		.then(x => assert.strictEqual(x, 40))
	);
	
	it("transforms failures with the second function to successes", () =>
		new Promise(
			coalesce(add(10), subtractFrom(90), laterReject(10, 50))
		)
		.then(x => assert.strictEqual(x, 60))
	);
});
