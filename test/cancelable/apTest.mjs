import { equals, identity, o, reverse } from 'ramda';
import chai from 'chai';
import { assertCorrectInterface } from "../helpers/types.mjs";
import { of, ap } from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("Cancelable ap", function () {
	it("applies the function", () =>
		new Promise(ap(of(reverse), of("foo")))
		.then(x => { assert.strictEqual(x, "oof"); })
	);
	
	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(ap(of(reverse), of("foo")));
	});
});
