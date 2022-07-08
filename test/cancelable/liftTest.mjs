import { curryN, equals, identity, lift, o, pair, pipe, unapply } from 'ramda';
import chai from 'chai';
import {bi_tap as bi_tap_c, laterReject, later, of} from '../../src/cancelable.js';
import hirestime from "../helpers/hirestime.mjs";

const
	assert = chai.assert,
	now = hirestime(),
	triple = curryN(3, unapply(identity));

describe("cancelable lift via fantasy-land", function () {
	this.slow(500);
	this.timeout(2000);
	
	let beginTs;
	
	beforeEach(function() {
		beginTs = now();
	});
	
	it("returns the combination of two resolved Cancelables", () =>
		new Promise(
			lift(pair)(later(20, "foo"), later(0, "bar"))
		)
		.then(x => {
			assert.deepStrictEqual(x, ["foo", "bar"]);
		})
	);
	
	it ("runs computations in parallel", () =>
		new Promise(lift(triple)(later(50, "foo"), later(50, "bar"), later(50, "baz")))
		.then(xs => {
			assert.deepStrictEqual(xs, ["foo", "bar", "baz"]);
			assert.approximately(now() - beginTs, 50, 10);
		})
	);
});
