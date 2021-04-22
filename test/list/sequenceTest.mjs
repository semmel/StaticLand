import chai from 'chai';
import {of as of_mb, liftA2 as liftA2_mb, isNothing, isJust, just, getOrElse, nothing} from '../../src/maybe.js';
import {sequence} from '../../src/list.js';
import {map, range} from 'semmel-ramda';

const
	assert = chai.assert;

describe("List sequence", function () {
	describe("swaps List of Maybes into Maybe of List", function() {
		const
			listOfMaybesToMaybeOfList = sequence(of_mb, liftA2_mb);
		
		it("swaps a List of Justs", () => {
			const
				items = range(0, 10),
				listOfJusts = map(just, items),
				justOfList = listOfMaybesToMaybeOfList(listOfJusts);
			
			assert.isTrue(isJust(justOfList));
			assert.deepStrictEqual(getOrElse(["stupid"], justOfList), items);
		});
		
		it("transforms a List with a Nothing into a Nothing", () => {
			const
				maybeOfList = listOfMaybesToMaybeOfList([just("foo"), nothing(), just("bar")]);
			
			assert.isTrue(isNothing(maybeOfList));
		});
	});
});
