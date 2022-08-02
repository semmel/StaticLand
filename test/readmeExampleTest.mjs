import {chain, map} from '../src/fantasyland.js';
import {mapRej as mapRej_p} from '../src/promise.js';
import {fromThrowable} from '../src/either.js';
import {fromNilable, getOrElse} from '../src/maybe.js';
import {eitherToPromise } from "../src/transformations.js";
import { curry, pipe } from 'ramda';
import chai from 'chai';

const
	assert = chai.assert;

describe("example in Readme.md", function () {
	const
	   // :: String -> {k: String} -> Maybe String
	   getProperty = curry((property, object) => fromNilable(object[property])),
	   // :: a -> Promise any a
	   delay = x => new Promise(resolve => setTimeout(resolve, 500, x)),
	   // :: any -> Either Error String
	   safeGreet = fromThrowable(x => "Hello " + x.toString() + "!"),
	   // :: any -> Promise (Maybe String) String
	   getAnswer = pipe(
	      delay,                            // Promise any             any
	      map(safeGreet),                 // Promise any             (Either Error String)
	      chain(delay),                   // Promise any             (Either Error String)
	      chain(eitherToPromise),         // Promise (any|Error)     String
	      mapRej_p(getProperty('message'))  // Promise (Maybe String)  String
	   );
	
	this.slow(2000);
	
	it("first example call", () => {
		const begin = Date.now();
		
		return getAnswer("Earth")
		.then(x => {
			assert.strictEqual(x, "Hello Earth!");
			assert.approximately(Date.now() - begin, 1000, 100);
		});
	});
	
	it(
		"second example call",
		() => getAnswer(null)
		.then(
			x => { assert.fail(`Unexpected success with ${x}`); },
			errorMsg => {
				assert.match(getOrElse("unknown error", errorMsg), /Cannot read propert(y|ies) .* null/);
			}
		)
	);
});
