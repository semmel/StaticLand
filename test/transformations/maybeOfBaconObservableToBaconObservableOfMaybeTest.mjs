import chai from 'chai';
import * as Bacon from "baconjs";
import {just, nothing} from "../../src/maybe.js";
import {maybeOfBaconObservableToBaconObservableOfMaybe} from "../../src/transformations.js";
import {append, flip, map} from 'ramda';

const
	assert = chai.assert;

describe("transformation maybeOfBaconObservableToBaconObservableOfMaybe", function () {
	it("creates an EventStream of all values wrapped in justs", () => {
		const
			sequence = ["foo", [], 42],
			streamOfMaybes =
				maybeOfBaconObservableToBaconObservableOfMaybe(just(Bacon.fromArray(sequence)));
		
		assert.instanceOf(streamOfMaybes, Bacon.EventStream);
		
		return streamOfMaybes
		.scan([], flip(append))
		.toPromise()
		.then(acc => {
			assert.deepStrictEqual(acc, map(just, sequence));
		});
	});
	
	it ("creates an EventStream from Just a Property", () => {
		const streamOfIt = maybeOfBaconObservableToBaconObservableOfMaybe(just(Bacon.constant("foo")));
		
		assert.instanceOf(streamOfIt, Bacon.EventStream);
		
		return streamOfIt
		.toPromise()
		.then(x => { assert.deepStrictEqual(x, just("foo")); });
	});
	
	it ("creates an EventStream of a single Nothing from a Nothing", () => {
		const streamOfMaybes =
			maybeOfBaconObservableToBaconObservableOfMaybe(nothing());
		
		assert.instanceOf(streamOfMaybes, Bacon.EventStream);
		
		return streamOfMaybes
		.scan([], flip(append))
		.toPromise()
		.then(acc => {
			assert.deepStrictEqual(acc, [nothing()]);
		});
	});
});
