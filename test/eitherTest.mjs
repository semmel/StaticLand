import {equals, identity, o} from 'semmel-ramda';
import { alt, either, fromAssertedValue, join, right, left } from '../src/either.js';
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
