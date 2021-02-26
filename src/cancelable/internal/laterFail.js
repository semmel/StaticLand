import {curry} from "semmel-ramda";

// :: Number -> e -> Cancelable e *
const laterFail = curry((dt, value) => (unused, reject) => {
	const timer = setTimeout(reject, dt, value);
	return () => { clearTimeout(timer); };
});

export default laterFail;
