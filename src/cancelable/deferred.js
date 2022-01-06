/**
 * StaticLand: deferred.js
 *
 * Created by Matthias Seemann on 6.01.2022.
 * Copyright (c) 2022 Visisoft OHG. All rights reserved.
 */
import { once } from "semmel-ramda";

const
	noop = () => undefined,
	
	createDeferred = () => {
		let isResolved, isRejected, isCanceled, isSettled, outcomeValue;
		let pendingResolve = x => {
			isResolved = true;
			isRejected = false;
			isSettled = true;
			outcomeValue = x;
		};
		let pendingReject = e => {
			isRejected = true;
			isResolved = false;
			isSettled = true;
			outcomeValue = e;
		};
		const
			resolve = x => pendingResolve(x),
			reject = e => pendingReject(e),
			cancel = () => {
				isCanceled = true;
				pendingResolve = noop;
				pendingReject = noop;
			},
			
			cancelable = (forwardResolve, forwardReject) => {
				if (isSettled) {
					setTimeout(isResolved ? forwardResolve : forwardReject, 0, outcomeValue);
				}
				else if (!isCanceled) {
					pendingResolve = once(forwardResolve);
					pendingReject = once(forwardReject);
				}
				
				return cancel;
			};
		
		return {
			cancelable,
			resolve,
			reject,
			cancel
		};
	};

export default createDeferred;
