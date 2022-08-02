import { curryN, prop } from 'ramda';
import map from "./map.js";

const
	pluck = curryN(2, (key, list) => map(prop(key), list));

export default pluck;
