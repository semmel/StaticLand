import {compose} from 'ramda';
import {just, maybe, nothing} from "../maybe.js";
import {map as map_c, of as of_c} from '../cancelable.js';

// A specialisation of the Maybe sequence:
// sequence(of_c, map_c)
export default maybe(compose(of_c, nothing), map_c(just));
