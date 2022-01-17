import {curry} from 'ramda';

const race = curry((ccA, ccB) => (resolve, reject) => {
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
});

export default race;
