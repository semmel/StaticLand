import {isNothing, isJust, getOrElse} from '../../src/maybe.js';
import chai from 'chai';
import {find as find_l} from '../../src/list.js';

const
	assert = chai.assert;

describe("List find", function () {
	it("finds a just matching item", () => {
		const
			needle = 2,
			match = find_l(x => x === needle, [0, 1, 2, 3]);
		assert.isTrue(isJust(match));
		assert.strictEqual(getOrElse(-11234, match), needle);
	});
	
	it("finds nothing if nothing matches", () => {
		const
			needle = -99,
			match = find_l(x => x === needle, [0, 1, 2, 3]);
		assert.isTrue(isNothing(match));
	});
});
