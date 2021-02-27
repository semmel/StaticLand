import of from "../cancelable/of.js";
import reject from '../cancelable/reject.js';
import {either} from '../either.js';

export default either(reject, of);
