import {curry, o, tap} from "semmel-ramda";

export default curry((fnf, fns, cc) => (resolve, reject) => cc(o(resolve, tap(fns)), o(reject, tap(fnf))));
