import { always, equals, identity, o, reverse } from 'ramda';
import chai from 'chai';
import {isRight, isLeft, right, left, traverse, either, bimap} from '../../src/either.js';

const
	assert = chai.assert;

describe("Either bimap", function () {
	it("alters a Left", () => {
		const
			result = bimap(reverse, identity)(left("foo"));

		assert.isOk(isLeft(result));
		assert.strictEqual(either(identity, always("wrong value"), result), "oof");
	});

	it("alters a Right", () => {
		const
			result = bimap(identity, reverse)(right("bar"));

		assert.isOk(isRight(result));
		assert.strictEqual(either(always("wrong value"), identity, result), "rab");
	});
});
