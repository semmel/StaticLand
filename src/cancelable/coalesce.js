import {curry, o} from 'ramda';

export default curry(
	(onFailure, onSuccess, cc) => (resolve, unused) =>
		cc(o(resolve, onSuccess), o(resolve, onFailure))
);
