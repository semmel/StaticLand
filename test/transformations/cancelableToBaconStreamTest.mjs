import * as B from 'baconjs';
import chai from 'chai';
import cancelableToBaconStream from "../../src/transformations/cancelableToBaconStream.js";
import {later, of, reject} from "../../src/cancelable.js";

const
	assert = chai.assert;

describe("transformation cancelableToBaconStream", function () {
	let gotCancelled = false;
	const foo50 = (res, rej) => {
		const timer = setTimeout(res, 50, "foo");
		return () => {
			clearTimeout(timer);
			gotCancelled = true;
		};
	};
	
	beforeEach(function(){
		gotCancelled = false;
	});
	
	it("handles successful cancelables", () =>
		cancelableToBaconStream(of("foo"))
		.toPromise()
		.then(x => { assert.strictEqual(x, "foo"); })
	);
	
	it("handles failing cancelables", () =>
		cancelableToBaconStream(reject("bar"))
		.toPromise()
		.then(
			x => { assert.fail(`should not succeed with ${x}`); },
			e => { assert.strictEqual(e, "bar"); }
		)
	);
	
	it("unsubscribing from the observable cancels the Cancelable", () =>
		cancelableToBaconStream(foo50)
		.takeUntil(B.later(20, undefined))
		.mapEnd("the end is near")
		.reduce([], (acc, next) => [...acc, next])
		.toPromise()
		.then(x => {
			assert.deepStrictEqual(x, ["the end is near"]);
			assert.isTrue(gotCancelled);
		})
	);
	
	it("does not call the cancel function when the stream ends later than the cancelable", () =>
		cancelableToBaconStream(foo50)
		.takeUntil(B.later(70, undefined))
		.reduce([], (acc, next) => [...acc, next])
		.toPromise()
		.then(x => {
			assert.deepStrictEqual(x, ['foo']);
			assert.isFalse(gotCancelled, "should not try to cancel the cancelable");
		})
	);
});
