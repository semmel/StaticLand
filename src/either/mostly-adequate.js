import { equals as deepEquals, identity } from "ramda";
import map from '../fantasyland/map.js';

const
	TYPE_IDENTIFIER = "@visisoft/staticland/Either";

class Either {
	constructor(x) {
		this.$value = x;
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
      return "Either";
  }

	// ----- Pointed (Either a)
	static of(x) {
		return new Right(x);
	}

	static ['fantasy-land/of'](x) {
		return Either.of(x);
	}

	static [Symbol.hasInstance](instance) {
		return instance['@@type'] === TYPE_IDENTIFIER;
  }
}

class Left extends Either {
	get isLeft() {
		return true;
	}

	get isRight() {
		return false;
	}

	static [Symbol.hasInstance](instance) {
		return instance instanceof Either && instance.isLeft;
  }

	static of(x) {
		throw new Error('`of` called on class Left (value) instead of Either (type)');
	}

	toString() {
		return `Left(${this.$value})`;
	}

	// ----- Functor (Either a)
	map(fn) {
		return this;
	}

	// ----- Applicative (Either a)
	ap(ffn) {
		return this;
	}

	// ----- Monad (Either a)
	chain(fn) {
		return this;
	}

	join() {
		return this;
	}

	equals(other) {
		return other instanceof Either && other.isLeft && deepEquals(this.$value, other.$value);
	}

	// ----- Traversable (Either a)
	sequence({'fantasy-land/of': of}) {
		return of(this);
	}

	// :: Left a ~> F -> (a -> f b) -> f Left a
	traverse({'fantasy-land/of': of}, fn) {
		return of(this);
	}

	//# Either#fantasy-land/reduce :: Either a b ~> ((c, b) -> c, c) -> c
	reduce(f, x) {
		return x;
	}
}

class Right extends Either {
	get isLeft() {
		return false;
	}

	get isRight() {
		return true;
	}

	static [Symbol.hasInstance](instance) {
		return instance instanceof Either && instance.isRight;
  }

	static of(x) {
		throw new Error('`of` called on class Right (value) instead of Either (type)');
	}

	toString() {
		return `Right(${this.$value})`;
	}

	// ----- Functor (Either a)
	map(fn) {
		return Either.of(fn(this.$value));
	}

	// ----- Applicative (Either a)
	// ap :: Apply f => f a ~> f (a -> b) -> f b
	ap(eitherWithFunction) {
		return eitherWithFunction.map(fn => fn(this.$value));
	}

	// ----- Monad (Either a)
	chain(fn) {
		return fn(this.$value);
	}

	join() {
		return this.$value instanceof Either
			? this.$value
			: this;
	}

	equals(other) {
		return other instanceof Either && other.isRight && deepEquals(this.$value, other.$value);
	}

	// ----- Traversable (Either a)
	sequence({of}) {
		return this.traverse(of, identity);
	}
	// :: Right a ~> F -> (a -> f b) -> f Right b
	traverse({'fantasy-land/of': of}, fn) {
		return map(Either.of)(fn(this.$value));
	}

	reduce(f, x) {
		return f (x, this.$value);
	}
}

export {
	Either, Left, Right
};
