import { curry, map } from "ramda";
import sequence from './sequence.js';

const
	// :: (Applicative f, Traversable t) => TypeRep f -> (a -> f b) -> t a -> f t b
	traverse = curry((F, f, ta) => {
		const
			of = F["fantasy-land/of"] ?? F.of ?? F,
			TypeRep = { 'fantasy-land/of': of };
		
		return ta['fantasy-land/traverse']
			? ta['fantasy-land/traverse'](TypeRep, f)
			// assume t is Array
			: sequence(TypeRep, map(f, ta));
	});
	
export default traverse;
