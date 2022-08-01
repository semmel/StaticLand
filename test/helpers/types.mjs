/**
 * StaticLand: types.mjs
 *
 * Created by Matthias Seemann on 1.08.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

import chai from 'chai';

const
	assert = chai.assert,
	
	// see https://github.com/fantasyland/fantasy-land/tree/v4.0.1#type-representatives
	FL = {
		semigroup:      ['concat'],
		monoid:         ['concat', 'empty'],
		functor:        ['map'],
		apply:          ['map', 'ap'],
		applicative:    ['map', 'ap', 'of'],
		chain:          ['map', 'ap', 'chain'],
		chainRec:       ['map', 'ap', 'chain', 'chainRec'],
		monad:          { methods: ['map', 'ap', 'chain'], constructor: ['of'] },
		extend:         ['extend'],
		comonad:        ['extend', 'extract'],
		foldable:       ['reduce'],
		transformer:    ['lift']
	},
	
	assertCorrectInterface = type => obj => {
		FL[type].methods.forEach(methodName => {
			assert.isFunction(obj[`fantasy-land/${methodName}`], `type class "${type}" requires a method named "fantasy-land/${methodName}" to be defined.`);
		});
		
		FL[type].constructor.forEach(functionName => {
			assert.isFunction(obj.constructor[`fantasy-land/${functionName}`], `type class "${type}" requires a it's '.constructor' property to have a method named "fantasy-land/${functionName}".`);
		});
	};

export {
	assertCorrectInterface
};
