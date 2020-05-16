import { identity, o } from 'ramda';
import chai from 'chai';
import { getOrElse, of, map, nothing, reduce } from '../src/maybe.js';

const
	assert = chai.assert,
	mFoo = of('foo'),
	mNothing = nothing(),
	mOfNothing = of(nothing()),

	// F.map(x => x, mx) ≡ mx
	assertIdentityLaw = (m, desc) => {
		assert.deepStrictEqual(map(identity, m), m, desc);
	},
	
	// F.map(x => f(g(x)), mx) ≡ F.map(f, F.map(g, mx))
	assertCompositionLaw = (m, f, g, desc) => {
		assert.deepStrictEqual(map(o(f, g), m), o(map(f), map(g))(m), desc);
	},
	
	// F.reduce ≡ (f, y, mx) => F.reduce((acc, x) => acc.concat([x]), [], mx).reduce(f, y)
	assertReduceLaw = (mx, reducer, initial, desc) => {
		assert.deepStrictEqual(
			reduce(reducer, initial, mx),
			reduce((acc, x) => acc.concat([x]), [], mx).reduce(reducer, initial),
			desc
		);
	};

describe("Maybe", function() {
	
	describe("Functor", function () {
		it("obeys the identity law", () => {
			assertIdentityLaw(mFoo);
			assertIdentityLaw(mNothing);
			assertIdentityLaw(mOfNothing);
		});
		
		it("obeys composition law", function () {
			const f = s => `${s}-f`, g = s => `${s}-g`, gz = () => undefined, gn = () => [];
			assertCompositionLaw(mFoo, f, g);
			assertCompositionLaw(mFoo, g, f);
			assertCompositionLaw(mFoo, f, gz);
			assertCompositionLaw(mFoo, f, gn);
			assertCompositionLaw(mNothing, f, g);
			assertCompositionLaw(mOfNothing, f, g);
		});
	});
	
	describe("Foldable", function () {
		it("produces the value or the given default", function () {
			assertReduceLaw(mFoo, (a, b) => `(${a} and ${b})`, "initial value", "reduces just a string");
			assertReduceLaw(mNothing, (a, b) => `(${a} and ${b})`, "initial value", "reduces nothing");
		});
	});
	
	describe("API", function () {
		describe("getOrElse", function () {
			it("returns just the value", () => {
				assert.deepStrictEqual(getOrElse("unexpected default", mFoo), "foo", "gets just a string");
				assert.deepStrictEqual(getOrElse("unexpected default", of(of("foo"))), mFoo, "gets a nested just");
			});
			
			it("returns the replacement for nothing", () => {
				assert.strictEqual(getOrElse("unexpected default", mNothing), "unexpected default");
			});
		});
	});
	
});
