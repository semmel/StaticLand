import {always, equals, identity, o} from 'ramda';
import { alt, chain, chainLeft, either, fromAssertedValue, join, map, of, right, left, isLeft, isRight } from '../src/either.js';
import chai from 'chai';
import { nothing, just, isNothing, isJust } from "../src/maybe.js";

const
	assert = chai.assert;

describe("Either join", function () {
	it("collapses to the right Either", () => {
		either(
			e => assert.fail(`Should not be a left ${e}`),
			x => assert.strictEqual(x, "foo"),
			join(right(right("foo")))
		);
		
		either(
			e => assert.strictEqual(e, "bar"),
			x => assert.fail(`Should not be a right '${x}'`),
			join(right(left("bar")))
		);
	});
	
	it("tolerates unnested Eithers", () => {
		either(
			e => assert.fail(`Should not be a left ${e}`),
			x => assert.strictEqual(x, "foo"),
			join(right("foo"))
		);
		
		either(
			e => assert.strictEqual(e, "bar"),
			x => assert.fail(`Should not be a right '${x}'`),
			join(left("bar"))
		);
	});
});

describe("Either either", function() {
	const
		/**
		 * @type {<A>(ma: import('../src/either').Either<A>) => import('../src/maybe').Maybe<A>} */
		eitherToMaybe = either(nothing, just);
	
	it("converts to Maybe", () => {
		assert.ok(isJust(eitherToMaybe(right("foo"))));
		assert.ok(isJust(either(nothing, just, right("foo"))));
		assert.ok(isNothing(eitherToMaybe(left("bar"))));
		assert.ok(isNothing(either(nothing, just, left("bar"))));
	});
});

describe("Either map", function() {
	it("calls f just on the data", () => {
		assert.deepStrictEqual(map(s => s.toUpperCase(), of("foo")), of("FOO"));
		assert.deepStrictEqual(map(xs => xs.join(), of([8, 9])), of("8,9"));
	});
});

describe("Either Chain/ChainLeft", function() {
	it("ignores left", () => {
		assert.isTrue(isLeft(
			chain(
				() => { assert.fail("chain function must not be invoked on nothing"); },
				left("qux")
			)
		));
	});
	
	const
		eitherBazOrRight = either(() => "baz", identity),
		eitherBazOrLeft = either(identity, () => "baz");
	
	it("chain executes the function on the data in a right", () => {
		assert.deepStrictEqual(chain(always(of("foo")), right(undefined)), of("foo"));
		assert.deepStrictEqual(chain(always(of("bar")), right([])), of("bar"));
		assert.strictEqual(eitherBazOrRight(chain(x => of(x + "-bar"), of("foo"))), eitherBazOrRight(of("foo-bar")));
		assert.deepStrictEqual(chain(xs => of(xs.map(x => x + 1)), of([8, 9])), of([9,10]));
	});
	
	it("chainLeft executes the function on the data in a left", () => {
		assert.deepStrictEqual(chainLeft(always(left("foo")), left(undefined)), left("foo"));
		assert.deepStrictEqual(chainLeft(always(left("bar")), left([])), left("bar"));
		assert.strictEqual(eitherBazOrLeft(chainLeft(x => left(x + "-bar"), left("foo"))), eitherBazOrLeft(left("foo-bar")));
		assert.deepStrictEqual(chainLeft(xs => left(xs.map(x => x + 1)), left([8, 9])), left([9,10]));
	});
	
	it("chain goes from right to left", () => {
		const
			chained = chain(() => left("oops"), right("foo"));
		
		assert.isOk(isLeft(chained));
		assert.strictEqual(eitherBazOrLeft(chained), "oops");
	});
	
	it("chainLeft goes from left to right", () => {
		const
			chained = chainLeft(() => right("oops"), left("foo"));
		
		assert.isOk(isRight(chained));
		assert.strictEqual(eitherBazOrRight(chained), "oops");
	});
	
	it("chain does not execute on left", () => {
		let isTouched = false;
		const
			touch = () => {
				isTouched = true;
				return left("unexpected");
			},
			leftChain = chain(touch, left("qux")),
			leftChainChain = chain(touch, leftChain);
		
		assert.isOk(isLeft(leftChain));
		assert.strictEqual(eitherBazOrLeft(leftChain), "qux");
		assert.isOk(isLeft(leftChainChain));
		assert.strictEqual(eitherBazOrLeft(leftChainChain), "qux");
		assert.isFalse(isTouched);
	});
	
	it("chainLeft does not execute on right", () => {
		let isTouched = false;
		const
			touch = () => {
				isTouched = true;
				return left("unexpected");
			},
			rightChain = chainLeft(touch, right("qux")),
			rightChainChain = chainLeft(touch, rightChain);
		
		assert.isOk(isRight(rightChain));
		assert.strictEqual(eitherBazOrRight(rightChain), "qux");
		assert.isOk(isRight(rightChainChain));
		assert.strictEqual(eitherBazOrRight(rightChainChain), "qux");
		assert.isFalse(isTouched);
	});
});

describe("Either alt", function() {
	it("returns the first right", () => {
		either(
			e => assert.fail(`Should not be a left of ${e}`),
			a => assert.strictEqual(a, "bar"),
			alt(right("bar"), right("foo"))
		);
		
		either(
			e => assert.fail(`Should not be a left of ${e}`),
			a => assert.strictEqual(a, "foo"),
			alt(left("baz"), right("foo"))
		);
	});
	
	it("returns the last left", () => {
		either(
			e => assert.strictEqual(e, "fop"),
			a => assert.fail(`Should not be a right of ${a}`),
			alt(left("baz"), left("fop"))
		);
	});
});

describe("Either fromAssertedValue", function () {
	it("returns a right if the predicate passes", () => {
		either(
			e => assert.fail(`Should not be a left of ${e}`),
			a => assert.deepEqual(a, {foo: "FOO"}),
			fromAssertedValue(obj => Boolean(obj.foo), () => "baz", {foo: "FOO"})
		);
	});
	
	it("returns a left with the function result if the predicate fails", () => {
		either(
			e => assert.strictEqual(e, "FOOBAR"),
			a => assert.fail(`Should not be a right of ${a}`),
			fromAssertedValue(obj => Boolean(obj.foo), obj => `FOO${obj.bar}`, {bar: "BAR"})
		);
	});
});

describe("Either equals", function() {
	const
		unicorn = {};
	
	it("compares simple plain and reference values", () => {
		assert.isTrue(equals(left(unicorn), left(unicorn)));
		assert.isTrue(equals(right(unicorn), right(unicorn)));
		assert.isFalse(equals(right(unicorn), left(unicorn)));
	});
	
	it("compares nested Maybes", () => {
		assert.isTrue(equals(right(nothing()), right(nothing())));
		assert.isTrue(equals(right(just("foo")), right(just("foo"))));
		assert.isFalse(equals(right(just("foo")), left(just("foo"))));
		assert.isFalse(equals(right(just("foo")), right(just("bar"))));
		assert.isFalse(equals(right(just("foo")), right(nothing())));
		assert.isTrue(equals(right(just(unicorn)), right(just(unicorn))));
	});
});
