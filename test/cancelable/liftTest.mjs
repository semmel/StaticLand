import { curryN, equals, identity, o, pair, pipe, unapply } from 'ramda';
import liftA2 from "../../src/fantasyland/liftA2.js";
import chai from 'chai';
import {laterReject, later} from '../../src/cancelable.js';
import { createRequire } from 'node:module';
const
	require = createRequire(import.meta.url),
	hirestime = require('hirestime').default,

	assert = chai.assert,
	now = hirestime(),
	triple = curryN(3, unapply(identity));

describe("cancelable liftA2 via fantasyland/liftA2", function () {
	this.slow(500);
	this.timeout(2000);
	
	let beginTs;
	
	beforeEach(function() {
		beginTs = now();
	});
	
	it("returns the combination of two resolved Cancelables", () =>
		new Promise(
			liftA2(pair)(later(20, "foo"), later(0, "bar"))
		)
		.then(x => {
			assert.deepStrictEqual(x, ["foo", "bar"]);
		})
	);
	
	it.skip ("runs three computations in parallel", () =>
		new Promise(liftA2(triple)(later(50, "foo"), later(50, "bar"), later(50, "baz")))
		.then(xs => {
			assert.deepStrictEqual(xs, ["foo", "bar", "baz"]);
			assert.approximately(now() - beginTs, 50, 10);
		})
	);
});
