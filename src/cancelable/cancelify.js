import { curryN } from 'ramda';
import addFantasyLandInterface from "./addFantasyLandInterface.js";

const
	cancelify = fn => curryN(fn.length, (...args) => {
		const cancelable = (res, rej) => {
			let
				resolveInner = res,
				rejectInner = rej;
			
			fn(...args).then(x => resolveInner(x), e => rejectInner(e));
			
			return () => {
				resolveInner = () => undefined;
				rejectInner = () => undefined;
			};
		};
		
		addFantasyLandInterface(cancelable);
		
		return cancelable;
	});

export default cancelify;
