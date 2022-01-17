import {equals, identity, objOf, map, modify} from 'ramda';
import chai from 'chai';
import {isNothing, isJust, just, nothing, sequence, getOrElse} from '../../src/maybe.js';
import {of as of_p, map as map_p} from '../../src/promise.js';

const
	assert = chai.assert;

describe("Maybe sequence", function () {
	describe("swaps a Maybe of a Promise into a Promise of a Maybe", function() {
		const
			maybeOfPromiseToPromiseOfMaybe = sequence(of_p, map_p);
		
		it ("swaps a Just of a resolved Promise", () => {
			const
				rja = maybeOfPromiseToPromiseOfMaybe(just(Promise.resolve("foo")));
			
			assert.instanceOf(rja, Promise);
			
			return rja
			.then(ja => {
				assert.isTrue(isJust(ja));
				assert.strictEqual(getOrElse("UNEXPECTED_FILL_IN", ja), "foo");
			});
		});
		
		it ("swaps into a Just of a failing Promise into a failing Promise", () => {
			const
				fja = maybeOfPromiseToPromiseOfMaybe(just(Promise.reject("bar")));
			
			assert.instanceOf(fja, Promise);
			
			return fja
			.then(
				val => {
					assert.fail(`Unexpected success (${val})`);
				},
				e => {
					//assert.isTrue(isJust(e));
					assert.strictEqual(e, "bar");
				}
			);
		});
		
		it ("turns a Nothing into a Promise of a Nothing", () => {
			const
				fn = maybeOfPromiseToPromiseOfMaybe(nothing());
			
			assert.instanceOf(fn, Promise);
			
			return fn
			.then(x => {
				assert.isTrue(isNothing(x));
			});
		});
	});

	it("works with Object Applicative", () => {
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
