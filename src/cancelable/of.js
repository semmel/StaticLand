import laterSucceed from "./internal/laterSucceed.js";

const
	// :: a -> Cancelable * a
	of = laterSucceed(0);

export default of;
