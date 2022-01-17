import {curry} from 'ramda';
import chain from "./chain.js";
import map from "./map.js";

export default curry((mf, mx) => chain(f => map(f, mx), mf));
