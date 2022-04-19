import { equals, identity, o, pipe } from 'ramda';
import chai from 'chai';
import { of, pluck } from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("Cancelable pluck", function () {
	it("maps to the value if the property is present", () =>{
		const
			ca = of({foo: "FOO", isFoo: true}),
			cFoo = pluck("foo", ca),
			cIsFoo = pluck("isFoo", ca);
		
		return Promise.all([new Promise(cFoo), new Promise(cIsFoo)])
		.then(xs => {
			assert.deepStrictEqual(xs, ["FOO", true]);
		});
	});
	
	it("works for Cancelable Arrays", () =>
		new Promise(pluck(1, of([10, 11, 12])))
		.then(x => {
			assert.equal(x, 11)
		})
	);
	
	it("maps to undefined if the property is not present", () => {
		const
			ca = of({foo: "FOO", isFoo: true}),
			cFoo = pluck("bar", ca);
		
		return new Promise(cFoo)
		.then(x => {
			assert.isUndefined(x);
		});
	});
});
