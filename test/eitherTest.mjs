import {equals, identity, o} from 'semmel-ramda';
import { either, join, right, left } from '../src/either.js';
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