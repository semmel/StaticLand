import { equals as deepEquals, identity } from "ramda";
import { traversableMonadHandler } from "../internal/fantasyland-proxy.js";
import map from '../fantasyland/map.js';

class Either {
	constructor(x) {
		this.$value = x;
	}
	
	// ----- Pointed (Either a)
	static of(x) {
		return new Right(x);
	}
	
	static ['fantasy-land/of'](x) {
		return Either.of(x);
	}
}

class _Left extends Either {
	get isLeft() {
		return true;
	}
	
	get isRight() {
		return false;
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

class _Right extends Either {
	get isLeft() {
		return false;
	}
	
	get isRight() {
		return true;
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
	ap(ffn) {
		//ap(mf, ma) = chain(f => map(f, ma), mf)
		return ffn.map(fn => fn(this.$value));
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

const
	Left = new Proxy(_Left, traversableMonadHandler),
	Right = new Proxy(_Right, traversableMonadHandler);

export {
	Either, Left, Right
};
