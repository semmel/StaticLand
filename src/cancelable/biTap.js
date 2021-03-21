import {curry, o, tap} from "semmel-ramda";

export default curry((fns, fnf, cc) => (resolve, reject) => cc(o(resolve, tap(fns)), o(reject, tap(fnf))));
