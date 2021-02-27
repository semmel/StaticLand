import {curry, o} from "semmel-ramda";

export default curry((fn, cc) => (resolve, reject) => cc(o(resolve, fn), reject));
