import {compose} from "semmel-ramda";
import {just, maybe, nothing} from "../maybe.js";
import map_c from '../cancelable/map.js';
import of_c from '../cancelable/of.js';

export default maybe(compose(of_c, nothing), map_c(just));
