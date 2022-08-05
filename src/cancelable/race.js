import {curry} from 'ramda';
import addFantasyLandInterface from "./addFantasyLandInterface.js";

const race = curry((ccA, ccB) => {
	const
		cancelable = (resolve, reject) => {
			let
				cancelB,
				
				cancelA = ccA(
					x => {
						cancelB();
						resolve(x);
					},
					e => {
						cancelB();
						reject(e);
					}
				);
			
			cancelB = ccB(
				x => {
					cancelA();
					resolve(x);
				},
				e => {
					cancelA();
					reject(e);
				}
			);
			
			return () => {
				cancelA();
				cancelB();
			};
		};
	
	addFantasyLandInterface(cancelable);
	
	return cancelable;
});

export default race;
