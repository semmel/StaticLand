import {curry, map} from "semmel-ramda";
import sequence from "./sequence.js";

export default curry((of_f, liftA2_f, effect_to_f, ma) =>
	sequence(of_f, liftA2_f, map(effect_to_f, ma)));
