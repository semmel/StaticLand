import {curry} from 'ramda';
import chain from "./chain.js";
import map from "./map.js";

/** @deprecated Use FL compliant utility function e.g. R.ap */
export default curry((mf, mx) => chain(f => map(f, mx), mf));
