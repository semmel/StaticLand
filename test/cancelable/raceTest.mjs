import {equals, identity, o} from 'ramda';
import chai from 'chai';
import { later, of, laterReject, race, reject, bi_tap } from "../../src/cancelable.js";
import assertCancellationDiscontinues from "./helpers/assertCancellationDiscontinues.mjs";
import { assertCorrectInterface } from "../helpers/types.mjs";

const
	assert = chai.assert;

describe("cancelable race", function () {
	it("propagates the first outcome from any of the two computations", () => Promise.all([
		new Promise(race(of("foo"), later(10, "bar"))).then(x => {assert.strictEqual(x, "foo");}),
		new Promise(race(later(10, "foo"), of("bar"))).then(x => {assert.strictEqual(x, "bar");}),
		new Promise(race(reject("foo"), later(10, "bar"))).catch(x => { assert.strictEqual(x, "foo"); }),
		new Promise(race(reject("foo"), laterReject(20, "bar"))).catch(x => { assert.strictEqual(x, "foo"); }),
	]));
	
	it("propagates the first outcome from any of two time-taking computations", () => Promise.all([
		new Promise(race(later(50, "late foo"), later(10, "early bar"))).then(x => {assert.strictEqual(x, "early bar");}),
		new Promise(race(later(10, "early foo"), later(50, "late bar"))).then(x => {assert.strictEqual(x, "early foo");}),
		new Promise(race(later(10, "early foo"), laterReject(50, "late qux"))).then(x => {assert.strictEqual(x, "early foo");}),
		new Promise(race(later(50, "late foo"), laterReject(10, "early qux")))
		.then(
			res => { assert.fail(`Should not succeed with ${res}`); },
			x => { assert.strictEqual(x, "early qux"); }
		),
		new Promise(race(laterReject(50, "late tux"), laterReject(10, "early tux")))
		.then(
			res => { assert.fail(`Should not succeed with ${res}`); },
			x => { assert.strictEqual(x, "early tux"); }
		),
		new Promise(race(laterReject(10, "early baz"), laterReject(50, "late baz")))
		.then(
			res => { assert.fail(`Should not succeed with ${res}`); },
			x => { assert.strictEqual(x, "early baz"); }
		)
	]));
	
	let isCancelledFoo = false;
	let isCancelledBar = false;
	
	const
		foo40 = (res, rej) => {
			const timer = setTimeout(res, 40, "foo");
			return () => {
				clearTimeout(timer);
				isCancelledFoo = true;
			};
		},
		
		baz60 = (res, rej) => {
			const timer = setTimeout(res, 60, "baz");
			return () => {
				clearTimeout(timer);
				isCancelledBar = true;
			};
		};
	
	beforeEach(function() {
		isCancelledFoo = false;
		isCancelledBar = false;
	});
	
	it("cancels the defeated computations", () => Promise.all([
		new Promise(race(of("bar"), foo40))
		.then(x => {assert.strictEqual(x, "bar");})
		.finally(() => { assert.isTrue(isCancelledFoo); }),
		
		new Promise(race(reject("doo"), baz60))
		.then(
			x => { assert.fail(`Unexpected success ${x}`); },
			e => { assert.strictEqual(e, "doo"); }
		)
		.finally(() => { assert.isTrue(isCancelledBar); })
	]));
	
	it("cancels both long-running computations", () =>
		assertCancellationDiscontinues({
			assert,
			cancelable: race(foo40, baz60),
			delay: 20
		})
		.finally(() => {
			assert.isTrue(isCancelledBar, "bar's cancel function must have been called");
			assert.isTrue(isCancelledFoo, "foo's cancel function must have been called");
		})
	);
	
	it("returns a FL monad", () => {
		assertCorrectInterface("monad")(race(of("foo"), of("foo")));
	});
});
