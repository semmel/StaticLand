import chai from 'chai';
import nth from '../../src/list/nth.js';
import {isJust, isNothing} from "../../src/maybe/inspection.js";
import {getOrElse} from "../../src/maybe.js";

const
	assert = chai.assert;

describe("List nth", function () {
	it("works for strings like Ramda", () => {
		const
			subject = 'abc',
			second = nth(1, subject),
			last = nth(-1, subject),
			impossible = nth(-99, subject);

		assert.isTrue(isJust(second), `third char is inside a just: ${second}`);
		assert.isTrue(isJust(last), `last char is inside a just: ${last}`);
		assert.isTrue(isNothing(impossible), `impossible char is inside a nothing: ${impossible}`);

		assert.strictEqual(getOrElse("_default_replacement_", second), 'b');
		assert.strictEqual(getOrElse("_default_replacement_", last), 'c');
	});

	it("works for arrays", () => {
		const
			a = "a", b = {}, c = 99,
			subject = [a, b, c],
			second = nth(1, subject),
			last = nth(-1, subject),
			impossible = nth(-99, subject);

		assert.isTrue(isJust(second), `third char is inside a just: ${second}`);
		assert.isTrue(isJust(last), `last char is inside a just: ${last}`);
		assert.isTrue(isNothing(impossible), `impossible char is inside a nothing: ${impossible}`);

		assert.equal(getOrElse("_default_replacement_", second), b);
		assert.strictEqual(getOrElse("_default_replacement_", last), c);
	});
});
