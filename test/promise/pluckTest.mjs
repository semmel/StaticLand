import pluck from '../../src/fantasyland/pluck.js';
import chai from 'chai';
import { of } from "../../src/promise.js";

const
	assert = chai.assert;

describe("Promise pluck", function () {
	it("maps to the value if the property is present", () =>{
		const
			ca = of({foo: "FOO", isFoo: true}),
			cFoo = pluck("foo", ca),
			cIsFoo = pluck("isFoo", ca);
		
		return Promise.all([cFoo, cIsFoo])
		.then(xs => {
			assert.deepStrictEqual(xs, ["FOO", true]);
		});
	});
	
	it("works for Promise Arrays", () =>
		pluck(1, of([10, 11, 12]))
		.then(x => {
			assert.equal(x, 11);
		})
	);
	
	it("maps to undefined if the property is not present", () => {
		const
			ca = of({foo: "FOO", isFoo: true}),
			cFoo = pluck("bar", ca);
		
		return cFoo
		.then(x => {
			assert.isUndefined(x);
		});
	});
});
