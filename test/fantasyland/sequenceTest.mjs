import { always, equals, identity, map, o, range } from 'ramda';
import chai from 'chai';
import { sequence } from "../../src/fantasyland.js";
import { getOrElse, just, isJust, Maybe, nothing, isNothing, Nothing, Just } from "../../src/maybe.js";
import { Either, Right, Left, right, isRight, either, left, isLeft } from "../../src/either.js";
import { later as later_p, TypeRepresentative as PromiseType } from "../../src/promise.js";
import hirestime from "../helpers/hirestime.mjs";

const
	assert = chai.assert,
	now = hirestime(),
	
	/** @type {<T>(delay: number, t:T) => Promise<T>} */
	laterFail = (dt, value) => new Promise((_, reject) => setTimeout(reject, dt, value));

describe("fantasyland/sequence", function () {
	describe("list traversable", function() {
		this.slow(200);
		
		it("swaps list of Justs into Just a list", () => {
			const
				items = range(0, 10),
				listOfJusts = map(just, items),
				justOfList = sequence(Maybe, listOfJusts);
			
			assert.isTrue(isJust(justOfList));
			assert.deepStrictEqual(getOrElse(["stupid"], justOfList), items);
		});
		
		it("transforms a List with a Nothing into a Nothing", () => {
			const
				maybeOfList = sequence(Maybe, [just("foo"), nothing(), just("bar")]);
			
			assert.isTrue(isNothing(maybeOfList));
		});
		
		it ("resolves with an array of successes", () => {
			const
				allPromises = sequence(
					PromiseType,
					[
						later_p(50, "foo"),
						Promise.resolve("bar"),
						later_p(75, "baz")
					]
				),
				beginTS = now();
			
			assert.instanceOf(allPromises, Promise);
			return allPromises
			.then(xs => {
				assert.approximately(now() - beginTS, 75, 20);
				assert.instanceOf(xs, Array);
				assert.deepStrictEqual(xs, ["foo", "bar", "baz"]);
			});
		});
		
		it ("fails with the first failure", () => {
			const
				allPromises = sequence(
					PromiseType,
					[
						later_p(100, "foo"),
						laterFail(25, "qux"),
						laterFail(75, "faz")
					]
				),
				beginTS = now();
			
			assert.instanceOf(allPromises, Promise);
			return allPromises
			.then(
				val => { assert.fail(`Unexpected success with ${val}`); },
				error => {
					assert.approximately(now() - beginTS, 25, 10);
					assert.strictEqual(error, "qux");
				}
			);
		});
		
		it.skip("swaps a List of Cancelables into a Cancelable of a List", function() {
		});
	});
	
	describe("Maybe/Either traversable", function () {
		it("swaps types in a Maybe of Either and vice versa", () => {
			const
				justRight = new Just(new Right('foo')),
				rightJust = new Right(new Just('foo')),
				theLeft = new Left('X'),
				justTheLeft = new Just(theLeft),
				rightNothing = new Right(new Nothing());
			
			assert.isTrue(
				equals(sequence(Either, justRight), rightJust),
				`${sequence(Either, justRight)} != ${rightJust}`
			);
			
			assert.isTrue(
				equals(sequence(Maybe, rightJust), justRight),
				`${sequence(Maybe, rightJust)} != ${justRight}`
			);
			
			assert.isTrue(
				equals(sequence(Either, justTheLeft), theLeft),
				`${sequence(Either, justTheLeft)} != ${theLeft}`
			);
			
			assert.isTrue(
				equals(sequence(Maybe, theLeft), justTheLeft),
				`${sequence(Maybe, theLeft)} != ${justTheLeft}`
			);
			
			assert.isTrue(
				equals(sequence(Either, new Nothing()), rightNothing),
				`${sequence(Either, new Nothing())} != ${rightNothing}`
			);
			
			assert.isTrue(
				equals(sequence(Maybe, rightNothing), new Nothing()),
				`${sequence(Either, rightNothing)} != ${new Nothing()}`
			);
		});
		
		it ("swaps a Right of a resolved Promise", () => {
			const
				rja = sequence(PromiseType)(right(Promise.resolve("foo")));
			
			assert.instanceOf(rja, Promise);
			
			return rja
			.then(ja => {
				assert.isTrue(isRight(ja));
				assert.strictEqual(either(always("UNEXPECTED_FILL_IN"), identity, ja), "foo");
			});
		});
		
		it ("swaps into a Right of a failing Promise into a failing Promise", () => {
			const
				fja = sequence(PromiseType)(right(Promise.reject("bar")));
			
			assert.instanceOf(fja, Promise);
			
			return fja
			.then(
				val => {
					assert.fail(`Unexpected success (${val})`);
				},
				e => {
					//assert.isTrue(isJust(e));
					assert.strictEqual(e, "bar");
				}
			);
		});
		
		it ("turns a Left into a Promise of a Left", () => {
			const
				theError = new Error("THE_TEST_ERROR_MESSAGE"),
				fn = sequence(PromiseType)(left(theError));
			
			assert.instanceOf(fn, Promise);
			
			return fn
			.then(x => {
				assert.isTrue(isLeft(x));
				assert.strictEqual(either(identity, always(new Error("UNEXPECTED_FILL_IN")), x), theError);
			});
		});
	});
	
	
});
