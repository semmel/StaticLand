import { equals, identity } from "ramda";
import { traversableMonadHandler } from "../internal/fantasyland-proxy.js";
import map from '../fantasyland/map.js';

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
}

class _Nothing extends Maybe {
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
		return other.isNothing;
	}
	
	// ----- Functor Maybe
	map(fn) {
		return this;
	}
	
	// ----- Applicative Maybe
	ap(f) {
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

class _Just extends Maybe {
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
		return other.isJust && equals(this.$value, other.$value);
	}
	
	// ----- Functor Maybe
	map(fn) {
		return Maybe.of(fn(this.$value));
	}
	
	// ----- Applicative Maybe
	ap(ffn) {
		return ffn.map(this.$value);
	}
	
	// ----- Monad Maybe
	chain(fn) {
		return this.map(fn).join();
	}
	
	join() {
		return this.$value;
	}
	
	// ----- Traversable Maybe
	sequence(of) {
		return this.traverse(of, identity);
	}
	
	traverse(of, fn) {
		return map(Maybe.of)(fn(this.$value));
	}

	reduce(f, x) {
		return f(x, this.$value);
	}
}

const
	Nothing = new Proxy(_Nothing, traversableMonadHandler),
	Just = new Proxy(_Just, traversableMonadHandler);

export {
	Maybe, Just, Nothing
};
