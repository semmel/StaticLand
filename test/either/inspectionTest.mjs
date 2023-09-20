import { equals, identity, o } from 'ramda';
import chai from 'chai';
import { isEither, isLeft, isRight, left, right } from "../../src/either.js";

const
	assert = chai.assert;

describe("either inspection", function () {
	it("returns false for various non Either values", () => {
		assert.isFalse(isEither(null));
		assert.isFalse(isLeft(null));
		assert.isFalse(isRight(null));
		assert.isFalse(isEither(undefined));
		assert.isFalse(isLeft(undefined));
		assert.isFalse(isRight(undefined));
		assert.isFalse(isEither(""));
		assert.isFalse(isLeft(""));
		assert.isFalse(isRight(""));
		assert.isFalse(isEither({}));
		assert.isFalse(isLeft({}));
		assert.isFalse(isRight({}));
	});

	it("identifies Lefts and Rights", () => {
		const
			rFoo = right("foo"),
			lBar = left("bar");

		assert.isTrue(isEither(rFoo));
		assert.isTrue(isEither(lBar));
		assert.isTrue(isRight(rFoo));
		assert.isTrue(isLeft(lBar));
		assert.isFalse(isRight(lBar));
		assert.isFalse(isLeft(rFoo));
	});
});
