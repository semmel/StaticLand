import {curry} from 'ramda';
import {map} from "../either.js";
import sequence from "./sequence.js";

export default curry((of_f, map_f, effect_to_f, ma) => sequence(of_f, map_f, map(effect_to_f, ma)));
