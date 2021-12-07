import {always, equals, identity, o} from 'semmel-ramda';
import { alt, chain, either, fromAssertedValue, join, map, of, right, left, isLeft, isRight } from '../src/either.js';
import chai from 'chai';

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

describe("Either map", function() {
	it("calls f just on the data", () => {
		assert.deepStrictEqual(map(s => s.toUpperCase(), of("foo")), of("FOO"));
		assert.deepStrictEqual(map(xs => xs.join(), of([8, 9])), of("8,9"));
	});
});

describe("Either Chain", function() {
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
	
	it("executes the function on the data in a right", () => {
		assert.deepStrictEqual(chain(always(of("foo")), right(undefined)), of("foo"));
		assert.deepStrictEqual(chain(always(of("bar")), right([])), of("bar"));
		assert.strictEqual(eitherBazOrRight(chain(x => of(x + "-bar"), of("foo"))), eitherBazOrRight(of("foo-bar")));
		assert.deepStrictEqual(chain(xs => of(xs.map(x => x + 1)), of([8, 9])), of([9,10]));
	});
	
	it("goes from right to left", () => {
		const
			chained = chain(() => left("oops"), right("foo"));
		
		assert.isOk(isLeft(chained));
		assert.strictEqual(eitherBazOrLeft(chained), "oops");
	});
	
	it("does not execute on left", () => {
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
