import {equals, identity, objOf, map, modify} from 'semmel-ramda';
import chai from 'chai';
import {isNothing, isJust, just, nothing, sequence} from '../../src/maybe.js';

const
	assert = chai.assert;

describe("Maybe sequence", function () {
	it("Object Applicative", () => {
		const
			maybeOfObjectToObjectOfMaybe = sequence(objOf("foo"), modify("foo")),
			objOfNothing = maybeOfObjectToObjectOfMaybe(nothing()),
			objOfJust = maybeOfObjectToObjectOfMaybe(just({foo: "bar"}));
		
		assert.isObject(objOfNothing);
		assert.property(objOfNothing, "foo");
		assert.isTrue(isNothing(objOfNothing.foo));
		assert.deepPropertyVal(objOfNothing, "foo", nothing());
		
		assert.isObject(objOfJust);
		assert.property(objOfJust, "foo");
		assert.isTrue(isJust(objOfJust.foo));
		assert.deepPropertyVal(objOfJust, "foo", just("bar"));
	});
});
