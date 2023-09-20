import { equals, identity, isNil } from "ramda";
import map from '../fantasyland/map.js';

const
	TYPE_IDENTIFIER = "@visisoft/staticland/Maybe";

class Maybe {
	constructor(x) {
		this.$value = x;
	}

	// ----- Pointed Maybe
	static of(x) {
		return new Just(x);
	}

	static ['fantasy-land/of'](x) {
		return Maybe.of(x);
	}

	static ['fantasy-land/empty']() {
		return new Nothing();
	}

	static [Symbol.hasInstance](instance) {
		return !isNil(instance) && instance['@@type'] === TYPE_IDENTIFIER;
  }

	["fantasy-land/map"](fn) {
		return this.map(fn);
	}

	["fantasy-land/chain"](fn) {
		return this.chain(fn);
	}

	["fantasy-land/ap"](f_fn) {
		return this.ap(f_fn);
	}

	['fantasy-land/equals'](other) {
		return this.equals(other);
	}

	["fantasy-land/traverse"](F, fn) {
		return this.traverse(F, fn);
	}

	['fantasy-land/reduce'](fn, a) {
		return this.reduce(fn, a);
	}

	// like monet and sanctuary
	get "@@type"() {
		return TYPE_IDENTIFIER;
	}

	// for fun
	get [Symbol.toStringTag]() {
      return "Maybe";
  }
}

class Nothing extends Maybe {

	static [Symbol.hasInstance](instance) {
		return instance instanceof Maybe && instance.isNothing;
  }

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

	cata(nothingFn, unused) {
		return nothingFn();
	}

	// ----- Functor Maybe
	map(fn) {
		return this;
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

class Just extends Maybe {
	static [Symbol.hasInstance](instance) {
		return instance instanceof Maybe && instance.isJust;
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

	cata(unused, justFn) {
		return justFn(this.$value);
	}

	// ----- Functor Maybe
	map(fn) {
		return Maybe.of(fn(this.$value));
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
	sequence({'fantasy-land/of': of}) {
		return this.traverse(of, identity);
	}

	traverse({'fantasy-land/of': of}, fn) {
		return map(Maybe.of)(fn(this.$value));
	}

	reduce(f, x) {
		return f(x, this.$value);
	}
}

export {
	Maybe, Just, Nothing
};
