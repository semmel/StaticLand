import {curry, o} from 'ramda';

export default curry((fn, cc) => (resolve, reject) => cc(o(resolve, fn), reject));
