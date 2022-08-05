import { equals as deepEquals, identity } from "ramda";

class Either {
	constructor(x) {
		this.$value = x;
	}
	
	// ----- Pointed (Either a)
	static of(x) {
		return new Right(x);
	}
	
	['fantasy-land/of'](x) {
		return Either.of(x);
	}
}

class Left extends Either {
	get isLeft() {
		return true;
	}
	
	get isRight() {
		return false;
	}
	
	static of(x) {
		throw new Error('`of` called on class Left (value) instead of Either (type)');
	}
	
	// [util.inspect.custom]() {
	// 	return `Left(${inspect(this.$value)})`;
	// }
	
	// ----- Functor (Either a)
	map() {
		return this;
	}
	
	['fantasy-land/map'](fn) {
		return this.map(fn);
	}
	
	// ----- Applicative (Either a)
	ap() {
		return this;
	}
	
	// ----- Monad (Either a)
	chain() {
		return this;
	}
	
	['fantasy-land/chain'](fn) {
		return this.chain(fn);
	}
	
	join() {
		return this;
	}
	
	equals(other) {
		return other instanceof Either && other.isLeft && deepEquals(this.$value, other.$value);
	}
	
	['fantasy-land/equals'](other) {
		return this.equals(other);
	}
	
	// ----- Traversable (Either a)
	sequence(of) {
		return of(this);
	}
	
	traverse(of, fn) {
		return of(this);
	}
}

class Right extends Either {
	get isLeft() {
		return false;
	}
	
	get isRight() {
		return true;
	}
	
	static of(x) {
		throw new Error('`of` called on class Right (value) instead of Either (type)');
	}
	
	// [util.inspect.custom]() {
	// 	return `Right(${inspect(this.$value)})`;
	// }
	
	// ----- Functor (Either a)
	map(fn) {
		return Either.of(fn(this.$value));
	}
	
	['fantasy-land/map'](fn) {
		return this.map(fn);
	}
	
	// ----- Applicative (Either a)
	ap(f) {
		return f.map(this.$value);
	}
	
	// ----- Monad (Either a)
	chain(fn) {
		return fn(this.$value);
	}
	
	['fantasy-land/chain'](fn) {
		return this.chain(fn);
	}
	
	join() {
		return this.$value instanceof Either
			? this.$value
			: this;
	}
	
	equals(other) {
		return other instanceof Either && other.isRight && deepEquals(this.$value, other.$value);
	}
	
	['fantasy-land/equals'](other) {
		return this.equals(other);
	}
	
	// ----- Traversable (Either a)
	sequence(of) {
		return this.traverse(of, identity);
	}
	
	traverse(of, fn) {
		return fn(this.$value).map(Either.of);
	}
}

export {
	Either, Left, Right
};
