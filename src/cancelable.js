/**
 * @typedef {function(function(*): void, function(*): void): function(): void} CancelableComputation
 */

import { curry, o, prop } from 'ramda';
import __ap from './cancelable/ap.js';
import __chain from './cancelable/chain.js';
import __laterSucceed from "./cancelable/internal/laterSucceed.js";
import __laterFail from "./cancelable/internal/laterFail.js";
import __race from './cancelable/race.js';
import __createDeferredFactory from "./cancelable/deferred.js";
import __cancelifyFactory from './cancelable/cancelify.js';
import __cancelifyWithArityAbortableFactory from './cancelable/cancelifyAbortable.js';
import __fetchResponseIsoModuleFactory from './cancelable/fetchResponseIsoModule.js';
import __fetchResponseFactory from './cancelable/fetchResponse.js';
import __fromNodeCallbackWithArityFactory from './cancelable/fromNodeCallback.js';
import __bi_tap from './cancelable/biTap.js';
import __bi_chain from './cancelable/biChain.js';
import __share from './cancelable/share.js';

const
	/**
	 * fantasy-land helper
	 * @param {CancelableComputation} cac
	 * @return {Cancelable<any>}
	 * @private
	 */
	__fantasyfy = cac => {
		cac.map = cac['fantasy-land/map'] = fn => map(fn, cac);
		cac.ap = cac['fantasy-land/ap'] = mfn => ap(mfn, cac);
		cac.chain = cac['fantasy-land/chain'] = fn => chain(fn, cac);

		/*
		Reassigning the .constructor property apparently does not do much harm.
		see  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/constructor
		"There is nothing protecting the constructor property from being re-assigned or shadowed, so using it to detect the type of a variable should usually be avoided in favor of less fragile ways like instanceof and Symbol.toStringTag for objects, or typeof for primitives."
		 */
		cac.constructor = {
			"fantasy-land/of": of,
			"fantasy-land/zero": never
		};

		return cac;
	},

	//// Creation ////

	// :: a -> Cancelable * a
	of = a => __fantasyfy(__laterSucceed(0, a)),

	// :: * -> Cancelable *
 	reject = value => __fantasyfy(__laterFail(0, value)),

	later = curry((dt, value) => __fantasyfy(__laterSucceed(dt, value))),

	laterReject = curry((dt, value) => __fantasyfy(__laterFail(dt, value))),

	never = () => __fantasyfy((unused, unusedToo) => () => {}),

	createDeferred = __createDeferredFactory(__fantasyfy),

	cancelify = __cancelifyFactory(__fantasyfy),

	cancelifyWithArityAbortable = __cancelifyWithArityAbortableFactory(__fantasyfy),

	fromNodeCallbackWithArity = __fromNodeCallbackWithArityFactory(__fantasyfy),

	fetchResponseIsoModule = __fetchResponseIsoModuleFactory(__fantasyfy),

	fetchResponse = __fetchResponseFactory(__fantasyfy),

	//// Transformation ////

	map = curry(
		(fn, cc) => __fantasyfy(
			(res, rej) => cc(o(res, fn), rej)
		)
	),

	bi_map = curry(
		(fnLeft, fnRight, cc) => __fantasyfy((res, rej) =>
			cc(o(res, fnRight), o(rej, fnLeft))
		)
	),

	coalesce = curry(
		(onFailure, onSuccess, cc) => __fantasyfy(
			(resolve, unused) => cc(o(resolve, onSuccess), o(resolve, onFailure))
		)
	),

	//// Combination ////

	ap = curry((ccF, ccB) => __fantasyfy(__ap(ccF, ccB))),

	chain = curry((fn, cc) => __fantasyfy(__chain(fn, cc))),

	bi_chain = curry((fnRej, fn, cc) => __fantasyfy(__bi_chain(fnRej, fn, cc))),

	race = curry((ccA, ccB) => __fantasyfy(__race(ccA, ccB))),

	// Combination Derivatives //

	liftA2 = curry((f, ma, mb) => ap(map(f, ma), mb)),

	liftA3 = curry((f, ma, mb, mc) => ap(ap(map(f, ma), mb), mc)),

	liftA4 = curry((f, ma, mb, mc, md) => ap(ap(ap(map(f, ma), mb), mc), md)),

	////// Side effects /////

	bi_tap = curry((fnf, fns, cc) => __fantasyfy(__bi_tap(fnf, fns, cc))),

	///// Misc /////

	share = o(__fantasyfy, __share),

	TypeRepresentative = {
		'fantasy-land/of': of,
		"fantasy-land/zero": never
	},

	/** @deprecated use Ramda's pluck */
	// :: Cancelable c => k -> c {k: v} -> c v
	pluck = curry((key, mc) => map(prop(key), mc));

export let addFantasyLandInterface = __fantasyfy;
export let biChain = bi_chain;
export let biMap = bi_map;

export {
	ap,
	bi_chain,
	bi_map,
	bi_tap,
	cancelify,
	cancelifyWithArityAbortable,
	chain,
	coalesce,
	createDeferred,
	fetchResponseIsoModule,
	fetchResponse,
	fromNodeCallbackWithArity,
	later,
	laterReject,
	liftA2,
	liftA3,
	liftA4,
	map,
	never,
	of,
	pluck,
	race,
	reject,
	share,
	TypeRepresentative
};
