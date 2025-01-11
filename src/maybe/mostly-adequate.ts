import { equals, identity, isNil } from "ramda";
import map from '../fantasyland/map.js';
import { Next, Done } from "../internal/_iteration.js";

const
	TYPE_IDENTIFIER = "@visisoft/staticland/Maybe";

	interface ApplicativeType<M> {
    // instance methods if needed
	}

namespace ApplicativeType {
    export interface StaticMembers<M> {
        map(fn: (a: any) => any): (ma: M) => M;
    }
}

class MyApplicative implements ApplicativeType<MyApplicative> {
    static map(fn: (a: any) => any): (ma: MyApplicative) => MyApplicative {
        // implementation
        return (ma) => ma;
    }
		foo() { return true; }
}

// Type check
const checkStatic: ApplicativeType.StaticMembers<MyApplicative> = MyApplicative;

interface Maybe<A> {
	get isNothing(): boolean;
	get isJust(): boolean;

	map<B>(fn: (a: A) => B): Maybe<B>
	['fantasy-land/map']<B>(fn: (a: A) => B): Maybe<B>

	cata<B>(onNothing: () =>B, onJust: (a: A) => B): B;

}

class MaybeType implements ApplicativeType<MaybeType>{
	// ----- Pointed Maybe
	static of<X>(x: X) {
		return new Just<X>(x);
	}

	static ['fantasy-land/of']<X>(x: X) {
		return MaybeType.of(x);
	}

	static ['fantasy-land/empty']() {
		return new Nothing();
	}

	static map = <A, B>(fn: (a: A) => B) => (ma: Maybe<A>) => ma.map(fn);

	static [Symbol.hasInstance](instance) {
		return !isNil(instance) && instance['@@type'] === TYPE_IDENTIFIER;
  }

	// like monet and sanctuary
	get "@@type"() {
		return TYPE_IDENTIFIER;
	}

	// for fun
	get [Symbol.toStringTag]() {
      return "Maybe";
  }

  // https://web.archive.org/web/20230924043628/http://www.tomharding.me/2017/05/30/fantas-eel-and-specification-14/
	// :: ((a -> Maybe Step a b, b -> Maybe Step a b, a) -> Maybe Step a b, a) -> Maybe b
   static chainRec(fStep, x) {
		// :: Step a
		let step = Next(x);

		do {
			const
				// Maybe Step a
				maybeStep = fStep(Next, Done, step.value);

			//console.log(maybeStep, maybeStep.value);

			if (maybeStep.isNothing) {
				return maybeStep;    // if Nothing end with Nothing
			}

			// else continue with a Next
			// we can do this too. It however must call teh continuation immediately in the same call stack run
			//maybeStep.cata(identity, nextA => { step = nextA; });

			step = maybeStep.$value; // alternative
		}
		while(!step.isDone);

		return Maybe.of(step.value);
	}

	static ['fantasy-land/chainRec'](fStep, x) {
		return Maybe.chainRec(fStep, x);
	}
}

class Nothing implements Maybe<void> {

	static [Symbol.hasInstance](instance) {
		return instance instanceof Nothing && instance.isNothing;
  }

	constructor() {}

	get isNothing() {
		return true;
	}

	get isJust() {
		return false;
	}

	toString() {
		return "Nothing";
	}

	equals(other) {
		return other instanceof Nothing;
	}

	cata<B>(nothingFn: () => B, unused: (a: any) => any) {
		return nothingFn();
	}

	// ----- Functor Maybe
	map(fn: (a: any) => any) {
		return this;
	}

	['fantasy-land/map'](fn: (a: any) => any) {
		return this.map(fn);
	}

	// ----- Applicative Maybe
	ap(maybeWithFunction) {
		return this;
	}

	// ----- Monad Maybe
	chain(fn) {
		return this.map(fn).join();
	}

	join() {
		return this;
	}

	// ----- Traversable Maybe
	sequence({'fantasy-land/of': of}) {
		return this.traverse(of, identity);
	}

	traverse({'fantasy-land/of': of}, fn) {
		return of(this);
	}

	// Maybe#fantasy-land/reduce :: Maybe a ~> ((b, a) -> b, b) -> b
	reduce(f, x){
		return x;
	}
}

class Just<A> implements Maybe<A> {
	static [Symbol.hasInstance](instance) {
		return instance instanceof Just && instance.isJust;
  }

	private $value: A;
	constructor(a: A) {
		this.$value = a;
	}

	get isNothing() {
		return false;
	}

	get isJust() {
		return true;
	}

	toString() {
		return `Just(${this.$value})`;
	}

	equals(other) {
		return other instanceof Just && equals(this.$value, other.$value);
	}

	cata<B>(unused, justFn: (a: A) => B) {
		return justFn(this.$value);
	}

	// ----- Functor Maybe
	map<B>(fn: (a: A) => B) {
		return MaybeType.of(fn(this.$value));
	}

	['fantasy-land/map']<B>(fn: (a: A) => B) {
		return this.map(fn);
	}

	// same as the FL signature - so the FL wrapper can delegate to .ap
	// ap :: Apply f => f a ~> f (a->b) -> f b
	ap(maybeWithFunction) {
		return maybeWithFunction.map(fn => fn(this.$value));
	}

	// ----- Monad Maybe
	chain(fn) {
		return this.map(fn).join();
	}

	join() {
		return this.$value;
	}

	// ----- Traversable Maybe
	// :: Just f a ~> F -> f Just a
	sequence(TR: ApplicativeType.StaticMembers<A>) {
		return TR.map(MaybeType.of)(this.$value);
	}

	// :: Just a ~> F -> (a -> f b) -> f Just b
	traverse<F>(TR: ApplicativeType.StaticMembers<F>, fn: (a: A) => F) {
		return TR.map(MaybeType.of)(fn(this.$value));
	}

	reduce(f, x) {
		return f(x, this.$value);
	}
}

export {
	Maybe, Just, Nothing
};
