import { always, chain, curry, equals, find, identity, map, o, pluck, lift as liftR, reduce } from 'ramda';
import chai from 'chai';
import {
	equals as equals_mb, fromNilable, getOrElse, of, isNothing, isJust,
	just, join, nothing, maybe, lift, liftA2
} from '../src/maybe.js';

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
	const
		justNumber = of(8),
		justUndefined = of(undefined),
		justEmptyArray = of([]),
		aRecordStructure = { foo: "bar", inner: { items: [] } },
		justRecord = of(Object.assign({}, aRecordStructure));

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

	describe("map", function() {
		it("calls f just on the data", () => {
			assert.deepStrictEqual(map(s => s.toUpperCase(), of("foo")), of("FOO"));
			assert.deepStrictEqual(map(xs => xs.join(), of([8, 9])), of("8,9"));
		});
	});

	describe("Chain", function() {
		it("ignores nothing", () => {
			assert.isTrue(isNothing(chain(
				() => { assert.fail("chain function must not be invoked on nothing"); },
				nothing()
			)));
		});

		it("executes the function on the data in a just", () => {
			assert.deepStrictEqual(chain(always(of("foo")), justUndefined), of("foo"));
			assert.deepStrictEqual(chain(always(of("bar")), justEmptyArray), of("bar"));
			assert.isTrue(equals_mb(chain(x => of(x + "-bar"), of("foo")), of("foo-bar")));
			assert.deepStrictEqual(chain(xs => of(xs.map(x => x + 1)), of([8, 9])), of([9,10]));
		});

	});

	describe("join", function() {
		it("forwards nothing", () => {
			assert.isTrue(isNothing(join(nothing())));
		});

		it("returns the inner maybe or forwards the maybe", () => {
			const
				inner = of("bar"),
				nested = of(inner),
				flattened = join(nested);

			assert.isTrue(isJust(flattened), "flattened is a just");
			assert.deepEqual(flattened, inner);

			// I don't know what the reason is to support join on un-nested Maybes
			//assert.isTrue(isJust(join(inner)), "a just remains a just");
			//assert.deepEqual(join(inner), inner, "forwarding a just");
		});

		it.skip("treats two-or-more element array value not as nested maybe", () => {
			const
				mxs = of([8, 9]),
				flattened_mxs = join(mxs);
			// I don't know what the reason is to support join on un-nested Maybes
			//assert.deepStrictEqual(flattened_mxs, mxs);
		});

		it("returns nothing from just nothing", () => {
			const
				flattened = join(of(nothing()));

			assert.isTrue(isNothing(flattened));
		});
	});

	describe("Creation" ,function() {
		describe("fromNilable", function() {
			it("creates a nothing from undefined", () => {
				assert.deepStrictEqual(o(fromNilable, find(x => x === "bar"))(["foo"]), nothing());
			});

			it("creates a just from a string", () => {
				assert.deepStrictEqual(o(fromNilable, find(x => x === "bar"))(["foo", "bar"]), of("bar"));
			});
		});
	});

	describe("Inspection", function() {
		it("identifies Nothing", () => {
			const aNothing = nothing();
			assert.isTrue(isNothing(aNothing));
			assert.isFalse(isJust(aNothing));
		});

		it("identifies Justs", () => {
			assert.isTrue(isJust(justNumber));
			assert.isTrue(isJust(justUndefined));
			assert.isTrue(isJust(justEmptyArray));

			assert.isFalse(isNothing(justNumber));
			assert.isFalse(isNothing(justUndefined));
			assert.isFalse(isNothing(justEmptyArray));
		});

		it("determines the equality", () => {
			assert.isTrue(equals_mb(nothing(), nothing()));
			assert.isFalse(equals_mb(nothing(), of(8)));
			assert.isTrue(equals_mb(justRecord, of(Object.assign({}, aRecordStructure))));
		});

		it("returns false for various non Maybe values", () => {
			assert.isFalse(isNothing(null));
			assert.isFalse(isJust(null));
			assert.isFalse(isNothing(undefined));
			assert.isFalse(isJust(undefined));
			assert.isFalse(isNothing(""));
			assert.isFalse(isJust(""));
			assert.isFalse(isNothing({}));
			assert.isFalse(isJust({}));
		});
	});

	describe("Consumption", function () {
		describe("getOrElse", function () {
			it("returns just the value", () => {
				assert.deepStrictEqual(getOrElse("unexpected default", mFoo), "foo", "gets just a string");
				assert.deepStrictEqual(getOrElse(of("unexpected default"), of(of("foo"))), mFoo, "gets a nested just");
			});

			it("returns the replacement for nothing", () => {
				assert.strictEqual(getOrElse("unexpected default", mNothing), "unexpected default");
			});
		});

		describe("maybe", function() {
			it("invokes the first function and returns its result in case of a nothing", function () {
				assert.strictEqual(
					maybe(
						() => "bar anything",
						() => { assert.fail("2nd function should not be called with ${x}"); },
						nothing()
					),
					"bar anything"
				);
			});

			it(
				"calls the second function with the value inside the maybe and returns its result in case of a just",
				() => {
					assert.strictEqual(
						maybe(
							() => { assert.fail("1st maybe function should not have been called"); },
							x => x + "bar",
							of("foo")
						),
						"foobar"
					);
				}
			);
		});
	});

	describe("Lifting", function() {
		function add3(a, b, c){
			return a + b + c;
		}

		const
			/** @type {(a: import('../src/maybe').Maybe<number>, b: import('../src/maybe').Maybe<number>, c: import('../src/maybe').Maybe<number>) => import('../src/maybe').Maybe<number>} */
			lifted_add3 = lift(add3);

		it("returns a function with the same arity", () => {
			assert.isFunction(lifted_add3);
			assert.lengthOf(lifted_add3, 3);
		});

		it("returns a nothing if invoked with any nothing argument", () => {
			assert.isTrue(isNothing(lifted_add3(of(1), of(20), nothing())));
		});

		it("lifts ternary un-curried functions", () => {
			assert.strictEqual(
				getOrElse(42, lifted_add3(of(1), of(20), of(300))),
				321
			);
		});

		it("lifts ternary auto-curried functions", () => {
			assert.isTrue(
				equals(
					liftR(curry(add3))(of(300), of(20), of(1)),
					of(321)
				),
				"lifted function did not return the expected value 321"
			);
		});
	});

	describe("liftA2", function() {
		const
			concatStrings = a => b => `${a}${b}`,
			maybeConcatMaybeStrings = liftA2(concatStrings);

		it ("returns a nothing if invoked with any nothing argument", () => {
			assert.isTrue(isNothing(maybeConcatMaybeStrings(of("foo"), nothing())));
		});

		it("returns the Maybe of the return value of the function called with both just values", () => {
			assert.deepStrictEqual(maybeConcatMaybeStrings(of("foo"), of("bar")), of("foobar"));
		});
	});

	describe("pluck", function() {
		it("extracts from Records", () => {
			const
				justARecord = just({foo: "FOO", bar: "BAR", baz: "BAZ"});

			assert.strictEqual(getOrElse("Unexpected value", pluck("foo", justARecord)), "FOO");
			assert.ok(isNothing(pluck("foo", nothing())));
		});

		it("extracts from Arrays", () => {
			const
				justAList = just(["foo", "bar", "baz"]);

			assert.strictEqual(getOrElse("Unexpected value", pluck(0, justAList)), "foo");
		});
	});

});
