/**
 * StaticLand: io.js
 *
 * Created by Matthias Seemann on 5.12.2020.
 * Copyright (c) 2020 Visisoft OHG. All rights reserved.
 */

import {always, call, compose, curry, flip, o, partial} from 'ramda';

// Construction //

// TODO: Maybe remove all that context stuff to aide transforming into Promises
const
	// Context = *…
	// of :: (*… -> a) -> IO *… a
	of = fx => fx,

	// pure :: a -> IO () a
	pure = o(of, always),
	
	// Consumption //
	
	// run :: IO a -> *… -> a
	run = call,
	
// Mapping
	
	// map :: (a -> b) -> IO *… a -> IO *… b
	// map :: (a -> b) -> (*… -> a) -> (*… -> b)
	map = curry((fn, ma) => compose(fn, ma)),

	// chain :: (a -> IO b) -> IO a -> IO b
	// chain :: (a -> (m…n -> b)) -> (m…n -> a) -> (m…n -> b)
	// TODO: apply the context see https://github.com/ramda/ramda-fantasy/issues/63#issuecomment-130294891
	// if we want to support that
	chain = curry((fn, ma) => compose(run, fn, ma));

	// withArgs :: [m…n] -> IO a -> IO a
	// withArgs :: [m…n] -> (m…n -> a) -> () -> a
	//withArgs = flip(partial);

export {
	of,
	pure,
	run,
	map,
	chain
};



