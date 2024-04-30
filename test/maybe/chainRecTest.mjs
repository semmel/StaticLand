import { equals, identity, o } from 'ramda';
import chai from 'chai';
import { just, nothing, isJust, isNothing, getOrElse, Maybe } from '../../src/maybe.js';
import { chain } from '../../src/fantasyland.js';

const
	assert = chai.assert;

describe("Maybe.chainRec", function () {
	const
		// Test Problem
		// :: Number -> Maybe Number|Boolean
		even = n => n === 0 ? just(true) : chain(odd, just(n - 1)),
		// :: Number -> Maybe Number|Boolean
      odd = n => n === 0 ? nothing() : chain(even, just(n - 1)),

		// Rewritten as single function
		isEven = n =>
			n === 0
				? just(true)
				: n === 1
					? nothing()
					: chain(isEven, just(n - 2)),

		// Rewritten for chainRec
		isJustEven = (Next, Done, n) =>
			n === 0
				? just(Done(true))
				: n === 1
					? nothing()
					: just(Next(n - 2));

	it("the test recursion problem works", () => {
		const
			is11Odd = odd(11),
			is11Even = even(11);

		assert.ok(isNothing(is11Even), `isNothing(is11Even):${isNothing(is11Even)}`);
		assert.ok(isJust(is11Odd), `isJust(is11Odd): ${isJust(is11Odd)}`);
		assert.isTrue(getOrElse(false, is11Odd));
		assert.throws(() => even(100000), RangeError);
	});

	it("the single-function recursion problem works", () => {
		const
			is12Even = isEven(12),
			is11Even = isEven(11);

		assert.ok(isNothing(is11Even), `isNothing(is11Even):${isNothing(is11Even)}`);
		assert.ok(isJust(is12Even), `isJust(is12Even): ${isJust(is12Even)}`);
		assert.isTrue(getOrElse(false, is12Even));
		assert.throws(() => isEven(100000), RangeError);
	});

	it("works with TCO when rewritten and with chainRec", () => {
		const
			is12Even = Maybe.chainRec(isJustEven, 12),
			is11Even = Maybe.chainRec(isJustEven, 11);

		assert.ok(isJust(is12Even), `isJust(is12Even): ${isJust(is12Even)}`);
		assert.isTrue(getOrElse(false, is12Even));
		assert.ok(isNothing(is11Even), `isNothing(is11Even):${isNothing(is11Even)}`);
		assert.doesNotThrow(() => Maybe.chainRec(isJustEven, 100000));
		assert.isTrue(getOrElse(false, Maybe.chainRec(isJustEven, 100000)));
	});


});
