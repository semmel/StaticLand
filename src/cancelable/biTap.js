import {curry, o, tap, tryCatch} from 'ramda';

export default curry((fnf, fns, cc) => (resolve, reject) => cc(
	tryCatch(o(resolve, tap(fns)), (e, ...args) => reject(e)),
	tryCatch(o(reject, tap(fnf)), (e_fnf, e) => reject(e_fnf))
));
