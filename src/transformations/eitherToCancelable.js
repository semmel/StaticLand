import {of, reject} from "../cancelable.js";
import {either} from '../either.js';

export default either(reject, of);
