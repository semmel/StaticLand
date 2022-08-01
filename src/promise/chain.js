import { curryN } from "ramda";

/**
 * StaticLand: chain.js
 *
 * Created by Matthias Seemann on 1.08.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */

const
	// this implementation enforces fn to return a promise
	// chain :: (a -> Promise e b) -> Promise g a -> Promise (e|g) b
	chain = curryN(2, (fn, aPromise) =>
		new Promise((resolve, reject_) => {
			aPromise
			.then(a =>
				fn(a).then(resolve)
			)
			.catch(reject_);
		})
	);

export default chain;
