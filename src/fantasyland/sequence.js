import { curry, identity } from "ramda";
import liftA2 from "./liftA2.js";
import sequence_l from "../list/sequence.js";

const
	// :: (Applicative f, Traversable t) => TypeRep f -> t f a -> f t a
	sequence = curry((F, tfa) => {
		const
			of_f = F["fantasy-land/of"] ?? F.of ?? F,
			TypeRep = { 'fantasy-land/of': of_f };
		
		return tfa['fantasy-land/traverse']
			? tfa['fantasy-land/traverse'](TypeRep, identity)
			// assume t is Array
			: sequence_l(of_f, liftA2, tfa);
	});

export default sequence;
