/**
 * StaticLand: ap.js
 *
 * Created by Matthias Seemann on 27.02.2021.
 * Copyright (c) 2021 Visisoft OHG. All rights reserved.
 */

import { curry } from "semmel-ramda";
const
	// Note: parallel execution
	// Sequential execution is derived from chain and map: ap(mf, ma) = chain(f => map(f, ma), mf)
	ap = curry((ccF, ccB) => (res, rej) => {
		let theF, theB, cancelB, hasB;
		const cancelF = ccF(
			f => {
				if (hasB) {
					res(f(theB));
				}
				else {
					theF = f;
				}
			},
			e => {
				if (!hasB) {
					cancelB();
				}
				rej(e);
			}
		);
		
		cancelB = ccB(
			b => {
				if (theF) {
					res(theF(b));
				}
				hasB = true;
			},
			e => {
				if (!theF) {
					cancelF();
				}
				rej(e);
			});
		
		return () => {
			if (!theF) {
				cancelF();
			}
			
			if (!hasB) {
				cancelB();
			}
		};
	});

export default ap;
